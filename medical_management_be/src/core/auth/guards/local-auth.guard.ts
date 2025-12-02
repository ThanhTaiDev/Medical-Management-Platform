import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
/**
 * Guard để xác thực local (username/password)
 * Sử dụng cho login endpoint
 * 
 * @class LocalAuthGuard
 */
export class LocalAuthGuard extends AuthGuard('local') {}
