# So Sánh Use Case: Xem Lịch Sử Dùng Thuốc (View Medication Usage History)

## Use Case Diagram: Xem Lịch Sử Dùng Thuốc

### 📊 Tổng Quan

| Use Case | Trạng thái | Endpoint/Chức năng | Ghi chú |
|----------|------------|-------------------|---------|
| **1. Đăng nhập (Login)** - Included | ✅ **CÓ** | `POST /api/auth/login` | Bắt buộc để xem lịch sử |
| **2. Xem lịch sử dùng thuốc** - Main | ✅ **CÓ** | `GET /api/patient/prescriptions/:id/history`<br>`GET /api/patient/adherence`<br>`GET /api/prescriptions/:id/adherence-logs` | Xem lịch sử tuân thủ |
| **3. Xem lịch sử theo khoảng thời gian** - Extended | ⚠️ **MỘT PHẦN** | `GET /api/notifications/doctor/adherence-report?startDate=...&endDate=...` (chỉ cho Doctor)<br>Patient: Chưa có filter theo date range | Chỉ có cho Doctor, chưa có cho Patient |
| **4. Xem biểu đồ tuân thủ** - Extended | ⚠️ **MỘT PHẦN** | `DashboardHomepage` có ReactECharts (cho Admin/Doctor)<br>Patient: Chưa có biểu đồ | Chỉ có cho Admin/Doctor, chưa có cho Patient |
| **5. Xuất báo cáo PDF/Excel** - Extended | ❌ **THIẾU** | Không có endpoint export | Chưa triển khai |

---

## Chi Tiết Các Endpoint Đã Triển Khai

### 1. Đăng nhập (Login) ✅ - Included Use Case

```typescript
POST /api/auth/login
Body: { phoneNumber: string, password: string }
Response: { accessToken: string, refreshToken: string, user: {...} }
Cookie: token (JWT)
```

**Mô tả:** Bắt buộc phải đăng nhập trước khi xem lịch sử dùng thuốc.

---

### 2. Xem Lịch Sử Dùng Thuốc ✅ - Main Use Case

**2.1. Lịch sử của một đơn thuốc:**
```typescript
GET /api/patient/prescriptions/:id/history?page=1&limit=10
Response: {
  items: AdherenceLog[],
  total: number,
  page: number,
  limit: number
}

// AdherenceLog:
{
  id: string,
  takenAt: string,  // ISO datetime
  status: "TAKEN" | "MISSED" | "SKIPPED",
  amount?: string,
  notes?: string,
  prescriptionItem: {
    medication: {
      name: string,
      strength: string,
      form: string
    },
    dosage: string,
    route?: string
  }
}
```

**2.2. Lịch sử tuân thủ tổng quan:**
```typescript
GET /api/patient/adherence
Response: AdherenceLog[]  // Tất cả lịch sử tuân thủ

GET /api/prescriptions/:id/adherence-logs?page=1&limit=10
Response: {
  items: AdherenceLog[],
  total: number,
  page: number,
  limit: number
}
```

**Frontend:**
- `PatientPage` có tab "history" để xem lịch sử đơn thuốc
- Tab "adherence" để xem lịch sử tuân thủ tổng quan
- Dữ liệu được nhóm theo ngày và hiển thị dạng danh sách

---

### 3. Xem Lịch Sử Theo Khoảng Thời Gian ⚠️ - Extended Use Case (Một Phần)

**Trạng thái:** Chỉ có cho Doctor, chưa có cho Patient.

**3.1. Cho Doctor (đã có):**
```typescript
GET /api/notifications/doctor/adherence-report?patientId=...&startDate=2024-01-01&endDate=2024-01-31&groupBy=day
Response: {
  patientId: string,
  period: {
    startDate: string,
    endDate: string
  },
  summary: {
    totalDoses: number,
    takenDoses: number,
    missedDoses: number,
    skippedDoses: number,
    adherenceRate: number
  },
  logs: AdherenceLog[],
  trends: {
    // Grouped by day/week/month
    [key: string]: {
      taken: number,
      missed: number,
      skipped: number,
      total: number
    }
  }
}
```

**3.2. Cho Patient (chưa có):**
- Endpoint `GET /api/patient/prescriptions/:id/history` không hỗ trợ filter theo `startDate` và `endDate`
- Endpoint `GET /api/patient/adherence` không hỗ trợ filter theo date range
- Frontend có thể filter trên client-side, nhưng không có API hỗ trợ filter trên server

**Frontend hiện tại:**
- `PatientPage` tab "history" và "adherence" hiển thị tất cả lịch sử
- Không có date picker hoặc filter theo khoảng thời gian
- Dữ liệu được nhóm theo ngày nhưng không có filter

**Đề xuất triển khai:**
```typescript
// Thêm query parameters:
GET /api/patient/prescriptions/:id/history?startDate=2024-01-01&endDate=2024-01-31&page=1&limit=10
GET /api/patient/adherence?startDate=2024-01-01&endDate=2024-01-31

// Hoặc endpoint riêng:
GET /api/patient/adherence/report?startDate=2024-01-01&endDate=2024-01-31&groupBy=day
```

---

### 4. Xem Biểu Đồ Tuân Thủ ⚠️ - Extended Use Case (Một Phần)

**Trạng thái:** Chỉ có cho Admin/Doctor, chưa có cho Patient.

**4.1. Cho Admin/Doctor (đã có):**
- `DashboardHomepage` sử dụng `ReactECharts` để hiển thị biểu đồ pie chart
- Hiển thị tổng quan: số đơn thuốc, số bệnh nhân, tỉ lệ tuân thủ

**4.2. Cho Patient (chưa có):**
- `PatientPage` không có biểu đồ tuân thủ
- Chỉ hiển thị dữ liệu dạng danh sách (list view)
- Không có visualization dạng chart/graph

**Đề xuất triển khai:**
- Thêm biểu đồ line chart để hiển thị xu hướng tuân thủ theo thời gian
- Thêm biểu đồ bar chart để so sánh tuân thủ theo ngày/tuần/tháng
- Thêm biểu đồ pie chart để hiển thị tỉ lệ TAKEN/MISSED/SKIPPED

**Ví dụ implementation:**
```typescript
// Trong PatientPage, thêm ReactECharts component:
import ReactECharts from "echarts-for-react";

// Chart options:
const adherenceChartOption = {
  title: { text: "Biểu đồ tuân thủ" },
  xAxis: { type: "category", data: dates },
  yAxis: { type: "value" },
  series: [{
    name: "Đã uống",
    type: "line",
    data: takenData
  }, {
    name: "Bỏ lỡ",
    type: "line",
    data: missedData
  }]
};
```

---

### 5. Xuất Báo Cáo PDF/Excel ❌ - Extended Use Case (Thiếu)

**Trạng thái:** Chưa triển khai.

**Hiện tại:**
- Không có endpoint để export lịch sử dùng thuốc ra PDF/Excel
- Không có nút "Xuất báo cáo" trong frontend
- Không có library để generate PDF/Excel (như `pdfkit`, `xlsx`, `jspdf`, etc.)

**Đề xuất triển khai:**

**Backend:**
```typescript
// Thêm endpoint export:
GET /api/patient/adherence/export?format=pdf|excel&startDate=...&endDate=...
Response: File (PDF hoặc Excel)

// Hoặc POST để có thể customize:
POST /api/patient/adherence/export
Body: {
  format: "pdf" | "excel",
  startDate?: string,
  endDate?: string,
  includeCharts?: boolean,
  includeDetails?: boolean
}
Response: File
```

**Libraries cần cài đặt:**
- **PDF:** `pdfkit`, `puppeteer`, hoặc `jspdf` (client-side)
- **Excel:** `xlsx`, `exceljs`

**Frontend:**
```typescript
// Thêm nút "Xuất báo cáo" trong PatientPage
<Button onClick={handleExport}>
  <Download className="h-4 w-4 mr-2" />
  Xuất báo cáo
</Button>

// Dialog chọn format và date range
<ExportDialog
  open={exportDialogOpen}
  onClose={() => setExportDialogOpen(false)}
  onExport={handleExport}
/>
```

**Nội dung báo cáo nên bao gồm:**
- Thông tin bệnh nhân
- Khoảng thời gian
- Tổng quan thống kê (tổng số liều, đã uống, bỏ lỡ, tỉ lệ tuân thủ)
- Biểu đồ tuân thủ (nếu chọn)
- Chi tiết từng lần uống thuốc
- Phân tích theo thuốc
- Phân tích theo thời gian

---

## Tổng Kết

| Use Case | Trạng thái | Tỷ lệ |
|----------|------------|-------|
| Đã triển khai đầy đủ | ✅ 2/5 | **40%** |
| Đã triển khai một phần | ⚠️ 2/5 | **40%** |
| Chưa triển khai | ❌ 1/5 | **20%** |

**Kết luận:** Hệ thống đã triển khai **40%** các use case đầy đủ, **40%** một phần, và **20%** chưa triển khai.

---

## Chi Tiết Bổ Sung

### 1. Filter Theo Khoảng Thời Gian

**Hiện tại:**
- Backend: Không có query parameters `startDate` và `endDate` cho patient endpoints
- Frontend: Không có date picker để chọn khoảng thời gian

**Cần triển khai:**
1. Thêm query parameters vào backend endpoints
2. Thêm date picker vào frontend
3. Thêm filter UI (tuần này, tháng này, tùy chỉnh)

### 2. Biểu Đồ Tuân Thủ

**Hiện tại:**
- Chỉ có biểu đồ cho Admin/Doctor trong `DashboardHomepage`
- Patient không có biểu đồ

**Cần triển khai:**
1. Thêm ReactECharts vào `PatientPage`
2. Tạo chart options để hiển thị:
   - Line chart: Xu hướng tuân thủ theo thời gian
   - Bar chart: So sánh tuân thủ theo ngày
   - Pie chart: Tỉ lệ TAKEN/MISSED/SKIPPED
3. Tính toán dữ liệu từ adherence logs

### 3. Xuất Báo Cáo

**Hiện tại:**
- Hoàn toàn chưa có

**Cần triển khai:**
1. Cài đặt library (pdfkit hoặc jspdf, xlsx)
2. Tạo endpoint export
3. Tạo UI để chọn format và date range
4. Generate file và download

---

## Đề Xuất Ưu Tiên Triển Khai

### Priority 1: Filter Theo Khoảng Thời Gian (Quan trọng)
- Dễ triển khai
- Cải thiện UX đáng kể
- Cần thiết cho use case

### Priority 2: Biểu Đồ Tuân Thủ (Quan trọng)
- Cải thiện visualization
- Dễ hiểu hơn so với danh sách
- Đã có library (ReactECharts) trong project

### Priority 3: Xuất Báo Cáo (Tùy chọn)
- Cần thêm dependencies
- Phức tạp hơn
- Có thể triển khai sau

---

## So Sánh với Use Case Diagram

| Yêu cầu trong Diagram | Triển khai | Ghi chú |
|----------------------|------------|---------|
| Patient phải đăng nhập | ✅ Có | JWT authentication |
| Xem lịch sử dùng thuốc | ✅ Có | Nhiều endpoints |
| Xem lịch sử theo khoảng thời gian | ⚠️ Một phần | Chỉ có cho Doctor |
| Xem biểu đồ tuân thủ | ⚠️ Một phần | Chỉ có cho Admin/Doctor |
| Xuất báo cáo PDF/Excel | ❌ Không có | Chưa triển khai |

**Kết luận:** Hệ thống đã triển khai cơ bản use case "Xem lịch sử dùng thuốc", nhưng còn thiếu các tính năng mở rộng cho Patient (filter theo thời gian, biểu đồ, export).

---

*Cập nhật: [Date]*

