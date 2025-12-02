import { ExecutionContext, createParamDecorator } from '@nestjs/common';
/**
 * Decorator để lấy thông tin user từ request
 * Sử dụng trong controllers để inject user info
 * 
 * @returns {ParameterDecorator} Parameter decorator
 */
export const UserInfo = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user?.[data] : user;
  }
);
