import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiExtension } from '@nestjs/swagger';
import { AppService } from './app.service';
import { AtGuard } from './auth/guards';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiExtension('x-google-backend', {
    address: '${api_backend}',
    path_translation: ['APPEND_PATH_TO_ADDRESS'],
  })
  @UseGuards(AtGuard)
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
