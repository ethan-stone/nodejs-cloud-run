import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiExtension } from '@nestjs/swagger';
import { SessionContainer } from 'supertokens-node/recipe/session';
import { AppService } from './app.service';
import { AtGuard, SuperTokensGuard } from './auth/guards';
import { Session } from './common/decorators';

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

  @UseGuards(SuperTokensGuard)
  @Get('test')
  async getTest(@Session() session: SessionContainer): Promise<string> {
    console.log(session);
    return 'magic';
  }
}
