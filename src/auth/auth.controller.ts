import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard, RtGuard } from './guards';
import { RefreshToken, Tokens } from './types';
import { GetFromUser, GetFromRtPayload } from '../common/decorators';
import { User } from '../users/types';
import { SignupArgsDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/signup')
  async signup(@Body() signupArgs: SignupArgsDto): Promise<Tokens> {
    return this.authService.signup(signupArgs);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@GetFromUser() user: User): Promise<Tokens> {
    console.log(`login: ${JSON.stringify(user)}`);
    return this.authService.login(user);
  }

  @UseGuards(RtGuard)
  @Post('/refresh')
  async refreshTokens(
    @GetFromRtPayload('sub') sub: string,
    @GetFromRtPayload() refreshToken: RefreshToken,
  ): Promise<Tokens> {
    console.log(`refresh: ${JSON.stringify(refreshToken)}`);
    return this.authService.refreshTokens(sub);
  }
}
