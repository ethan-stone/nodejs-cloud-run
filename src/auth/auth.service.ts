import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/types';
import { UsersService } from '../users/users.service';
import { AccessToken, RefreshToken, SignupArgs, Tokens } from './types';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(username: string, pass: string): Promise<User> {
    const user = await this.usersService.findUnique({
      where: {
        username,
      },
    });
    if (!user) return null;

    const isValid = argon2.verify(user.password, pass);

    if (isValid) {
      return user;
    }
    return null;
  }

  async signup(signupArgs: SignupArgs): Promise<Tokens> {
    const hashedPassword = await argon2.hash(signupArgs.password);

    const user = await this.usersService.create({
      data: {
        username: signupArgs.username,
        password: hashedPassword,
      },
    });

    return this.getTokens(
      { sub: user.id },
      { sub: user.id, tokenVersion: user.tokenVersion },
    );
  }

  async login(user: User): Promise<Tokens> {
    return this.getTokens(
      { sub: user.id },
      { sub: user.id, tokenVersion: user.tokenVersion },
    );
  }

  async refreshTokens(userId: string): Promise<Tokens> {
    const user = await this.usersService.findUnique({
      where: {
        id: userId,
      },
    });

    return this.getTokens(
      { sub: user.id },
      { sub: user.id, tokenVersion: user.tokenVersion },
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
