import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { PatientService } from './patient.service';
import { UserInfo } from '@/common/decorators/users.decorator';
import { IUserFromToken } from '@/modules/users/types/user.type';
import { AdherenceStatus, UserRole } from '@prisma/client';
import { Public, SkipPermission } from '@/common/decorators/isPublicRoute';
import { SkipTransform } from '@/common/decorators/skip-transform.decorator';

@Controller('patient')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  private ensurePatient(user: IUserFromToken) {
    if (user.roles !== UserRole.PATIENT) {
      throw new HttpException('Bạn không có quyền', HttpStatus.FORBIDDEN);
    }
  }

  // Route cụ thể phải đặt trước route có parameter động
  @Get('fields')
  @SkipTransform()
  async getAllPatientFields(@UserInfo() user: IUserFromToken) {
    this.ensurePatient(user);
    return this.patientService.getPatientAllFields(user.id);
  }

  @Put('fields')
  @SkipTransform()
  async updatePatientFields(
    @UserInfo() user: IUserFromToken,
    @Body() body: {
      fullName?: string;
      phoneNumber?: string;
      password?: string;
      gender?: string;
      birthDate?: string;
      address?: string;
      email?: string;
      height?: number;
      weight?: number;
    }
  ) {
    this.ensurePatient(user);
    return this.patientService.updatePatientFields(user.id, body);
  }

  // Danh sách tất cả bệnh nhân (Admin/Doctor dùng để tra cứu)
  @Get('get-all')
  @Public()
  @SkipPermission()
  async listPatients(
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    return this.patientService.listAllPatients({
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined
    });
  }

  // Tìm kiếm bệnh nhân theo tên/số điện thoại
  @Get('search')
  @Public()
  @SkipPermission()
  async search(
    @Query('q') q?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    return this.patientService.searchPatients({
      q,
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined
    });
  }

  // Chi tiết bệnh nhân cho bác sĩ
  @Get(':id/detail')
  @Public()
  @SkipPermission()
  async getPatientDetail(@Param('id') id: string) {
    return this.patientService.getPatientDetailForDoctor(id);
  }

  // Cập nhật thông tin bệnh nhân
  @Post(':id')
  async updatePatient(
    @Param('id') id: string,
    @Body()
    body: {
      fullName?: string;
      phoneNumber?: string;
      password?: string;
      role?: string;
      status?: string;
      profile?: {
        gender?: string;
        birthDate?: string;
        address?: string;
        birthYear?: number;
      };
    }
  ) {
    return this.patientService.updatePatient(id, body);
  }

  // Xóa bệnh nhân
  @Post(':id/delete')
  async deletePatient(@Param('id') id: string) {
    return this.patientService.deletePatient(id);
  }

  // Đơn thuốc & nhắc nhở - moved to PatientPrescriptionsController
  // Prescriptions routes moved to PatientPrescriptionsController
  // Lịch sử đơn thuốc
  @Get('history')
  async history(
    @UserInfo() user: IUserFromToken,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc'
  ) {
    this.ensurePatient(user);
    return this.patientService.listHistory(user.id, {
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      sortBy,
      sortOrder
    });
  }
  // Lịch sử uống thuốc
  @Get('reminders')
  async reminders(
    @UserInfo() user: IUserFromToken,
    @Query('date') date?: string
  ) {
    this.ensurePatient(user);
    return this.patientService.getReminders(user.id, date);
  }

  // Prescriptions confirmation moved to PatientPrescriptionsController

  @Get('adherence')
  async adherence(@UserInfo() user: IUserFromToken) {
    this.ensurePatient(user);
    return this.patientService.adherenceHistory(user.id);
  }

  @Post('adherence/export')
  @SkipTransform()
  async exportAdherenceHistory(
    @UserInfo() user: IUserFromToken,
    @Res() reply: FastifyReply,
    @Body() body?: {
      startDate?: string;
      endDate?: string;
    }
  ) {
    this.ensurePatient(user);

    try {
      const buffer = await this.patientService.exportMedicationHistory(
        user.id,
        body
      );
      const fileName = `bao-cao-lich-su-dung-thuoc-${new Date().toISOString().split('T')[0]}.xlsx`;
      const excelBuffer = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);

      reply
        .header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        .header('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}"`)
        .send(excelBuffer);
    } catch (error: any) {
      console.error('Error exporting adherence history:', error);
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

  @Get('overview')
  async overview(@UserInfo() user: IUserFromToken) {
    this.ensurePatient(user);
    return this.patientService.overview(user.id);
  }

  // Cảnh báo
  @Get('alerts')
  async alerts(@UserInfo() user: IUserFromToken) {
    this.ensurePatient(user);
    return this.patientService.listAlerts(user.id);
  }

  // ========== Medical History Management ==========
  
  @Get('medical-history')
  @SkipTransform()
  async getMedicalHistory(@UserInfo() user: IUserFromToken) {
    this.ensurePatient(user);
    return this.patientService.getMedicalHistory(user.id);
  }

  // Conditions (Tiền sử bệnh)
  @Post('medical-history/conditions')
  @SkipTransform()
  async addCondition(
    @UserInfo() user: IUserFromToken,
    @Body() body: { condition: string }
  ) {
    this.ensurePatient(user);
    return this.patientService.addCondition(user.id, body.condition);
  }

  @Put('medical-history/conditions')
  @SkipTransform()
  async updateConditions(
    @UserInfo() user: IUserFromToken,
    @Body() body: { conditions: string[] }
  ) {
    this.ensurePatient(user);
    return this.patientService.updateConditions(user.id, body.conditions);
  }

  @Delete('medical-history/conditions/:index')
  @SkipTransform()
  async deleteCondition(
    @UserInfo() user: IUserFromToken,
    @Param('index') index: string
  ) {
    this.ensurePatient(user);
    return this.patientService.deleteCondition(user.id, parseInt(index));
  }

  // Allergies (Dị ứng)
  @Post('medical-history/allergies')
  @SkipTransform()
  async addAllergy(
    @UserInfo() user: IUserFromToken,
    @Body() body: { allergen: string }
  ) {
    this.ensurePatient(user);
    return this.patientService.addAllergy(user.id, body.allergen);
  }

  @Put('medical-history/allergies')
  @SkipTransform()
  async updateAllergies(
    @UserInfo() user: IUserFromToken,
    @Body() body: { allergies: string[] }
  ) {
    this.ensurePatient(user);
    return this.patientService.updateAllergies(user.id, body.allergies);
  }

  @Delete('medical-history/allergies/:index')
  @SkipTransform()
  async deleteAllergy(
    @UserInfo() user: IUserFromToken,
    @Param('index') index: string
  ) {
    this.ensurePatient(user);
    return this.patientService.deleteAllergy(user.id, parseInt(index));
  }

  // Surgeries (Phẫu thuật)
  @Post('medical-history/surgeries')
  @SkipTransform()
  async addSurgery(
    @UserInfo() user: IUserFromToken,
    @Body() body: { surgery: string }
  ) {
    this.ensurePatient(user);
    return this.patientService.addSurgery(user.id, body.surgery);
  }

  @Put('medical-history/surgeries')
  @SkipTransform()
  async updateSurgeries(
    @UserInfo() user: IUserFromToken,
    @Body() body: { surgeries: string[] }
  ) {
    this.ensurePatient(user);
    return this.patientService.updateSurgeries(user.id, body.surgeries);
  }

  @Delete('medical-history/surgeries/:index')
  @SkipTransform()
  async deleteSurgery(
    @UserInfo() user: IUserFromToken,
    @Param('index') index: string
  ) {
    this.ensurePatient(user);
    return this.patientService.deleteSurgery(user.id, parseInt(index));
  }

  // Lifestyle (Lối sống)
  @Put('medical-history/lifestyle')
  @SkipTransform()
  async updateLifestyle(
    @UserInfo() user: IUserFromToken,
    @Body() body: { lifestyle: string }
  ) {
    this.ensurePatient(user);
    return this.patientService.updateLifestyle(user.id, body.lifestyle);
  }
}
