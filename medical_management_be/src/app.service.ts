import { Injectable } from '@nestjs/common';

/**
 * Service chính của ứng dụng
 * Cung cấp các phương thức cơ bản cho AppController
 */
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
