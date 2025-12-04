import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { DatabaseService } from '@/core/database/database.service';

@Injectable()
/**
 * Service quản lý thuốc
 * Xử lý CRUD operations cho medications
 * 
 * @class MedicationsService
 */
export class MedicationsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async list(
    isActive?: boolean,
    params?: {
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
      q?: string;
    }
  ) {
    const where: any = isActive === undefined ? {} : { isActive };
    
    // Add search functionality
    if (params?.q && params.q.trim()) {
      const searchTerm = params.q.trim();
      where.OR = [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { strength: { contains: searchTerm, mode: 'insensitive' } },
        { form: { contains: searchTerm, mode: 'insensitive' } },
        { unit: { contains: searchTerm, mode: 'insensitive' } },
        { description: { contains: searchTerm, mode: 'insensitive' } }
      ];
    }
    
    const page = params?.page && params.page > 0 ? params.page : 1;
    const limit = params?.limit && params.limit > 0 ? params.limit : 20;
    const orderByField = params?.sortBy || 'createdAt';
    const orderDir = params?.sortOrder || 'desc';
    const [items, total] = await Promise.all([
      this.databaseService.client.medication.findMany({
        where,
        orderBy: { [orderByField]: orderDir },
        skip: (page - 1) * limit,
        take: limit
      }),
      this.databaseService.client.medication.count({ where })
    ]);
    return { items, total, page, limit };
  }

  /**
   * Kiểm tra xem thuốc có trùng lặp 100% với thuốc khác không
   * So sánh tất cả các field: name, strength, form, unit, description
   */
  private async checkDuplicateMedication(
    data: {
      name: string;
      strength?: string;
      form?: string;
      unit?: string;
      description?: string;
    },
    excludeId?: string
  ): Promise<void> {
    // Normalize dữ liệu để so sánh (trim, lowercase)
    // Xử lý null, undefined, empty string đều thành empty string
    const normalize = (value?: string | null): string => {
      if (!value) return '';
      const trimmed = String(value).trim();
      return trimmed ? trimmed.toLowerCase() : '';
    };

    // Normalize input data - đảm bảo trim trước khi normalize
    const normalizedData = {
      name: normalize(data.name),
      strength: normalize(data.strength),
      form: normalize(data.form),
      unit: normalize(data.unit),
      description: normalize(data.description)
    };

    // Tìm tất cả thuốc có cùng name (case-insensitive)
    // Không filter theo các field khác vì cần so sánh tất cả các field
    const existingMedications = await this.databaseService.client.medication.findMany({
      where: {
        name: {
          equals: data.name.trim(),
          mode: 'insensitive'
        },
        ...(excludeId ? { id: { not: excludeId } } : {})
      }
    });

    // Kiểm tra từng thuốc xem có trùng 100% không
    for (const existing of existingMedications) {
      const normalizedExisting = {
        name: normalize(existing.name),
        strength: normalize(existing.strength),
        form: normalize(existing.form),
        unit: normalize(existing.unit),
        description: normalize(existing.description)
      };

      // So sánh tất cả các field - phải giống nhau 100%
      const isExactMatch = 
        normalizedData.name === normalizedExisting.name &&
        normalizedData.strength === normalizedExisting.strength &&
        normalizedData.form === normalizedExisting.form &&
        normalizedData.unit === normalizedExisting.unit &&
        normalizedData.description === normalizedExisting.description;

      if (isExactMatch) {
        throw new ConflictException(
          'Thuốc đã tồn tại trong hệ thống. Vui lòng kiểm tra lại thông tin thuốc.'
        );
      }
    }
  }

  async create(data: {
    name: string;
    strength?: string;
    form?: string;
    unit?: string;
    description?: string;
  }) {
    // Kiểm tra trùng lặp trước khi tạo
    await this.checkDuplicateMedication(data);

    // Tạo thuốc mới
    return this.databaseService.client.medication.create({
      data: {
        name: data.name.trim(),
        strength: data.strength?.trim() || null,
        form: data.form?.trim() || null,
        unit: data.unit?.trim() || null,
        description: data.description?.trim() || null
      }
    });
  }

  async update(
    id: string,
    data: {
      name?: string;
      strength?: string;
      form?: string;
      unit?: string;
      description?: string;
      isActive?: boolean;
    }
  ) {
    const med = await this.databaseService.client.medication.findUnique({
      where: { id }
    });
    if (!med) throw new NotFoundException('Medication not found');

    // Nếu có thay đổi các field có thể gây trùng lặp, kiểm tra lại
    const hasRelevantChanges =
      data.name !== undefined ||
      data.strength !== undefined ||
      data.form !== undefined ||
      data.unit !== undefined ||
      data.description !== undefined;

    if (hasRelevantChanges) {
      // Tạo object với dữ liệu mới (merge với dữ liệu cũ)
      const mergedData = {
        name: data.name ?? med.name,
        strength: data.strength ?? med.strength ?? undefined,
        form: data.form ?? med.form ?? undefined,
        unit: data.unit ?? med.unit ?? undefined,
        description: data.description ?? med.description ?? undefined
      };

      // Kiểm tra trùng lặp (loại trừ chính nó)
      await this.checkDuplicateMedication(mergedData, id);
    }

    return this.databaseService.client.medication.update({
      where: { id },
      data
    });
  }

  async deactivate(id: string) {
    const med = await this.databaseService.client.medication.findUnique({
      where: { id }
    });
    if (!med) throw new NotFoundException('Medication not found');
    return this.databaseService.client.medication.update({
      where: { id },
      data: { isActive: false }
    });
  }
}
