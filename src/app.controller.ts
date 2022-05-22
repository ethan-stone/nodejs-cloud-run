import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { ApiExtension } from '@nestjs/swagger';
import { AppService } from './app.service';
import { Request as ExpressRequest } from 'express';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService, Token } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller('api')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
  ) {}

  @ApiExtension('x-google-backend', {
    address: '${api_backend}',
    path_translation: ['APPEND_PATH_TO_ADDRESS'],
  })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req: ExpressRequest): Promise<Token> {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: ExpressRequest) {
    return req.user;
  }
}
