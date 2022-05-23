import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../../users/types';

export const GetFromUser = createParamDecorator(
  (data: keyof User, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    if (!data) return request.user;
    return request.user[data];
  },
);
