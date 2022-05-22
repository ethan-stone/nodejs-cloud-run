import { Controller, Get } from '@nestjs/common';
import { ApiExtension } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiExtension('x-google-backend', {
    address: '${api_backend}',
    path_translation: ['APPEND_PATH_TO_ADDRESS'],
  })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
