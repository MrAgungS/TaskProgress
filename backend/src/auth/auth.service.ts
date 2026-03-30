import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { RedisService } from 'src/common/redis/redis.service';
import { LoginUserDto, LogoutDto, RegisterUserDto } from 'src/model/auth.model';
import { Logger } from 'winston';
import bcrypt from 'bcrypt';
import { ValidationService } from 'src/common/validation/validation.service';
import { AuthValidation } from './auth.validation';
import { JwtBlacklistService } from 'src/security/services/jwt-blacklist.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private validationService: ValidationService,
    private prismaService: PrismaService,
    private redisService: RedisService,
    private jwtService: JwtService,
    private blacklist: JwtBlacklistService,
  ) {}

  // Generates a short-lived access token (15 minutes)
  private generateAccessToken(user_id: number, email: string) {
    return this.jwtService.sign(
      { sub: user_id, email },
      { secret: process.env.JWT_SECRET, expiresIn: '15m' },
    );
  }

  // Generates a long-lived refresh token (7 days)
  private generateRefreshToken(user_id: number, email: string) {
    return this.jwtService.sign(
      { sub: user_id, email },
      { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' },
    );
  }

  // Storing a hash instead of the raw token adds an extra layer of security.
  private async saveRefreshToken(user_id: number, refresh_token: string) {
    const hashed = await bcrypt.hash(refresh_token, 10);
    await this.redisService.set(
      `refresh_token:${user_id}`,
      hashed,
      7 * 24 * 60 * 60,
    );
  }

  // Registers a new user after validating input and checking for duplicate emails.
  // Password is hashed before being stored in the database.
  async register(request: RegisterUserDto) {
    this.logger.debug('Registering user with email: %s', request.email);
    const registerRequest = this.validationService.validate(
      AuthValidation.REGISTER,
      request,
    ) as RegisterUserDto;

    const existingUser = await this.prismaService.user.count({
      where: { email: registerRequest.email },
    });
    if (existingUser != 0) {
      throw new ConflictException('Email already exists');
    }

    registerRequest.password = await bcrypt.hash(registerRequest.password, 10);
    const user = await this.prismaService.user.create({
      data: registerRequest,
    });

    return {
      email: user.email,
      name: user.name,
    };
  }

  // Validates user credentials and returns a new access + refresh token pair.
  // Refresh token is saved to Redis for future validation.
  async login(request: LoginUserDto) {
    this.logger.debug('Logging in user with email: %s', request.email);
    const loginRequest = this.validationService.validate(
      AuthValidation.LOGIN,
      request,
    ) as LoginUserDto;

    const user = await this.prismaService.user.findUnique({
      where: { email: loginRequest.email },
    });
    if (!user) throw new ConflictException('Invalid email');
    const isMatch = await bcrypt.compare(loginRequest.password, user.password);
    if (!isMatch) throw new ConflictException('Invalid email or password');

    const access_token = this.generateAccessToken(user.id, user.email);
    const refresh_token = this.generateRefreshToken(user.id, user.email);
    await this.saveRefreshToken(user.id, refresh_token);

    return {
      access_token,
      refresh_token,
    };
  }

  // Issues a new access + refresh token pair using a valid refresh token.
  // Implements token rotation — old refresh token is replaced with a new one.
  async refresh(refresh_token: string) {
    let payload: { sub: number };
    try {
      payload = this.jwtService.verify(refresh_token, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    } catch {
      throw new UnauthorizedException('Refresh token is invalid or expired');
    }

    const storedToken = await this.redisService.get(
      `refresh_token:${payload.sub}`,
    );
    if (!storedToken) throw new ForbiddenException('Refresh token not found');
    const isMatch = await bcrypt.compare(refresh_token, storedToken);
    if (!isMatch) throw new ForbiddenException('Refresh token is invalid');

    const user = await this.prismaService.user.findUnique({
      where: { id: payload.sub },
    });
    if (!user) throw new ForbiddenException('User not found');

    // Generate and save new token pair (token rotation)
    const newAccessToken = this.generateAccessToken(user.id, user.email);
    const newRefreshToken = this.generateRefreshToken(user.id, user.email);
    await this.saveRefreshToken(user.id, newRefreshToken);

    return {
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
    };
  }

  // Logs out the user by blacklisting the access token and deleting the refresh token from Redis.
  // After logout, both tokens are immediately invalidated.
  async logout(request: LogoutDto) {
    this.logger.debug('Logging out user with ID: %s', request.user_id);
    const logoutRequest = this.validationService.validate(
      AuthValidation.LOGOUT,
      request,
    ) as LogoutDto;

    await this.blacklist.blackListToken(logoutRequest.access_token);
    await this.redisService.del(`refresh_token:${logoutRequest.user_id}`);

    return {
      message: 'Logout Success',
    };
  }
}
