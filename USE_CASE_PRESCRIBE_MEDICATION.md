# So Sánh Use Case: Kê Đơn Thuốc Điện Tử (Prescribe Electronic Medication) - Doctor

## Use Case Diagram: Kê Đơn Thuốc Điện Tử

### 📊 Tổng Quan

| Use Case | Trạng thái | Endpoint/Chức năng | Ghi chú |
|----------|------------|-------------------|---------|
| **1. Đăng nhập (Login)** - Included | ✅ **CÓ** | `POST /api/auth/login` | Bắt buộc để kê đơn thuốc |
| **2. Kê đơn thuốc điện tử** - Main | ✅ **CÓ** | `POST /api/doctor/prescriptions` | Tạo đơn thuốc mới |
| **3. Tạo đơn thuốc** - Extended | ✅ **CÓ** | `POST /api/doctor/prescriptions` | Tạo đơn thuốc với items |
| **4. Xem đơn thuốc gần nhất** - Extended | ⚠️ **MỘT PHẦN** | `GET /api/doctor/prescriptions/patient/:patientId?status=ACTIVE` | Có thể xem, nhưng chưa có endpoint riêng "most recent" |
| **5. Tìm thuốc** - Extended | ⚠️ **MỘT PHẦN** | `GET /api/medications?q=...` | Có search, nhưng chưa có UI search trong form kê đơn |
| **6. Xem trước đơn thuốc** - Extended | ❌ **THIẾU** | Không có endpoint preview<br>Không có UI preview | Chưa có chức năng preview trước khi lưu |

---

## Chi Tiết Các Endpoint Đã Triển Khai

### 1. Đăng nhập (Login) ✅ - Included Use Case

```typescript
POST /api/auth/login
Body: { phoneNumber: string, password: string }
Response: { accessToken: string, refreshToken: string, user: {...} }
Cookie: token (JWT)
```

**Mô tả:** Bắt buộc phải đăng nhập trước khi kê đơn thuốc.

---

### 2. Kê Đơn Thuốc Điện Tử ✅ - Main Use Case

```typescript
POST /api/doctor/prescriptions
Body: {
  patientId: string,
  startDate?: string,
  endDate?: string,
  notes?: string,
  items: Array<{
    medicationId: string,
    dosage: string,
    frequencyPerDay: number,
    timesOfDay: string[],
    durationDays: number,
    route?: string,
    instructions?: string
  }>
}
Response: Prescription {
  id: string,
  patientId: string,
  doctorId: string,
  status: 'ACTIVE',
  startDate: DateTime,
  endDate: DateTime,
  notes: string,
  items: PrescriptionItem[],
  ...
}
```

**Frontend:**
- `DoctorPatientsPage` có form để tạo đơn thuốc
- Form có thể thêm nhiều medication items
- Validation trước khi submit

---

### 3. Tạo Đơn Thuốc ✅ - Extended Use Case

**Đã có:**
- Endpoint `POST /api/doctor/prescriptions` để tạo đơn thuốc
- Form trong `DoctorPatientsPage` để nhập thông tin đơn thuốc:
  - Chọn bệnh nhân
  - Thêm medication items (có thể thêm nhiều)
  - Mỗi item có: medication, dosage, timesOfDay, durationDays, route, instructions
  - Notes cho đơn thuốc

**Frontend Implementation:**
```typescript
// DoctorPatientsPage.tsx
const [prescriptionItems, setPrescriptionItems] = useState([...]);
const [prescriptionNotes, setPrescriptionNotes] = useState("");

const handleCreatePrescription = () => {
  const prescriptionData = {
    items: prescriptionItems.map(item => ({
      ...item,
      frequencyPerDay: item.timesOfDay.length
    })),
    notes: prescriptionNotes,
  };
  createPrescriptionMutation.mutate(prescriptionData);
};
```

**Features:**
- ✅ Có thể thêm nhiều medication items
- ✅ Có thể xóa medication item
- ✅ Có thể chọn timesOfDay (Sáng, Trưa, Chiều, Tối)
- ✅ Validation form
- ✅ Error handling

---

### 4. Xem Đơn Thuốc Gần Nhất ⚠️ - Extended Use Case (Một Phần)

**4.1. Đã có:**
```typescript
GET /api/doctor/prescriptions/patient/:patientId
Query: {
  page?: number,
  limit?: number,
  status?: PrescriptionStatus
}
Response: {
  items: Prescription[],
  total: number,
  page: number,
  limit: number
}
```

**4.2. Thiếu:**
- ❌ Không có endpoint riêng `/api/doctor/prescriptions/patient/:patientId/most-recent`
- ❌ Không có UI để xem "đơn thuốc gần nhất" trong form kê đơn mới
- ❌ Chưa có tính năng "Load from recent prescription"

**Frontend:**
- `DoctorPatientsPage` có thể xem danh sách prescriptions của bệnh nhân
- Nhưng khi tạo đơn thuốc mới, không có button "Xem đơn gần nhất" hoặc "Copy from recent"

**Đề xuất triển khai:**
```typescript
// Thêm endpoint:
GET /api/doctor/prescriptions/patient/:patientId/most-recent
Response: Prescription | null

// Frontend: Thêm button "Xem đơn gần nhất" trong form kê đơn
// Khi click, load đơn thuốc gần nhất và pre-fill form
```

---

### 5. Tìm Thuốc ⚠️ - Extended Use Case (Một Phần)

**5.1. Đã có:**
```typescript
GET /api/medications
Query: {
  q?: string,              // Search term
  page?: number,
  limit?: number,
  isActive?: boolean
}
Response: {
  data: Medication[],
  total: number,
  page: number,
  limit: number
}
```

**5.2. Thiếu:**
- ❌ Trong form kê đơn, medication selector không có search box
- ❌ Phải scroll dropdown để tìm thuốc (không tiện)
- ❌ Không có autocomplete/search trong medication selector

**Frontend:**
- `DoctorPatientsPage` có medication selector (Select component)
- Nhưng không có search/autocomplete trong selector
- Phải load tất cả medications và scroll để tìm

**Đề xuất triển khai:**
```typescript
// Thay Select bằng Combobox với search:
<Combobox
  options={medications}
  value={selectedMedication}
  onSearch={(q) => MedicationsApi.list({ q, limit: 20 })}
  placeholder="Tìm thuốc..."
/>
```

---

### 6. Xem Trước Đơn Thuốc ❌ - Extended Use Case (Thiếu)

**Trạng thái:** Chưa có chức năng preview.

**6.1. Thiếu:**
- ❌ Không có endpoint preview
- ❌ Không có UI preview modal/dialog
- ❌ Không có button "Xem trước" trong form kê đơn

**Đề xuất triển khai:**
```typescript
// Backend: Không cần endpoint riêng, có thể dùng data từ form

// Frontend: Thêm preview modal
const [showPreview, setShowPreview] = useState(false);

const previewData = {
  patient: selectedPatient,
  items: prescriptionItems,
  notes: prescriptionNotes,
  estimatedEndDate: calculateEndDate(),
  totalDays: calculateTotalDays()
};

// Preview modal hiển thị:
// - Thông tin bệnh nhân
// - Danh sách thuốc với chi tiết
// - Lịch uống thuốc (timeline)
// - Ghi chú
// - Nút "Xác nhận" và "Chỉnh sửa"
```

**UI Preview nên có:**
- Thông tin bệnh nhân (tên, tuổi, giới tính)
- Bảng danh sách thuốc (tên, liều lượng, số lần/ngày, thời gian uống, số ngày)
- Timeline lịch uống thuốc (calendar view)
- Ghi chú của bác sĩ
- Tổng số ngày điều trị
- Ngày bắt đầu và kết thúc dự kiến

---

## Tổng Kết

| Use Case | Trạng thái | Tỷ lệ |
|----------|------------|-------|
| Đã triển khai đầy đủ | ✅ 2/6 | **33.3%** |
| Đã triển khai một phần | ⚠️ 2/6 | **33.3%** |
| Chưa triển khai | ❌ 2/6 | **33.3%** |

**Kết luận:** Hệ thống đã triển khai **33.3%** các use case đầy đủ, **33.3%** một phần, và **33.3%** chưa triển khai. Cần bổ sung:
1. Search/autocomplete trong medication selector
2. Xem đơn thuốc gần nhất và copy từ đơn cũ
3. Preview đơn thuốc trước khi lưu

---

## Chi Tiết Bổ Sung

### 1. Backend Endpoints Hiện Có

**Prescriptions Controller (`/api/doctor/prescriptions`):**
- `POST /` - Tạo đơn thuốc mới
- `GET /` - Danh sách đơn thuốc của doctor
- `GET /patient/:patientId` - Đơn thuốc của một bệnh nhân
- `GET /:id` - Chi tiết đơn thuốc
- `PATCH /:id` - Cập nhật đơn thuốc

**Medications API:**
- `GET /api/medications?q=...` - Danh sách thuốc (có search)

---

### 2. Frontend Implementation

**DoctorPatientsPage Component:**
- Form tạo đơn thuốc:
  - Chọn bệnh nhân
  - Thêm medication items (dynamic list)
  - Mỗi item: medication selector, dosage, timesOfDay checkboxes, durationDays, route, instructions
  - Notes field
  - Validation
  - Submit button

**Thiếu:**
- Search trong medication selector
- Preview button
- "Load from recent" button
- Medication autocomplete

---

### 3. Đề Xuất Cải Thiện

**Priority 1: Search Medication (Quan trọng)**
- Thay Select bằng Combobox với search
- Autocomplete khi typing
- Debounce search requests
- Highlight search term trong results

**Priority 2: Preview Prescription (Quan trọng)**
- Tạo preview modal component
- Hiển thị formatted prescription
- Timeline view cho lịch uống thuốc
- Nút "Xác nhận" và "Chỉnh sửa"

**Priority 3: Load from Recent (Tùy chọn)**
- Endpoint `/api/doctor/prescriptions/patient/:patientId/most-recent`
- Button "Xem đơn gần nhất" trong form
- Pre-fill form từ đơn cũ
- Cho phép chỉnh sửa trước khi tạo mới

**Priority 4: Prescription Templates (Tùy chọn)**
- Lưu đơn thuốc thành template
- Load từ template
- Quản lý templates

---

*Cập nhật: [Date]*

