import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from './types';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(args: Prisma.UserCreateArgs): Promise<User> {
    return this.prisma.user.create(args);
  }

  async findUnique(args: Prisma.UserFindUniqueArgs): Promise<User | undefined> {
    return this.prisma.user.findUnique(args);
  }

  async findMany(args: Prisma.UserFindManyArgs): Promise<User[]> {
    return this.prisma.user.findMany(args);
  }
}
