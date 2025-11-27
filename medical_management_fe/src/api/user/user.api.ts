// Mocked user API for FE-only flow
import { axiosInstance } from "../axios";
import {
  User,
  UserListResponse,
  CreateUserData,
  UpdateUserData,
  BulkDeleteUsersData,
  PaginationInfo,
} from "./types";

export interface GetUsersParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  role?: "PATIENT" | "DOCTOR" | "ADMIN";
  search?: string;
}

export const userApi = {
  async getUsers(params: GetUsersParams = {}): Promise<UserListResponse> {
    const { page = 1, limit = 10, sortBy, sortOrder, role, search } = params;
    const res = await axiosInstance.get("/admin/users", {
      params: { page, limit, sortBy, sortOrder, role, search },
    });
    const payload = res.data?.data ?? res.data;
    // Backend returns { items, total, page, limit }
    const items = payload.items as User[];
    const total = payload.total as number;
    const currentPage = payload.page as number;
    const perPage = payload.limit as number;
    const totalPages = Math.ceil(total / (perPage || 1));
    const pagination: PaginationInfo = {
      currentPage,
      totalPages,
      total,
      limit: perPage,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
    };
    return { data: items, pagination, statusCode: res.data?.statusCode ?? 200 };
  },

  async getUserById(id: string): Promise<User> {
    const res = await axiosInstance.get(`/admin/users/${id}`);
    return (res.data?.data ?? res.data) as User;
  },

  async createUser(data: CreateUserData): Promise<User> {
    const res = await axiosInstance.post("/admin/users", data);
    return (res.data?.data ?? res.data) as User;
  },

  async updateUser(userId: string, data: UpdateUserData): Promise<User> {
    const res = await axiosInstance.patch(`/admin/users/${userId}`, data);
    return (res.data?.data ?? res.data) as User;
  },

  async deleteUser(userId: string): Promise<void> {
    await axiosInstance.delete(`/admin/users/${userId}`);
  },

  async bulkDeleteUsers(_data: BulkDeleteUsersData): Promise<void> {
    // Placeholder for future bulk delete endpoint if available
    return Promise.resolve();
  },

  async getDoctorList(): Promise<UserListResponse> {
    const res = await axiosInstance.get("/admin/users", { params: { role: "DOCTOR", limit: 100 } });
    const payload = res.data?.data ?? res.data;
    const items = payload.items as User[];
    return { data: items, pagination: { currentPage: 1, totalPages: 1, total: items.length, limit: items.length, hasNextPage: false, hasPrevPage: false }, statusCode: 200 } as UserListResponse;
  },

  async exportUsers(filters?: {
    role?: "ADMIN" | "DOCTOR" | "PATIENT";
    status?: "ACTIVE" | "INACTIVE" | "BLOCKED";
    startDate?: string;
    endDate?: string;
  }): Promise<Blob> {
    try {
      const res = await axiosInstance.post(
        "/admin/users/export",
        filters || {},
        {
          responseType: "blob",
          validateStatus: (status) => status < 500, // Accept 4xx as errors
        }
      );
      
      // Kiểm tra nếu response là error (status >= 400)
      if (res.status >= 400) {
        // Nếu là blob error, parse nó
        if (res.data instanceof Blob) {
          const text = await res.data.text();
          try {
            const errorData = JSON.parse(text);
            throw new Error(errorData.message || "Xuất Excel thất bại");
          } catch {
            throw new Error(`Xuất Excel thất bại (${res.status})`);
          }
        }
        throw new Error(`Xuất Excel thất bại (${res.status})`);
      }
      
      // Kiểm tra nếu response có Content-Type là JSON (error)
      const contentType = res.headers['content-type'] || '';
      if (contentType.includes('application/json')) {
        const text = await res.data.text();
        const errorData = JSON.parse(text);
        throw new Error(errorData.message || "Xuất Excel thất bại");
      }
      
      return res.data;
    } catch (error: any) {
      // Nếu là axios error với blob response
      if (error.response?.data instanceof Blob) {
        const text = await error.response.data.text();
        try {
          const errorData = JSON.parse(text);
          throw new Error(errorData.message || "Xuất Excel thất bại");
        } catch {
          throw new Error("Xuất Excel thất bại");
        }
      }
      throw error;
    }
  },
};
