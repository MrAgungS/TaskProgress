import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

// Passport strategy for validating refresh tokens.
// Registered as 'jwt-refresh' to distinguish it from the main JWT access token strategy.
@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refresh_token'),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET as string,
      passReqToCallback: true,
    });
  }

  // Called after the token signature and expiry are verified by Passport.
  // Returns the user data that will be attached to req.user.
  validate(req: Request, payload: JwtPayload) {
    const refreshToken = (req.body as { refresh_token?: string })
      ?.refresh_token;
    if (!refreshToken) throw new UnauthorizedException();

    return { id: payload.sub, refreshToken };
  }
}
