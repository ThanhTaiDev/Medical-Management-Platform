import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pill, Calendar, Clock, User, FileText, X } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface PrescriptionItem {
  medicationId: string;
  medication?: {
    id: string;
    name: string;
    strength: string;
    form: string;
    unit?: string;
  };
  dosage: string;
  frequencyPerDay: number;
  timesOfDay: string[];
  durationDays: number;
  route?: string;
  instructions?: string;
}

interface PrescriptionPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  patient: {
    id: string;
    fullName: string;
    profile?: {
      gender?: string;
      birthDate?: string;
    };
  } | null;
  items: PrescriptionItem[];
  notes?: string;
  medications?: Array<{
    id: string;
    name: string;
    strength: string;
    form: string;
    unit?: string;
  }>;
}

const getTimeLabel = (time: string): string => {
  const map: Record<string, string> = {
    Sáng: "Sáng",
    Trưa: "Trưa",
    Chiều: "Chiều",
    Tối: "Tối",
    MORNING: "Sáng",
    NOON: "Trưa",
    AFTERNOON: "Chiều",
    EVENING: "Tối",
  };
  return map[time] || time;
};

const getRouteLabel = (route: string): string => {
  const map: Record<string, string> = {
    ORAL: "Uống",
    INJECTION: "Tiêm",
    TOPICAL: "Bôi ngoài",
    INHALATION: "Hít",
    OTHER: "Khác",
  };
  return map[route] || route;
};

const calculateEndDate = (durationDays: number): Date => {
  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + durationDays);
  return endDate;
};

export function PrescriptionPreviewModal({
  isOpen,
  onClose,
  onConfirm,
  patient,
  items,
  notes,
  medications = [],
}: PrescriptionPreviewModalProps) {
  const getMedicationName = (medicationId: string) => {
    const medication = medications.find((m) => m.id === medicationId);
    if (!medication) return "Không xác định";
    return `${medication.name} - ${medication.strength} ${medication.unit || ""}`;
  };

  const maxDurationDays = Math.max(...items.map((item) => item.durationDays || 7), 7);
  const endDate = calculateEndDate(maxDurationDays);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Pill className="h-5 w-5 text-primary" />
            Xem trước đơn thuốc
          </DialogTitle>
          <DialogDescription>
            Kiểm tra thông tin đơn thuốc trước khi xác nhận
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Patient Info */}
          {patient && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Thông tin bệnh nhân
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Tên bệnh nhân:</span>
                  <span className="text-sm">{patient.fullName}</span>
                </div>
                {patient.profile?.birthDate && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Ngày sinh:</span>
                    <span className="text-sm">
                      {format(new Date(patient.profile.birthDate), "dd/MM/yyyy", {
                        locale: vi,
                      })}
                    </span>
                  </div>
                )}
                {patient.profile?.gender && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Giới tính:</span>
                    <span className="text-sm">
                      {patient.profile.gender === "MALE"
                        ? "Nam"
                        : patient.profile.gender === "FEMALE"
                          ? "Nữ"
                          : "Khác"}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Prescription Items */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Pill className="h-4 w-4" />
                Danh sách thuốc ({items.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 border border-border rounded-lg bg-muted/20"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm mb-1">
                          {item.medication?.name || getMedicationName(item.medicationId)}
                        </h4>
                        {item.medication?.strength && (
                          <p className="text-xs text-muted-foreground">
                            {item.medication.strength} {item.medication.unit || ""}
                          </p>
                        )}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        #{index + 1}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-muted-foreground">Liều lượng:</span>
                        <span className="ml-2 font-medium">{item.dosage}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Số lần/ngày:</span>
                        <span className="ml-2 font-medium">
                          {item.frequencyPerDay || item.timesOfDay.length}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Số ngày:</span>
                        <span className="ml-2 font-medium">{item.durationDays} ngày</span>
                      </div>
                      {item.route && (
                        <div>
                          <span className="text-muted-foreground">Đường dùng:</span>
                          <span className="ml-2 font-medium">
                            {getRouteLabel(item.route)}
                          </span>
                        </div>
                      )}
                    </div>

                    {item.timesOfDay && item.timesOfDay.length > 0 && (
                      <div className="mt-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs font-medium text-muted-foreground">
                            Thời điểm uống:
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {item.timesOfDay.map((time, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {getTimeLabel(time)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {item.instructions && (
                      <div className="mt-3 pt-3 border-t border-border">
                        <div className="flex items-start gap-2">
                          <FileText className="h-3 w-3 text-muted-foreground mt-0.5" />
                          <div>
                            <span className="text-xs font-medium text-muted-foreground block mb-1">
                              Hướng dẫn:
                            </span>
                            <p className="text-xs text-foreground">{item.instructions}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {notes && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Ghi chú
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Tóm tắt
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Ngày bắt đầu:</span>
                <span className="font-medium">
                  {format(new Date(), "dd/MM/yyyy", { locale: vi })}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Ngày kết thúc dự kiến:</span>
                <span className="font-medium">
                  {format(endDate, "dd/MM/yyyy", { locale: vi })}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Tổng số ngày điều trị:</span>
                <span className="font-medium">{maxDurationDays} ngày</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Tổng số thuốc:</span>
                <span className="font-medium">{items.length} loại</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="flex gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Chỉnh sửa
          </Button>
          <Button type="button" onClick={onConfirm} className="bg-primary">
            <Pill className="h-4 w-4 mr-2" />
            Xác nhận tạo đơn
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

