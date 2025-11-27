import { axiosInstance } from "../axios";

export interface PrescriptionFilters {
  status?: "ACTIVE" | "COMPLETED" | "CANCELLED";
  doctorId?: string;
  patientId?: string;
  startDate?: string;
  endDate?: string;
}

export const PrescriptionApi = {
  async exportPrescriptions(filters?: PrescriptionFilters): Promise<Blob> {
    try {
      const res = await axiosInstance.post(
        "/admin/prescriptions/export",
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

