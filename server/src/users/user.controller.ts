import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AtGuard } from '../auth/guards';
import { CreateUserDto } from './dto';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AtGuard)
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    const dbUser = await this.userService.create({
      data: {
        username: createUserDto.username,
        password: createUserDto.password,
      },
    });

    return new UserEntity(dbUser);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AtGuard)
  @Get(':id')
  async getUser(@Param('id') id: string): Promise<UserEntity> {
    const dbUser = await this.userService.findUnique({
      where: {
        id,
      },
    });

    return new UserEntity(dbUser);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AtGuard)
  @Get()
  async listUsers(): Promise<UserEntity[]> {
    const dbUsers = await this.userService.findMany({});

    return dbUsers.map((u) => new UserEntity(u));
  }
}
