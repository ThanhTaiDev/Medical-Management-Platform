import { z } from "zod";

// Schema cho tạo mới chuyên khoa
export const createMajorSchema = z.object({
  code: z.string()
    .min(1, "Mã chuyên khoa không được để trống")
    .max(50, "Mã chuyên khoa không được quá 50 ký tự")
    .regex(/^[A-Z_]+$/, "Mã chuyên khoa chỉ được chứa chữ hoa và dấu gạch dưới"),
  name: z.string()
    .min(1, "Tên chuyên khoa không được để trống")
    .max(100, "Tên chuyên khoa không được quá 100 ký tự"),
  nameEn: z.string()
    .max(100, "Tên tiếng Anh không được quá 100 ký tự")
    .optional()
    .or(z.literal("")),
  description: z.string()
    .max(500, "Mô tả không được quá 500 ký tự")
    .optional()
    .or(z.literal("")),
  isActive: z.boolean().default(true),
  sortOrder: z.number()
    .int("Thứ tự phải là số nguyên")
    .min(0, "Thứ tự không được âm")
    .max(999, "Thứ tự không được quá 999")
    .default(0),
});

// Schema cho cập nhật chuyên khoa
export const updateMajorSchema = createMajorSchema.partial().extend({
  id: z.string().min(1, "ID không được để trống"),
});

// Schema cho cập nhật trạng thái
export const updateStatusSchema = z.object({
  id: z.string().min(1, "ID không được để trống"),
  isActive: z.boolean(),
});

// Schema cho xóa chuyên khoa
export const deleteMajorSchema = z.object({
  id: z.string().min(1, "ID không được để trống"),
  name: z.string().min(1, "Tên chuyên khoa không được để trống"),
});

// Types
export type CreateMajorFormData = z.infer<typeof createMajorSchema>;
export type UpdateMajorFormData = z.infer<typeof updateMajorSchema>;
export type UpdateStatusFormData = z.infer<typeof updateStatusSchema>;
export type DeleteMajorFormData = z.infer<typeof deleteMajorSchema>;
