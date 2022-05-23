import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AtGuard } from '../auth/guards';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AtGuard)
  @Get(':id')
  async getUser(@Param('id') id: string): Promise<UserEntity> {
    const dbUser = await this.userService.findById(parseInt(id));

    return new UserEntity(dbUser);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AtGuard)
  @Get()
  async listUsers(): Promise<UserEntity[]> {
    const dbUsers = await this.userService.list();

    return dbUsers.map((u) => new UserEntity(u));
  }
}
