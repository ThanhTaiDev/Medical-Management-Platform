import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NotificationsService } from '@/modules/notifications/notifications.service';
import { DatabaseService } from '@/core/database/database.service';
import { AdherenceStatus } from '@prisma/client';

@Injectable()
export class MedicationReminderScheduler {
  private readonly logger = new Logger(MedicationReminderScheduler.name);

  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly databaseService: DatabaseService
  ) {}

  // Chạy mỗi phút để kiểm tra nhắc nhở uống thuốc
  @Cron(CronExpression.EVERY_MINUTE)
  async handleMedicationReminders() {
    try {
      this.logger.log('Checking for medication reminders...');

      const remindersCreated =
        await this.notificationsService.scheduleMedicationReminders();

      if (remindersCreated > 0) {
        this.logger.log(`Created ${remindersCreated} medication reminders`);
      }
    } catch (error) {
      this.logger.error('Error scheduling medication reminders:', error);
    }
  }

  // Chạy hàng ngày lúc 9:00 sáng để tạo cảnh báo tuân thủ thấp
  @Cron('0 9 * * *')
  async handleLowAdherenceAlerts() {
    try {
      this.logger.log('Checking for low adherence patterns...');

      // Lấy tất cả bệnh nhân có đơn thuốc đang hoạt động
      const activePatients = await this.databaseService.client.user.findMany({
        where: {
          role: 'PATIENT',
          status: 'ACTIVE',
          prescriptionsAsPatient: {
            some: {
              status: 'ACTIVE'
            }
          }
        },
        include: {
          prescriptionsAsPatient: {
            where: {
              status: 'ACTIVE'
            }
          }
        }
      });

      for (const patient of activePatients) {
        await this.checkPatientAdherence(patient.id);
      }

      this.logger.log(`Checked adherence for ${activePatients.length} patients`);
    } catch (error) {
      this.logger.error('Error checking low adherence:', error);
    }
  }

  /**
   * Kiểm tra tỷ lệ tuân thủ của một bệnh nhân
   */
  private async checkPatientAdherence(patientId: string) {
    try {
      // Lấy dữ liệu tuân thủ 7 ngày gần nhất
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const adherenceLogs = await this.databaseService.client.adherenceLog.findMany({
        where: {
          patientId: patientId,
          takenAt: {
            gte: sevenDaysAgo
          }
        }
      });

      if (adherenceLogs.length === 0) {
        return; // Không có dữ liệu để kiểm tra
      }

      const totalDoses = adherenceLogs.length;
      const takenDoses = adherenceLogs.filter(log => log.status === 'TAKEN').length;
      const adherenceRate = (takenDoses / totalDoses) * 100;

      // Nếu tỷ lệ tuân thủ dưới 70%, tạo cảnh báo
      if (adherenceRate < 70) {
        const patient = await this.databaseService.client.user.findUnique({
          where: { id: patientId },
          include: {
            prescriptionsAsPatient: {
              where: { status: 'ACTIVE' },
              include: {
                doctor: {
                  select: { id: true, fullName: true }
                }
              }
            }
          }
        });

        if (patient && patient.prescriptionsAsPatient.length > 0) {
          const prescription = patient.prescriptionsAsPatient[0];
          const doctorId = prescription.doctorId;

          // Kiểm tra xem đã có cảnh báo LOW_ADHERENCE chưa được resolve chưa
          const existingAlert = await this.databaseService.client.alert.findFirst({
            where: {
              patientId: patientId,
              doctorId: doctorId,
              type: 'LOW_ADHERENCE',
              resolved: false,
              createdAt: {
                gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Trong 24h gần đây
              }
            }
          });

          if (!existingAlert) {
            await this.databaseService.client.alert.create({
              data: {
                prescriptionId: prescription.id,
                patientId: patientId,
                doctorId: doctorId,
                type: 'LOW_ADHERENCE',
                message: `Tỷ lệ tuân thủ uống thuốc của bệnh nhân ${patient.fullName} trong 7 ngày qua là ${Math.round(adherenceRate)}%. Cần theo dõi và nhắc nhở.`,
                resolved: false
              }
            });

            this.logger.log(`Created low adherence alert for patient ${patient.fullName} (${adherenceRate.toFixed(1)}%)`);
          }
        }
      }
    } catch (error) {
      this.logger.error(`Error checking adherence for patient ${patientId}:`, error);
    }
  }

  // Chạy lúc 0h00 mỗi ngày để đánh dấu các lượt uống thuốc PENDING thành MISSED
  @Cron('0 0 * * *')
  async markMissedDosesAtMidnight() {
    try {
      this.logger.log('Starting midnight missed dose marking process...');

      // Sử dụng UTC để tránh vấn đề timezone
      const now = new Date();
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      
      const startOfYesterday = new Date(
        yesterday.getUTCFullYear(),
        yesterday.getUTCMonth(),
        yesterday.getUTCDate()
      );
      const endOfYesterday = new Date(
        yesterday.getUTCFullYear(),
        yesterday.getUTCMonth(),
        yesterday.getUTCDate() + 1
      );

      this.logger.log(`Checking for missed doses on ${startOfYesterday.toISOString().slice(0, 10)}`);

      // Lấy tất cả prescription items đang hoạt động
      const activePrescriptionItems = await this.databaseService.client.prescriptionItem.findMany({
        where: {
          prescription: {
            status: 'ACTIVE',
            startDate: { lte: endOfYesterday },
            OR: [
              { endDate: null },
              { endDate: { gte: startOfYesterday } }
            ]
          }
        },
        include: {
          prescription: {
            include: {
              patient: {
                select: {
                  id: true,
                  fullName: true
                }
              },
              doctor: {
                select: {
                  id: true,
                  fullName: true
                }
              }
            }
          },
          medication: {
            select: {
              name: true,
              strength: true
            }
          },
          logs: {
            where: {
              takenAt: {
                gte: startOfYesterday,
                lt: endOfYesterday
              }
            }
          }
        }
      });

      let missedDosesCreated = 0;
      const missedDosesByPatient = new Map<string, number>();

      for (const item of activePrescriptionItems) {
        // Tạo unique dose ID cho từng thời điểm uống thuốc trong ngày hôm qua
        for (const timeOfDay of item.timesOfDay) {
          const uniqueDoseId = `${item.id}-${startOfYesterday.toISOString().slice(0, 10)}-${timeOfDay}`;
          
          // Kiểm tra xem đã có log cho thời điểm này chưa
          const existingLog = item.logs.find(log => log.notes === uniqueDoseId);
          
          if (!existingLog) {
            try {
              // Tạo AdherenceLog với status MISSED
              await this.databaseService.client.adherenceLog.create({
                data: {
                  prescriptionId: item.prescriptionId,
                  prescriptionItemId: item.id,
                  patientId: item.prescription.patientId,
                  takenAt: new Date(startOfYesterday.getTime() + this.getTimeInMs(timeOfDay)),
                  status: AdherenceStatus.MISSED,
                  notes: uniqueDoseId
                }
              });

              // Đếm số lượt MISSED cho từng bệnh nhân
              const patientId = item.prescription.patientId;
              missedDosesByPatient.set(patientId, (missedDosesByPatient.get(patientId) || 0) + 1);
              
              missedDosesCreated++;

              this.logger.log(
                `Marked missed dose: ${item.medication.name} (${item.dosage}) at ${timeOfDay} for patient ${item.prescription.patient.fullName}`
              );
            } catch (logError) {
              this.logger.error(
                `Failed to create missed dose log for ${item.medication.name} at ${timeOfDay}:`,
                logError
              );
            }
          }
        }
      }

      // Tạo cảnh báo cho bác sĩ nếu bệnh nhân có nhiều lượt MISSED
      for (const [patientId, missedCount] of missedDosesByPatient) {
        if (missedCount >= 2) { // Nếu có 2 lượt MISSED trở lên
          // Tìm prescription và thông tin bệnh nhân/bác sĩ
          const patientItem = activePrescriptionItems.find(item => item.prescription.patientId === patientId);
          
          if (patientItem?.prescription.patient && patientItem?.prescription.doctor) {
            const patient = patientItem.prescription.patient;
            const doctor = patientItem.prescription.doctor;
            const prescriptionId = patientItem.prescriptionId;
            
            // Kiểm tra xem đã có alert cho bệnh nhân này trong ngày chưa
            const existingAlert = await this.databaseService.client.alert.findFirst({
              where: {
                patientId: patientId,
                doctorId: doctor.id,
                type: 'MISSED_DOSE',
                resolved: false,
                createdAt: {
                  gte: startOfYesterday,
                  lt: endOfYesterday
                }
              }
            });
            
            if (!existingAlert) {
              await this.databaseService.client.alert.create({
                data: {
                  prescriptionId: prescriptionId,
                  patientId: patientId,
                  doctorId: doctor.id,
                  type: 'MISSED_DOSE',
                  message: `Bệnh nhân ${patient.fullName} đã bỏ lỡ ${missedCount} lượt uống thuốc trong ngày ${startOfYesterday.toISOString().slice(0, 10)}. Cần theo dõi và nhắc nhở.`,
                  resolved: false
                }
              });

              this.logger.log(
                `Created missed dose alert for doctor ${doctor.fullName} - Patient ${patient.fullName} missed ${missedCount} doses`
              );
            } else {
              this.logger.log(
                `Alert already exists for patient ${patient.fullName} on ${startOfYesterday.toISOString().slice(0, 10)}`
              );
            }
          }
        }
      }

      this.logger.log(`Midnight missed dose marking completed. Created ${missedDosesCreated} missed dose logs.`);
    } catch (error) {
      this.logger.error('Error marking missed doses at midnight:', error);
    }
  }

  /**
   * Chuyển đổi thời gian từ format HH:MM sang milliseconds
   */
  private getTimeInMs(timeString: string): number {
    const [hours, minutes] = timeString.split(':').map(Number);
    return (hours * 60 + minutes) * 60 * 1000;
  }

  // Chạy mỗi 30 phút để kiểm tra thuốc sắp uống
  @Cron('*/30 * * * *')
  async handleUpcomingMedicationReminders() {
    try {
      this.logger.log('Checking for upcoming medication reminders...');

      const now = new Date();
      const in30Minutes = new Date(now.getTime() + 30 * 60 * 1000);

      // Lấy tất cả prescription items có thời gian uống trong 30 phút tới
      const upcomingItems = await this.databaseService.client.prescriptionItem.findMany({
        where: {
          prescription: {
            status: 'ACTIVE',
            startDate: { lte: now },
            OR: [
              { endDate: null },
              { endDate: { gte: now } }
            ]
          }
        },
        include: {
          prescription: {
            include: {
              patient: {
                select: {
                  id: true,
                  fullName: true,
                  phoneNumber: true
                }
              }
            }
          },
          medication: true
        }
      });

      let remindersCreated = 0;

      for (const item of upcomingItems) {
        for (const timeOfDay of item.timesOfDay) {
          const [hours, minutes] = timeOfDay.split(':').map(Number);
          const scheduledTime = new Date();
          scheduledTime.setHours(hours, minutes, 0, 0);

          // Kiểm tra xem thời gian uống có trong khoảng 30 phút tới không
          if (scheduledTime >= now && scheduledTime <= in30Minutes) {
            // Kiểm tra xem đã có nhắc nhở cho thời điểm này chưa
            const existingReminder = await this.databaseService.client.alert.findFirst({
              where: {
                prescriptionId: item.prescriptionId,
                patientId: item.prescription.patientId,
                type: 'MISSED_DOSE',
                resolved: false,
                createdAt: {
                  gte: new Date(now.getTime() - 60 * 60 * 1000) // Trong 1 giờ gần đây
                }
              }
            });

            if (!existingReminder) {
              await this.databaseService.client.alert.create({
                data: {
                  prescriptionId: item.prescriptionId,
                  patientId: item.prescription.patientId,
                  type: 'MISSED_DOSE',
                  message: `Nhắc nhở: Đến giờ uống ${item.medication.name} (${item.dosage}) lúc ${timeOfDay}`,
                  resolved: false
                }
              });

              remindersCreated++;
            }
          }
        }
      }

      if (remindersCreated > 0) {
        this.logger.log(`Created ${remindersCreated} upcoming medication reminders`);
      }
    } catch (error) {
      this.logger.error('Error handling upcoming medication reminders:', error);
    }
  }
}
