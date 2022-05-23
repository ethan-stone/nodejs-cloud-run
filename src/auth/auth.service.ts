import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/types';
import { UsersService } from '../users/users.service';
import { AccessToken, RefreshToken, Tokens } from './types';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(username: string, pass: string): Promise<User> {
    const user = await this.usersService.findOne(username);
    if (user && user.password === pass) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User): Promise<Tokens> {
    return this.getTokens(
      { sub: user.id },
      { sub: user.id, version: user.tokenVersion },
    );
  }

  async refreshTokens(userId: number): Promise<Tokens> {
    const user = await this.usersService.findById(userId);

    return this.getTokens(
      { sub: user.id },
      { sub: user.id, version: user.tokenVersion },
    );
  }

  async getTokens(
    atPayload: AccessToken,
    rtPayload: RefreshToken,
  ): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(atPayload, {
        secret: this.configService.get('JWT_ACCESS_SECRET_KEY'),
        expiresIn: '5m',
      }),
      this.jwtService.signAsync(rtPayload, {
        secret: this.configService.get('JWT_REFRESH_SECRET_KEY'),
        expiresIn: '7d',
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }
}
