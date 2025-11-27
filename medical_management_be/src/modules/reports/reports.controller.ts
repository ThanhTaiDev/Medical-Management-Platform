import { Controller, Get, Post, Body, HttpException, HttpStatus, Res } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { ReportsService } from './reports.service';
import { UserInfo } from '@/common/decorators/users.decorator';
import { IUserFromToken } from '@/modules/users/types/user.type';
import { UserRole } from '@prisma/client';
import { SkipTransform } from '@/common/decorators/skip-transform.decorator';

@Controller('admin/reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('overview')
  async overview(@UserInfo() user: IUserFromToken) {
    if (user.roles !== UserRole.ADMIN) {
      throw new HttpException('Bạn không có quyền', HttpStatus.FORBIDDEN);
    }
    return this.reportsService.overview();
  }

  @Post('export')
  @SkipTransform()
  async exportReport(
    @UserInfo() user: IUserFromToken,
    @Res() reply: FastifyReply,
    @Body() body?: {
      startDate?: string;
      endDate?: string;
    }
  ) {
    if (user.roles !== UserRole.ADMIN) {
      throw new HttpException('Bạn không có quyền', HttpStatus.FORBIDDEN);
    }

    try {
      const buffer = await this.reportsService.exportOverallReport(body);
      const fileName = `bao-cao-tong-quan-${new Date().toISOString().split('T')[0]}.xlsx`;
      const excelBuffer = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);

      reply
        .header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        .header('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}"`)
        .send(excelBuffer);
    } catch (error: any) {
      console.error('Error exporting report:', error);
      const errorMessage = error?.message || 'Lỗi khi xuất báo cáo';
      reply
        .code(HttpStatus.INTERNAL_SERVER_ERROR)
        .header('Content-Type', 'application/json')
        .send({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: errorMessage,
          error: 'Internal Server Error'
        });
    }
  }
}
