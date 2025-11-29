# So Sánh Use Case Diagram vs Code Đã Triển Khai

## Use Case: Xác nhận đã uống thuốc (Confirm medication taken)

### ✅ Đã Triển Khai

| Use Case | Trạng thái | Endpoint/Chức năng | Ghi chú |
|----------|------------|-------------------|---------|
| **1. Đăng nhập (Login)** - Included | ✅ **CÓ** | `POST /api/auth/login` | Bắt buộc để xác nhận uống thuốc |
| **2. Xác nhận đã uống thuốc** - Main | ✅ **CÓ** | `POST /api/patient/prescriptions/:id/confirm-taken`<br>`POST /api/prescriptions/:id/log-adherence`<br>`POST /api/notifications/patient/quick-confirm` | Nhiều cách để xác nhận |
| **3. Xác nhận uống (đã uống/khác liều/uống muộn)** - Extended | ✅ **CÓ** | `POST /api/prescriptions/:id/log-adherence`<br>Body: `{ status: 'TAKEN' \| 'MISSED' \| 'SKIPPED', amount?: string, notes?: string, takenAt?: string }` | Có thể ghi nhận:<br>- Đã uống (TAKEN)<br>- Khác liều (amount)<br>- Uống muộn (takenAt)<br>- Ghi chú (notes) |
| **4. Xem lịch sử xác nhận** - Extended | ✅ **CÓ** | `GET /api/patient/prescriptions/:id/history`<br>`GET /api/prescriptions/:id/adherence-logs`<br>`GET /api/patient/adherence` | Xem lịch sử tuân thủ |
| **5. Đánh dấu bỏ lỡ thuốc** - Extended | ✅ **CÓ** | `POST /api/patient/prescriptions/:id/mark-missed` | Đánh dấu bỏ lỡ |

### ❌ Chưa Triển Khai

| Use Case | Trạng thái | Mô tả |
|----------|------------|-------|
| **6. Chỉnh sửa xác nhận (Edit confirmation)** - Extended | ❌ **THIẾU** | Không có endpoint để cập nhật/sửa một adherence log đã tạo |

---

## Chi Tiết Các Endpoint Đã Triển Khai

### 1. Đăng nhập ✅

```typescript
POST /api/auth/login
Body: { phoneNumber: string, password: string }
Response: { accessToken: string, refreshToken: string, user: {...} }
Cookie: token (JWT)
```

### 2. Xác nhận đã uống thuốc ✅

**Cách 1: Xác nhận đơn giản**
```typescript
POST /api/patient/prescriptions/:id/confirm-taken
Body: { 
  prescriptionItemId?: string,
  amount?: string,
  notes?: string 
}
```

**Cách 2: Ghi nhật ký tuân thủ (chi tiết hơn)**
```typescript
POST /api/prescriptions/:id/log-adherence
Body: {
  prescriptionItemId?: string,
  takenAt?: string,  // ISO date string
  status: 'TAKEN' | 'MISSED' | 'SKIPPED',
  amount?: string,   // Liều lượng (nếu khác liều)
  notes?: string     // Ghi chú
}
```

**Cách 3: Xác nhận nhanh từ notification**
```typescript
POST /api/notifications/patient/quick-confirm
Body: {
  prescriptionItemId: string,
  takenAt?: string,
  amount?: string,
  notes?: string
}
```

### 3. Xác nhận uống (đã uống/khác liều/uống muộn) ✅

Endpoint `POST /api/prescriptions/:id/log-adherence` hỗ trợ:

- **Đã uống:** `status: 'TAKEN'`
- **Khác liều:** `status: 'TAKEN'` + `amount: "0.5 viên"` (ví dụ)
- **Uống muộn:** `status: 'TAKEN'` + `takenAt: "2024-01-01T15:30:00Z"` (thời gian thực tế)
- **Ghi chú:** `notes: "Uống sau bữa ăn"`

### 4. Xem lịch sử xác nhận ✅

```typescript
GET /api/patient/prescriptions/:id/history?page=1&limit=10
Response: {
  items: AdherenceLog[],
  total: number,
  page: number,
  limit: number
}

GET /api/prescriptions/:id/adherence-logs?page=1&limit=10
GET /api/patient/adherence
```

### 5. Đánh dấu bỏ lỡ thuốc ✅

```typescript
POST /api/patient/prescriptions/:id/mark-missed
Body: {
  prescriptionItemId?: string,
  notes?: string
}
```

---

## ❌ Chức Năng Thiếu: Chỉnh Sửa Xác Nhận

### Mô Tả
Bệnh nhân không thể chỉnh sửa một adherence log đã tạo. Hiện tại chỉ có thể:
- Tạo mới adherence log
- Xem lịch sử
- Không thể sửa/xóa một log đã tạo

### Đề Xuất Triển Khai

**Backend Endpoint:**
```typescript
PATCH /api/patient/prescriptions/:prescriptionId/adherence-logs/:logId
Body: {
  status?: 'TAKEN' | 'MISSED' | 'SKIPPED',
  takenAt?: string,
  amount?: string,
  notes?: string
}

DELETE /api/patient/prescriptions/:prescriptionId/adherence-logs/:logId
```

**Frontend:**
- Thêm nút "Sửa" và "Xóa" trong danh sách lịch sử xác nhận
- Dialog để chỉnh sửa thông tin xác nhận

**Lưu ý:**
- Chỉ cho phép sửa/xóa trong một khoảng thời gian nhất định (ví dụ: trong 24 giờ)
- Có thể cần thêm quyền hoặc validation để đảm bảo tính toàn vẹn dữ liệu

---

## Tổng Kết

| Use Case | Trạng thái | Tỷ lệ |
|----------|------------|-------|
| Đã triển khai | ✅ 5/6 | **83.3%** |
| Chưa triển khai | ❌ 1/6 | **16.7%** |

**Kết luận:** Hệ thống đã triển khai **83.3%** các use case trong diagram. Chỉ thiếu chức năng **"Chỉnh sửa xác nhận"** (Edit confirmation).

---

*Cập nhật: [Date]*

