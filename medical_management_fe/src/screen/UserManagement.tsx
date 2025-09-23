import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/api/user/user.api";
import { User } from "@/api/user/types";

const UserManagement: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [roleFilter, setRoleFilter] = useState<"ALL" | "ADMIN" | "DOCTOR" | "PATIENT">("ALL");

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["users", page, limit, roleFilter],
    queryFn: () => userApi.getUsers({ page, limit, role: roleFilter === "ALL" ? undefined : roleFilter }),
    keepPreviousData: true,
  });

  useEffect(() => {
    refetch();
  }, [page, limit, roleFilter, refetch]);

  const users = data?.data ?? [];
  const pagination = data?.pagination;

  const roleLabel = (role?: User["role"]) =>
    role === "ADMIN" ? "Quản trị" : role === "DOCTOR" ? "Bác sĩ" : "Bệnh nhân";

  const roleColor = (role?: User["role"]) =>
    role === "ADMIN"
      ? "bg-purple-100 text-purple-700"
      : role === "DOCTOR"
      ? "bg-blue-100 text-blue-700"
      : "bg-emerald-100 text-emerald-700";

  const statusColor = (status?: User["status"]) =>
    status === "ACTIVE" ? "bg-emerald-100 text-emerald-700" : "bg-zinc-100 text-zinc-600";

  const cardColorByRole = (role?: User["role"]) =>
    role === "ADMIN"
      ? "border-purple-200/70 bg-purple-50/40 hover:shadow-purple-100"
      : role === "DOCTOR"
      ? "border-blue-200/70 bg-blue-50/40 hover:shadow-blue-100"
      : "border-emerald-200/70 bg-emerald-50/40 hover:shadow-emerald-100";

  return (
    <div className="h-full bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-card rounded-xl shadow-lg p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h1 className="text-2xl font-bold text-foreground">Quản lý người dùng</h1>
            <div className="flex items-center gap-2">
              <div className="inline-flex rounded-lg border border-border/30 overflow-hidden">
                {(["ALL", "ADMIN", "DOCTOR", "PATIENT"] as const).map((r) => (
                  <button
                    key={r}
                    className={`px-3 py-1.5 text-sm ${
                      roleFilter === r
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-accent/40"
                    }`}
                    onClick={() => {
                      setPage(1);
                      setRoleFilter(r);
                    }}
                  >
                    {r === "ALL" ? "Tất cả" : r === "ADMIN" ? "Quản trị" : r === "DOCTOR" ? "Bác sĩ" : "Bệnh nhân"}
                  </button>
                ))}
              </div>
              <select
                className="ml-2 px-2 py-1 rounded border border-border/30 bg-background"
                value={limit}
                onChange={(e) => {
                  setPage(1);
                  setLimit(parseInt(e.target.value));
                }}
              >
                {[8, 12, 16, 24].map((n) => (
                  <option key={n} value={n}>{n}/trang</option>
                ))}
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-40 text-muted-foreground">Đang tải...</div>
          ) : isError ? (
            <div className="flex items-center justify-center h-40 text-red-500">Không thể tải danh sách người dùng</div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {users.map((u: User) => (
                  <div key={u.id} className={`rounded-xl border bg-background shadow-sm hover:shadow-md transition-shadow ${cardColorByRole(u.role)}`}>
                    <div className="p-4 flex items-start gap-4">
                      <div className="shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-primary/70 text-white flex items-center justify-center text-lg font-semibold">
                        {u.fullName?.charAt(0) || "U"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-sm font-semibold text-foreground truncate">{u.fullName}</h3>
                          <span className={`px-2 py-0.5 rounded-md text-[11px] font-medium ${roleColor(u.role)}`}>
                            {roleLabel(u.role)}
                          </span>
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground truncate">{u.phoneNumber}</div>
                        <div className="mt-2">
                          <span className={`inline-flex px-2 py-0.5 rounded-md text-[11px] font-medium ${statusColor(u.status)}`}>
                            {u.status === "ACTIVE" ? "Hoạt động" : "Không hoạt động"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-muted-foreground">
                  Trang {pagination?.currentPage} / {pagination?.totalPages} — Tổng {pagination?.total}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="px-3 py-1 rounded border border-border/30 hover:bg-accent/30 disabled:opacity-50"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={!pagination?.hasPrevPage}
                  >
                    Trước
                  </button>
                  <button
                    className="px-3 py-1 rounded border border-border/30 hover:bg-accent/30 disabled:opacity-50"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={!pagination?.hasNextPage}
                  >
                    Sau
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;