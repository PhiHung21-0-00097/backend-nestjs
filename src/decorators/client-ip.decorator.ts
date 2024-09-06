import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const GetClientIP = createParamDecorator((_, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const forwardedForHeader = request.headers['x-forwarded-for'];
  if (forwardedForHeader) {
    const ip = forwardedForHeader.split(',')[0].trim();
    return ip;
  } else {
    return request.connection.remoteAddress;
  }
});
