import React, { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DoctorApi } from "@/api/doctor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import toast from "react-hot-toast";

const DoctorMissisPillPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [sinceDays, setSinceDays] = useState<number>(90);
  const [search, setSearch] = useState<string>("");

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["doctor-missed", sinceDays],
    queryFn: () => DoctorApi.listPatientsMissed(sinceDays),
    staleTime: 30_000
  });

  const warnMutation = useMutation({
    mutationFn: (args: { patientId: string; message?: string }) => DoctorApi.warnPatient(args.patientId, args.message),
    onSuccess: async () => {
      toast.success("Đã nhắc nhở bệnh nhân!", { duration: 2000 });
      await queryClient.invalidateQueries({ queryKey: ["doctor-missed"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Gửi nhắc nhở thất bại");
    }
  });

  const filteredItems = useMemo(() => {
    const items = data?.items ?? [];
    if (!search.trim()) return items;
    const q = search.trim().toLowerCase();
    return items.filter(x => x.fullName.toLowerCase().includes(q) || x.phoneNumber?.toLowerCase().includes(q));
  }, [data?.items, search]);

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const getSeverity = (count: number) => {
    if (count >= 5) return { label: 'Cao', className: 'bg-red-100 text-red-700 border-red-200' };
    if (count >= 3) return { label: 'Trung bình', className: 'bg-amber-100 text-amber-700 border-amber-200' };
    return { label: 'Thấp', className: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
  };

  const copyPhone = async (phone?: string) => {
    if (!phone) return;
    try {
      await navigator.clipboard.writeText(phone);
    } catch {}
  };

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto w-full">
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <CardTitle className="text-xl md:text-2xl">Bệnh nhân bỏ lỡ thuốc gần đây</CardTitle>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Input
              placeholder="Tìm theo tên/số điện thoại"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-64"
            />
            <Select value={String(sinceDays)} onValueChange={(v) => setSinceDays(parseInt(v))}>
              <SelectTrigger className="w-28">
                <SelectValue placeholder="Khoảng ngày" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3 ngày</SelectItem>
                <SelectItem value="7">7 ngày</SelectItem>
                <SelectItem value="14">14 ngày</SelectItem>
                <SelectItem value="30">30 ngày</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="secondary" onClick={() => refetch()} disabled={isFetching}>
              Làm mới
            </Button>
          </div>
        </CardHeader>
        <Separator />
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-3 items-center">
                  <div className="col-span-5 flex items-center gap-3">
                    <Skeleton className="h-9 w-9 rounded-full" />
                    <div className="space-y-2 w-2/3">
                      <Skeleton className="h-3 w-2/3" />
                      <Skeleton className="h-3 w-1/3" />
                    </div>
                  </div>
                  <div className="col-span-3"><Skeleton className="h-3 w-24 ml-auto" /></div>
                  <div className="col-span-4"><Skeleton className="h-8 w-36 ml-auto" /></div>
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="text-sm text-red-600">Không tải được dữ liệu. Vui lòng thử lại.</div>
          ) : (filteredItems?.length ?? 0) === 0 ? (
            <div className="text-sm text-muted-foreground">Không có bệnh nhân nào bỏ lỡ thuốc trong khoảng thời gian này.</div>
          ) : (
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-slate-50 to-slate-100">
                    <TableHead className="uppercase text-slate-600 text-xs tracking-wider">Tên bệnh nhân</TableHead>
                    <TableHead className="uppercase text-slate-600 text-xs tracking-wider">Số điện thoại</TableHead>
                    <TableHead className="text-right uppercase text-slate-600 text-xs tracking-wider">Số lần bỏ lỡ</TableHead>
                    <TableHead className="text-right uppercase text-slate-600 text-xs tracking-wider">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((row) => (
                    <TableRow key={row.patientId} className="hover:bg-muted/30">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback>{getInitials(row.fullName)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium leading-none">{row.fullName}</div>
                            <div className="text-xs text-muted-foreground">ID: {row.patientId.slice(0, 8)}...</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{row.phoneNumber}</span>
                          <Button size="sm" variant="outline" onClick={() => copyPhone(row.phoneNumber)}>Copy</Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {(() => {
                          const sev = getSeverity(row.missedCount);
                          return (
                            <Badge className={`border ${sev.className}`}>{row.missedCount} • {sev.label}</Badge>
                          );
                        })()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="sm"
                                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                                  onClick={() => warnMutation.mutate({ patientId: row.patientId })}
                                  disabled={warnMutation.isPending}
                                >
                                  Nhắc nhở tuân thủ
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                Gửi cảnh báo tuân thủ tới bệnh nhân
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={4}>
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full gap-2 text-sm text-muted-foreground py-2">
                        <div>
                          Khoảng thời gian: {sinceDays} ngày • Tổng: {data?.total ?? 0}
                        </div>
                        <div className="opacity-70">
                          Cập nhật: {new Date(data?.since ?? Date.now()).toLocaleString()}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorMissisPillPage;

