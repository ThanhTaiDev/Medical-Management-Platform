import { axiosInstance } from "../axios";

export interface ExportReportFilters {
  startDate?: string;
  endDate?: string;
}

export const reportsApi = {
  async exportOverallReport(filters?: ExportReportFilters): Promise<Blob> {
    try {
      const res = await axiosInstance.post(
        "/admin/reports/export",
        filters || {},
        {
          responseType: "blob",
          validateStatus: (status) => status < 500,
        }
      );

      if (res.status >= 400) {
        if (res.data instanceof Blob) {
          const text = await res.data.text();
          try {
            const errorData = JSON.parse(text);
            throw new Error(errorData.message || "Xuất báo cáo thất bại");
          } catch {
            throw new Error(`Xuất báo cáo thất bại (${res.status})`);
          }
        }
        throw new Error(`Xuất báo cáo thất bại (${res.status})`);
      }

      const contentType = res.headers['content-type'] || '';
      if (contentType.includes('application/json')) {
        const text = await res.data.text();
        const errorData = JSON.parse(text);
        throw new Error(errorData.message || "Xuất báo cáo thất bại");
      }

      return res.data;
    } catch (error: any) {
      if (error.response?.data instanceof Blob) {
        const text = await error.response.data.text();
        try {
          const errorData = JSON.parse(text);
          throw new Error(errorData.message || "Xuất báo cáo thất bại");
        } catch {
          throw new Error("Xuất báo cáo thất bại");
        }
      }
      throw error;
    }
  },
};

