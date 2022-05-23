import { Exclude } from 'class-transformer';
import { User } from '../types';

export class UserEntity {
  id: User['id'];
  username: User['username'];
  tokenVersion: User['tokenVersion'];

  @Exclude()
  password: User['password'];

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
