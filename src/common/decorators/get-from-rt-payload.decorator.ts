import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RefreshToken } from '../../auth/types';

export const GetFromRtPayload = createParamDecorator(
  (data: keyof RefreshToken | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    if (!data) return request.user;
    return request.user[data];
  },
);
