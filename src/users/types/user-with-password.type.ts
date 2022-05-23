import { User } from './user.type';

export type UserWithPassword = User & { password: string };
