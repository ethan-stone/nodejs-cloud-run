import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { RefreshToken } from '../types';
import { Request as ExpressRequest } from 'express';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_REFRESH_SECRET_KEY'),
      passReqToCallback: true,
    });
  }

  validate(req: ExpressRequest, payload: RefreshToken): RefreshToken {
    console.log(`RT: ${JSON.stringify(payload)}`);
    return payload;
  }
}
