import { Injectable } from '@nestjs/common';
import { UserWithPassword } from './types';

@Injectable()
export class UsersService {
  private readonly users: UserWithPassword[] = [
    {
      id: 1,
      username: 'user1',
      password: 'password1',
      tokenVersion: 0,
    },
    {
      id: 2,
      username: 'user2',
      password: 'password2',
      tokenVersion: 0,
    },
  ];

  async findOne(username: string): Promise<UserWithPassword | undefined> {
    return this.users.find((user) => user.username === username);
  }

  async findById(id: number): Promise<UserWithPassword | undefined> {
    return this.users.find((user) => user.id === id);
  }

  async list(): Promise<UserWithPassword[]> {
    return this.users;
  }
}
