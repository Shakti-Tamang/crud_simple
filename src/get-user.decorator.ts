
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthRequest } from './auth-request.interface';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<AuthRequest>();
    return request.user;
  },
);