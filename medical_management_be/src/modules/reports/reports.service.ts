import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/core/database/database.service';
import { AdherenceStatus, UserStatus, PrescriptionStatus } from '@prisma/client';
import * as ExcelJS from 'exceljs';

@Injectable()
/**
 * Service tạo báo cáo
 * Xử lý các loại báo cáo thống kê và xuất Excel
 * 
 * @class ReportsService
 */
export class ReportsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async overview() {
    const [
      totalPrescriptions,
      activePatients,
      totalTakenLogs,
      totalPrescriptionItems
    ] = await Promise.all([
      this.databaseService.client.prescription.count(),
      this.databaseService.client.user.count({
        where: { status: UserStatus.ACTIVE }
      }),
      this.databaseService.client.adherenceLog.count({
        where: { status: AdherenceStatus.TAKEN }
      }),
      this.databaseService.client.prescriptionItem.count()
    ]);

    const adherenceRate =
      totalPrescriptionItems > 0 ? totalTakenLogs / totalPrescriptionItems : 0;

    return {
      totalPrescriptions,
      activePatients,
      adherenceRate
    };
  }

  async exportOverallReport(filters?: {
    startDate?: string;
    endDate?: string;
  }) {
    const where: any = {};

    if (filters?.startDate || filters?.endDate) {
      where.createdAt = {};
      if (filters.startDate) {
        where.createdAt.gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        const endDate = new Date(filters.endDate);
        endDate.setHours(23, 59, 59, 999);
        where.createdAt.lte = endDate;
      }
    }

    // Get detailed statistics
    const [
      prescriptions,
      activePrescriptions,
      completedPrescriptions,
      cancelledPrescriptions,
      patients,
      adherenceLogs,
      prescriptionItems
    ] = await Promise.all([
      this.databaseService.client.prescription.findMany({
        where,
        include: {
          patient: { select: { fullName: true, phoneNumber: true } },
          doctor: { select: { fullName: true } },
          items: {
            include: { medication: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      this.databaseService.client.prescription.count({
        where: { ...where, status: PrescriptionStatus.ACTIVE }
      }),
      this.databaseService.client.prescription.count({
        where: { ...where, status: PrescriptionStatus.COMPLETED }
      }),
      this.databaseService.client.prescription.count({
        where: { ...where, status: PrescriptionStatus.CANCELLED }
      }),
      this.databaseService.client.user.findMany({
        where: { status: UserStatus.ACTIVE, role: 'PATIENT' },
        select: { id: true, fullName: true, phoneNumber: true, createdAt: true }
      }),
      this.databaseService.client.adherenceLog.findMany({
        where: filters?.startDate || filters?.endDate ? {
          createdAt: where.createdAt
        } : {},
        include: {
          prescriptionItem: {
            include: {
              prescription: {
                include: {
                  patient: { select: { fullName: true } }
                }
              },
              medication: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      this.databaseService.client.prescriptionItem.findMany({
        where: filters?.startDate || filters?.endDate ? {
          prescription: where
        } : {},
        include: {
          medication: true,
          prescription: {
            include: {
              patient: { select: { fullName: true } }
            }
          }
        }
      })
    ]);

    const totalTaken = adherenceLogs.filter(log => log.status === AdherenceStatus.TAKEN).length;
    const totalMissed = adherenceLogs.filter(log => log.status === AdherenceStatus.MISSED).length;
    const totalSkipped = adherenceLogs.filter(log => log.status === AdherenceStatus.SKIPPED).length;
    const adherenceRate = prescriptionItems.length > 0 ? totalTaken / prescriptionItems.length : 0;

    // Create workbook
    const workbook = new ExcelJS.Workbook();

    // Sheet 1: Executive Summary
    const summarySheet = workbook.addWorksheet('Tổng Quan');
    summarySheet.columns = [
      { header: 'Chỉ số', key: 'metric', width: 30 },
      { header: 'Giá trị', key: 'value', width: 20 }
    ];
    summarySheet.getRow(1).font = { bold: true };
    summarySheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };

    summarySheet.addRow({ metric: 'Tổng số đơn thuốc', value: prescriptions.length });
    summarySheet.addRow({ metric: 'Đơn đang điều trị', value: activePrescriptions });
    summarySheet.addRow({ metric: 'Đơn hoàn thành', value: completedPrescriptions });
    summarySheet.addRow({ metric: 'Đơn đã hủy', value: cancelledPrescriptions });
    summarySheet.addRow({ metric: 'Số bệnh nhân', value: patients.length });
    summarySheet.addRow({ metric: 'Tổng số liều đã lên lịch', value: prescriptionItems.length });
    summarySheet.addRow({ metric: 'Số liều đã uống', value: totalTaken });
    summarySheet.addRow({ metric: 'Số liều bỏ lỡ', value: totalMissed });
    summarySheet.addRow({ metric: 'Số liều bỏ qua', value: totalSkipped });
    summarySheet.addRow({ metric: 'Tỉ lệ tuân thủ (%)', value: `${(adherenceRate * 100).toFixed(2)}%` });

    // Sheet 2: Prescriptions
    const prescriptionsSheet = workbook.addWorksheet('Đơn Thuốc');
    prescriptionsSheet.columns = [
      { header: 'Mã đơn', key: 'id', width: 36 },
      { header: 'Bệnh nhân', key: 'patient', width: 25 },
      { header: 'Bác sĩ', key: 'doctor', width: 25 },
      { header: 'Trạng thái', key: 'status', width: 15 },
      { header: 'Ngày bắt đầu', key: 'startDate', width: 20 },
      { header: 'Ngày kết thúc', key: 'endDate', width: 20 },
      { header: 'Ghi chú', key: 'notes', width: 30 },
      { header: 'Ngày tạo', key: 'createdAt', width: 20 }
    ];
    prescriptionsSheet.getRow(1).font = { bold: true };
    prescriptionsSheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };

    prescriptions.forEach(prescription => {
      prescriptionsSheet.addRow({
        id: prescription.id,
        patient: prescription.patient?.fullName || prescription.patientId,
        doctor: prescription.doctor?.fullName || prescription.doctorId,
        status: prescription.status === PrescriptionStatus.ACTIVE ? 'Đang điều trị' :
                prescription.status === PrescriptionStatus.COMPLETED ? 'Hoàn thành' : 'Đã hủy',
        startDate: prescription.startDate ? new Date(prescription.startDate).toLocaleDateString('vi-VN') : '',
        endDate: prescription.endDate ? new Date(prescription.endDate).toLocaleDateString('vi-VN') : '',
        notes: prescription.notes || '',
        createdAt: prescription.createdAt ? new Date(prescription.createdAt).toLocaleDateString('vi-VN') : ''
      });
    });

    // Sheet 3: Adherence Logs
    const adherenceSheet = workbook.addWorksheet('Lịch Sử Tuân Thủ');
    adherenceSheet.columns = [
      { header: 'Ngày giờ', key: 'createdAt', width: 20 },
      { header: 'Bệnh nhân', key: 'patient', width: 25 },
      { header: 'Thuốc', key: 'medication', width: 30 },
      { header: 'Liều dùng', key: 'dosage', width: 15 },
      { header: 'Trạng thái', key: 'status', width: 15 },
      { header: 'Số lượng', key: 'amount', width: 15 },
      { header: 'Ghi chú', key: 'notes', width: 30 }
    ];
    adherenceSheet.getRow(1).font = { bold: true };
    adherenceSheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };

    adherenceLogs.forEach(log => {
      adherenceSheet.addRow({
        createdAt: log.createdAt ? new Date(log.createdAt).toLocaleString('vi-VN') : '',
        patient: log.prescriptionItem?.prescription?.patient?.fullName || '',
        medication: log.prescriptionItem?.medication?.name || '',
        dosage: log.prescriptionItem?.dosage || '',
        status: log.status === AdherenceStatus.TAKEN ? 'Đã uống' :
                log.status === AdherenceStatus.MISSED ? 'Bỏ lỡ' : 'Bỏ qua',
        amount: log.amount || '',
        notes: log.notes || ''
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }
}
