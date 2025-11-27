import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Res
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { UsersService } from './users.service';
import { UserInfo } from '@/common/decorators/users.decorator';
import { IUserFromToken } from '@/modules/users/types/user.type';
import RegisterDto from '@/core/auth/dtos/register.dto';
import { UpdateUserDto } from './dtos/update.dto';
import { UserRole, UserStatus } from '@prisma/client';
import { SkipTransform } from '@/common/decorators/skip-transform.decorator';

@Controller('admin/users')
export class AdminUsersController {
  constructor(private readonly usersService: UsersService) {}

  private ensureAdmin(user: IUserFromToken) {
    console.log('🔍 CHECKING ADMIN PERMISSION - User:', user);
    console.log('🔍 User roles:', user?.roles);
    console.log('🔍 Is admin?', user?.roles === UserRole.ADMIN);

    if (user.roles !== UserRole.ADMIN) {
      console.log('❌ ADMIN PERMISSION DENIED');
      throw new HttpException('Bạn không có quyền', HttpStatus.FORBIDDEN);
    }
    console.log('✅ ADMIN PERMISSION GRANTED');
  }

  @Get()
  async list(
    @Query('role') role: UserRole | undefined,
    @UserInfo() user: IUserFromToken,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
    @Query('search') search?: string
  ) {
    this.ensureAdmin(user);
    return this.usersService.adminListUsers({
      role,
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      sortBy,
      sortOrder,
      search
    });
  }

  @Get(':id')
  async detail(@Param('id') id: string, @UserInfo() user: IUserFromToken) {
    this.ensureAdmin(user);
    return this.usersService.findById(id);
  }

  @Post()
  async create(@Body() body: RegisterDto, @UserInfo() user: IUserFromToken) {
    console.log('🚀 ADMIN CREATE USER ENDPOINT HIT!');
    console.log('Request body:', body);
    console.log('User from token:', user);

    this.ensureAdmin(user);
    console.log('Admin creating user - Full user object:', user);
    console.log('Admin creating user - Body:', body);
    console.log('Admin creating user - User ID:', user?.id);
    return this.usersService.adminCreateUser(body, user.id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateUserDto,
    @UserInfo() user: IUserFromToken
  ) {
    this.ensureAdmin(user);
    return this.usersService.adminUpdateUser(id, body);
  }

  @Delete(':id')
  async softDelete(@Param('id') id: string, @UserInfo() user: IUserFromToken) {
    this.ensureAdmin(user);
    return this.usersService.adminSoftDeleteUser(id);
  }

  @Post('export')
  @SkipTransform()
  async exportUsers(
    @UserInfo() user: IUserFromToken,
    @Res() reply: FastifyReply,
    @Body() body?: {
      role?: UserRole;
      status?: UserStatus;
      startDate?: string;
      endDate?: string;
    }
  ) {
    this.ensureAdmin(user);

    try {
      const buffer = await this.usersService.exportUsersToExcel(body);

      const fileName = `danh-sach-nguoi-dung-${new Date().toISOString().split('T')[0]}.xlsx`;

      // Ensure buffer is a Buffer instance
      const excelBuffer = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);

      reply
        .header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        .header('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}"`)
        .send(excelBuffer);
    } catch (error: any) {
      console.error('Error exporting users to Excel:', error);
      const errorMessage = error?.message || 'Lỗi khi xuất Excel';
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
