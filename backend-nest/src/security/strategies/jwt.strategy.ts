import { UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { JwtBlacklistService } from '../services/jwt-blacklist.service';
import { Request } from 'express';

// Main Passport strategy for validating JWT access tokens on protected routes.
// Runs on every request that passes through JwtAuthGuard.
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private prisma: PrismaService,
    private blacklist: JwtBlacklistService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET as string,
      passReqToCallback: true,
    });
  }

  // Called after Passport verifies the token signature and expiry.
  // Returns the authenticated user which will be attached to req.user.
  async validate(req: Request, payload: JwtPayload) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    if (!token) throw new UnauthorizedException('Token not found');

    const isBlackListed = await this.blacklist.IsBlackListed(token);
    if (isBlackListed)
      throw new UnauthorizedException('Token has been blacklisted');

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) throw new UnauthorizedException();

    return user;
  }
}
