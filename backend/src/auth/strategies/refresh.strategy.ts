import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthJwtPayload } from '../types/auth-jwtPayload';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../auth.service';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'refresh-jwt',
) {
  constructor(private authService: AuthService) {
    const secret = process.env.REFRESH_JWT_SECRET;

    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  // authorization: Bearer sldfk;lsdkf'lskald'sdkf;sdl

  validate(req: Request, payload: AuthJwtPayload) {
    const refreshToken = req.get('authorization').replace('Bearer', '').trim();
    const userId = payload.sub;
    return this.authService.validateRefreshToken(userId, refreshToken);
  }
}
