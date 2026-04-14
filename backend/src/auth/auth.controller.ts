import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto, RegisterUserDto } from 'src/model/auth.model';
import { Public } from 'src/security/decorators/public.decorator';
import { JwtRefreshGuard } from 'src/security/guards/jwt-refresh.guard';

// Remember that earlier i set JwtAuthGuard as APP_GUARD
// which means all routes are automatically protected and require a token. Well,
// @Public() is the exception.
@Controller('/api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('/register')
  async register(@Body() request: RegisterUserDto) {
    return this.authService.register(request);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async login(@Body() request: LoginUserDto) {
    return this.authService.login(request);
  }

  @Public()
  @UseGuards(JwtRefreshGuard)
  @HttpCode(HttpStatus.OK)
  @Post('/refresh')
  async refresh(@Request() req: { user: { refreshToken: string } }) {
    return this.authService.refresh(req.user.refreshToken);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/logout')
  async logout(
    @Request()
    req: {
      user: { id: number };
      headers: { authorization: string };
    },
  ) {
    const token = req.headers.authorization.split(' ')[1];
    const logoutDto = {
      user_id: req.user.id,
      access_token: token,
    };
    return this.authService.logout(logoutDto);
  }
}
