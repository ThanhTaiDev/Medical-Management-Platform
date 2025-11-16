import React from "react";
import { useQuery } from "@tanstack/react-query";
import { MedicationsApi } from "@/api/medications";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pill } from "lucide-react";

export default function DoctorMedicationsPage() {
  const [q, setQ] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);

  // TODO: REMOVE THIS - TEMPORARY BYPASS FOR TESTING
  const token = localStorage.getItem("accessToken");
  
  // Query để lấy danh sách thuốc
  const { data, isLoading, error } = useQuery({
    queryKey: ["medications", { page, limit }],
    queryFn: () => MedicationsApi.list({ page, limit }),
    enabled: !!token,
    retry: false,
  });
  
  // Mock medication data when no token (bypass mode) - Only 1 for Figma design
  const mockMedicationData = !token ? {
    items: [{
      id: "mock-med-1",
      name: "Paracetamol",
      strength: "500mg",
      form: "tablet",
      unit: "viên",
      isActive: true,
      createdAt: new Date().toISOString(),
    }],
    total: 1,
    page: 1,
    limit: limit,
  } : null;

  // Xử lý dữ liệu từ API
  const items = React.useMemo(() => {
    const listData = (!token && mockMedicationData) ? mockMedicationData : data;
    if (!listData) return [];
    
    // API trả về { items: [...], total: number, page: number, limit: number }
    const list = listData?.items || [];
    if (!Array.isArray(list)) return [];
    
    // Lọc theo search query
    if (!q) return list;
    const qLower = q.toLowerCase();
    return list.filter((m: any) =>
      [m?.name, m?.strength, m?.form, m?.unit]
        .filter(Boolean)
        .some((v: string) => String(v).toLowerCase().includes(qLower))
    );
  }, [data, q, token, mockMedicationData]);

  const total = (!token && mockMedicationData) ? mockMedicationData.total : (data?.total || 0);
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          <Pill className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Danh sách thuốc</h2>
          <p className="text-xs text-muted-foreground">Tra cứu nhanh thuốc dùng khi kê đơn</p>
        </div>
      </div>

      {/* Hiển thị lỗi nếu có */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">
            Lỗi khi tải dữ liệu: {error?.message || "Không thể kết nối đến server"}
          </p>
        </div>
      )}

      <Card className="border-border/20">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Input
                placeholder="Tìm theo tên, hàm lượng, dạng bào chế..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="max-w-md"
              />
              <Badge variant="secondary">{isLoading ? "Đang tải..." : `${total || items.length} thuốc`}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Hiển thị</span>
              <select
                className="h-9 rounded-md border border-input bg-background px-2 text-sm"
                value={limit}
                onChange={(e) => {
                  const v = Number(e.target.value) || 10;
                  setLimit(v);
                  setPage(1);
                }}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span className="text-sm text-muted-foreground">mỗi trang</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-border/20 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên thuốc</TableHead>
                  <TableHead>Hàm lượng</TableHead>
                  <TableHead>Dạng</TableHead>
                  <TableHead>Đơn vị</TableHead>
                  <TableHead>Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((m: any) => (
                  <TableRow key={m.id}>
                    <TableCell className="font-medium">{m.name || "N/A"}</TableCell>
                    <TableCell>{m.strength || "N/A"}</TableCell>
                    <TableCell>{m.form || "N/A"}</TableCell>
                    <TableCell>{m.unit || "N/A"}</TableCell>
                    <TableCell>
                      {m.isActive ? (
                        <Badge className="bg-emerald-500/15 text-emerald-600">Đang dùng</Badge>
                      ) : (
                        <Badge variant="secondary">Ngừng dùng</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {!isLoading && items.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      {error ? "Có lỗi xảy ra khi tải dữ liệu" : "Không có dữ liệu"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <div className="flex items-center justify-between px-6 py-4 border-t border-border/20">
          <div className="text-sm text-muted-foreground">
            Trang {page}/{totalPages}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1 || isLoading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Trước
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages || isLoading}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Sau
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}


