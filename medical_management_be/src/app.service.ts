import { Injectable } from '@nestjs/common';

/**
 * Service chính của ứng dụng
 * Cung cấp các phương thức cơ bản cho AppController
 * 
 * @class AppService
 * @description Service xử lý các logic cơ bản của ứng dụng
 */
@Injectable()
export class AppService {
  /**
   * Trả về thông điệp chào mừng
   * @returns {string} Thông điệp chào mừng
   */
  getHello(): string {
    return 'Hello World!';
  }
}
