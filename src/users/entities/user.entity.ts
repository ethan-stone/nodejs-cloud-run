import { Exclude } from 'class-transformer';
import { UserWithPassword } from '../types';

export class UserEntity {
  id: UserWithPassword['id'];
  username: UserWithPassword['username'];
  tokenVersion: UserWithPassword['tokenVersion'];

  @Exclude()
  password: UserWithPassword['password'];

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
