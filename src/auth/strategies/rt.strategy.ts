import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { RefreshToken } from '../types';
import { Request as ExpressRequest } from 'express';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: (req: ExpressRequest) => req.cookies['jid'],
      secretOrKey: configService.get('JWT_REFRESH_SECRET_KEY'),
    });
  }

  async validate(payload: RefreshToken): Promise<RefreshToken> {
    const user = await this.usersService.findUnique({
      where: {
        id: payload.sub,
      },
    });

    if (!user) throw new UnauthorizedException();

    if (user.tokenVersion !== payload.tokenVersion)
      throw new UnauthorizedException();

    console.log(`RT: ${JSON.stringify(payload)}`);
    return payload;
  }
}
