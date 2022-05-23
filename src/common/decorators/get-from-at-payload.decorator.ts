import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AccessToken } from '../../auth/types';

export const GetFromAtPayload = createParamDecorator(
  (data: keyof AccessToken | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    if (!data) return request.user;
    return request.user[data];
  },
);
