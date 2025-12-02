import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './core/core.module';
import { FeatureModuleModule } from '@/modules/feature-module.module';

/**
 * Module chính của ứng dụng NestJS
 * Quản lý tất cả các module và dependencies
 */
/**
 * Root module của ứng dụng
 * Import tất cả các modules và cấu hình global
 * 
 * @class AppModule
 */
@Module({
  imports: [CoreModule, FeatureModuleModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
