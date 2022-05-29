import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Response,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AtGuard, LocalAuthGuard, RtGuard } from './guards';
import { RefreshToken, Tokens } from './types';
import {
  GetFromUser,
  GetFromRtPayload,
  GetFromAtPayload,
} from '../common/decorators';
import { User } from '../users/types';
import { SignupArgsDto } from './dto';
import { Response as ExpressResponse } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('signup')
  async signup(@Body() signupArgs: SignupArgsDto): Promise<Tokens> {
    return this.authService.signup(signupArgs);
  }

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async login(
    @GetFromUser() user: User,
    @Response() res: ExpressResponse,
  ): Promise<void> {
    console.log(`login: ${JSON.stringify(user)}`);
    const tokens = await this.authService.signin(user);

    res.cookie('jid', tokens.refresh_token, {
      httpOnly: true,
    });

    res.send({
      access_token: tokens.access_token,
    });
  }

  @UseGuards(RtGuard)
  @Post('refresh')
  async refreshTokens(
    @GetFromRtPayload('sub') sub: string,
    @GetFromRtPayload() refreshToken: RefreshToken,
    @Response() res: ExpressResponse,
  ): Promise<void> {
    const tokens = await this.authService.refreshTokens(sub);
    console.log(`refresh: ${JSON.stringify(refreshToken)}`);

    res.cookie('jid', tokens.refresh_token, {
      httpOnly: true,
    });

    res.send({
      access_token: tokens.access_token,
    });
  }

  @UseGuards(AtGuard)
  @HttpCode(200)
  @Post('signout')
  async signout(@GetFromAtPayload('sub') sub: string): Promise<void> {
    await this.authService.signout(sub);
  }

  @UseGuards(AuthGuard('google-oauth20'))
  @Get('signin/google')
  async signinWithGoogle(@Req() req) {}

  @UseGuards(AuthGuard('google-oauth20'))
  @Get('google/callback')
  async googleAuthRedirect(@Req() req) {
    return this.authService.loginWithGoogle(req);
  }
}
