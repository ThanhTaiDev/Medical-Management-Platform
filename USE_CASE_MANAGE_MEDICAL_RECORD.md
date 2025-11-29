# So Sánh Use Case: Quản Lý Hồ Sơ Bệnh Án (Manage Patient Medical Record)

## Use Case Diagram: Quản Lý Hồ Sơ Bệnh Án

### 📊 Tổng Quan

| Use Case | Trạng thái | Endpoint/Chức năng | Ghi chú |
|----------|------------|-------------------|---------|
| **1. Đăng nhập (Login)** - Included | ✅ **CÓ** | `POST /api/auth/login` | Bắt buộc để quản lý hồ sơ |
| **2. Quản lí hồ sơ bệnh án** - Main | ⚠️ **MỘT PHẦN** | `GET /api/patient/fields` - Xem hồ sơ<br>Không có endpoint riêng để quản lý | Chỉ có thể xem, chưa có UI quản lý đầy đủ |
| **3. Cập nhật thông tin cá nhân** - Extended | ⚠️ **MỘT PHẦN** | `PUT /api/patient/fields` - Cập nhật: fullName, phoneNumber, password, gender, birthDate, address<br>Thiếu: email, height, weight | Một số trường chưa có trong schema |
| **4. Quản lí tiền sử bệnh** - Extended | ❌ **THIẾU** | Chỉ có cho Doctor: `PUT /api/doctor/patients/:id/history`<br>Không có cho Patient | Patient không thể tự quản lý |
| **5. Quản lí dị ứng** - Extended | ❌ **THIẾU** | Chỉ có cho Doctor: `PUT /api/doctor/patients/:id/history`<br>Không có cho Patient | Patient không thể tự quản lý |
| **6. Quản lí phẫu thuật** - Extended | ❌ **THIẾU** | Chỉ có cho Doctor: `PUT /api/doctor/patients/:id/history`<br>Không có cho Patient | Patient không thể tự quản lý |
| **7. Cập nhật lối sống** - Extended | ❌ **THIẾU** | Chỉ có cho Doctor: `PUT /api/doctor/patients/:id/history`<br>Không có cho Patient | Patient không thể tự quản lý |

---

## Chi Tiết Các Endpoint Đã Triển Khai

### 1. Đăng nhập (Login) ✅ - Included Use Case

```typescript
POST /api/auth/login
Body: { phoneNumber: string, password: string }
Response: { accessToken: string, refreshToken: string, user: {...} }
Cookie: token (JWT)
```

**Mô tả:** Bắt buộc phải đăng nhập trước khi quản lý hồ sơ bệnh án.

---

### 2. Quản Lý Hồ Sơ Bệnh Án ⚠️ - Main Use Case (Một Phần)

**2.1. Xem hồ sơ bệnh án:**
```typescript
GET /api/patient/fields
Response: PatientFields {
  id: string,
  phoneNumber: string,
  fullName: string,
  profile: {
    gender: string,
    birthDate: string,
    address: string
  } | null,
  medicalHistory: {
    conditions: string[],
    allergies: string[],
    surgeries: string[],
    familyHistory: string,
    lifestyle: string,
    currentMedications: string[],
    notes: string
  } | null,
  ...
}
```

**Frontend:**
- `PatientInfo` component (`/dashboard/patient-info`) - Chỉ hiển thị thông tin cá nhân (profile)
- Không có UI để xem/quản lý medical history (conditions, allergies, surgeries, lifestyle)

**2.2. Quản lý hồ sơ (chưa có):**
- Không có endpoint riêng để patient quản lý medical history
- Không có UI để patient thêm/sửa/xóa tiền sử bệnh, dị ứng, phẫu thuật, lối sống

---

### 3. Cập Nhật Thông Tin Cá Nhân ⚠️ - Extended Use Case (Một Phần)

**3.1. Đã có:**
```typescript
PUT /api/patient/fields
Body: {
  fullName?: string,
  phoneNumber?: string,
  password?: string,
  gender?: string,        // ✅ Có
  birthDate?: string,     // ✅ Có
  address?: string        // ✅ Có
}
```

**3.2. Thiếu (theo use case diagram):**
- ❌ **Email**: Không có trong schema `PatientProfile`
- ❌ **Chiều cao (Height)**: Không có trong schema
- ❌ **Cân nặng (Weight)**: Không có trong schema

**Schema hiện tại:**
```prisma
model PatientProfile {
  id        String    @id @default(uuid())
  userId    String    @unique
  gender    Gender?
  birthDate DateTime?
  address   String?
  // Thiếu: email, height, weight
}
```

**Frontend:**
- `PatientInfo` component cho phép cập nhật: fullName, phoneNumber, password, gender, birthDate, address
- Không có field để nhập email, height, weight

**Đề xuất triển khai:**
```prisma
// Cần thêm vào schema:
model PatientProfile {
  // ... existing fields
  email    String?
  height   Float?   // cm
  weight   Float?   // kg
}
```

---

### 4. Quản Lý Tiền Sử Bệnh ❌ - Extended Use Case (Thiếu)

**Trạng thái:** Chỉ có cho Doctor, không có cho Patient.

**4.1. Cho Doctor (đã có):**
```typescript
PUT /api/doctor/patients/:id/history
Body: {
  conditions?: string[],  // Tiền sử bệnh
  allergies?: string[],
  surgeries?: string[],
  familyHistory?: string,
  lifestyle?: string,
  currentMedications?: string[],
  notes?: string
}
```

**4.2. Cho Patient (chưa có):**
- ❌ Không có endpoint để patient tự quản lý tiền sử bệnh
- ❌ Không có UI để patient thêm/sửa/xóa conditions
- ❌ Patient chỉ có thể xem (thông qua `GET /api/patient/fields`), không thể chỉnh sửa

**Đề xuất triển khai:**
```typescript
// Thêm endpoints cho Patient:
GET /api/patient/medical-history
  // Xem tiền sử bệnh (đã có thông qua /patient/fields)

POST /api/patient/medical-history/conditions
Body: { condition: string, startDate?: string, severity?: string, status?: string, notes?: string }

PATCH /api/patient/medical-history/conditions/:id
Body: { condition?: string, startDate?: string, severity?: string, status?: string, notes?: string }

DELETE /api/patient/medical-history/conditions/:id
```

**Lưu ý:** Hiện tại `conditions` là `string[]` (mảng string đơn giản), không phải array of objects. Cần xem xét cấu trúc dữ liệu phù hợp hơn nếu muốn lưu thêm thông tin (startDate, severity, status, notes).

---

### 5. Quản Lý Dị Ứng ❌ - Extended Use Case (Thiếu)

**Trạng thái:** Chỉ có cho Doctor, không có cho Patient.

**5.1. Cho Doctor (đã có):**
```typescript
PUT /api/doctor/patients/:id/history
Body: {
  allergies?: string[]  // Danh sách dị ứng
}
```

**5.2. Cho Patient (chưa có):**
- ❌ Không có endpoint để patient tự quản lý dị ứng
- ❌ Không có UI để patient thêm/sửa/xóa allergies
- ❌ Patient chỉ có thể xem, không thể chỉnh sửa

**Đề xuất triển khai:**
```typescript
// Thêm endpoints cho Patient:
POST /api/patient/medical-history/allergies
Body: { allergen: string, severity?: string, symptoms?: string, notes?: string }

PATCH /api/patient/medical-history/allergies/:id
Body: { allergen?: string, severity?: string, symptoms?: string, notes?: string }

DELETE /api/patient/medical-history/allergies/:id
```

**Lưu ý:** Hiện tại `allergies` là `string[]` (mảng string đơn giản). Cần xem xét cấu trúc dữ liệu phù hợp hơn.

---

### 6. Quản Lý Phẫu Thuật ❌ - Extended Use Case (Thiếu)

**Trạng thái:** Chỉ có cho Doctor, không có cho Patient.

**6.1. Cho Doctor (đã có):**
```typescript
PUT /api/doctor/patients/:id/history
Body: {
  surgeries?: string[]  // Danh sách phẫu thuật
}
```

**6.2. Cho Patient (chưa có):**
- ❌ Không có endpoint để patient tự quản lý phẫu thuật
- ❌ Không có UI để patient thêm/sửa/xóa surgeries
- ❌ Patient chỉ có thể xem, không thể chỉnh sửa

**Đề xuất triển khai:**
```typescript
// Thêm endpoints cho Patient:
POST /api/patient/medical-history/surgeries
Body: { surgery: string, date?: string, hospital?: string, doctor?: string, notes?: string }

PATCH /api/patient/medical-history/surgeries/:id
Body: { surgery?: string, date?: string, hospital?: string, doctor?: string, notes?: string }

DELETE /api/patient/medical-history/surgeries/:id
```

**Lưu ý:** Hiện tại `surgeries` là `string[]` (mảng string đơn giản). Cần xem xét cấu trúc dữ liệu phù hợp hơn.

---

### 7. Cập Nhật Lối Sống ❌ - Extended Use Case (Thiếu)

**Trạng thái:** Chỉ có cho Doctor, không có cho Patient.

**7.1. Cho Doctor (đã có):**
```typescript
PUT /api/doctor/patients/:id/history
Body: {
  lifestyle?: string  // Lối sống (text field)
}
```

**7.2. Cho Patient (chưa có):**
- ❌ Không có endpoint để patient tự cập nhật lối sống
- ❌ Không có UI để patient cập nhật lifestyle
- ❌ Patient chỉ có thể xem, không thể chỉnh sửa

**Đề xuất triển khai:**
```typescript
// Thêm endpoint cho Patient:
PATCH /api/patient/medical-history/lifestyle
Body: {
  diet?: string,        // Thói quen ăn uống
  exercise?: string,    // Tập thể dục
  sleep?: string,        // Giấc ngủ
  smoking?: string,      // Hút thuốc
  alcohol?: string,      // Rượu bia
  stress?: string        // Căng thẳng
}

// Hoặc nếu giữ nguyên structure hiện tại (lifestyle là string):
PATCH /api/patient/medical-history/lifestyle
Body: { lifestyle: string }
```

**Lưu ý:** Hiện tại `lifestyle` là `string` (text field đơn giản). Có thể cần cấu trúc phức tạp hơn nếu muốn lưu từng phần riêng biệt (diet, exercise, sleep, etc.).

---

## Tổng Kết

| Use Case | Trạng thái | Tỷ lệ |
|----------|------------|-------|
| Đã triển khai đầy đủ | ✅ 1/7 | **14.3%** |
| Đã triển khai một phần | ⚠️ 2/7 | **28.6%** |
| Chưa triển khai | ❌ 4/7 | **57.1%** |

**Kết luận:** Hệ thống đã triển khai **14.3%** các use case đầy đủ, **28.6%** một phần, và **57.1%** chưa triển khai.

---

## Chi Tiết Bổ Sung

### 1. Schema Database

**Hiện tại:**
```prisma
model PatientProfile {
  id        String    @id @default(uuid())
  userId    String    @unique
  gender    Gender?
  birthDate DateTime?
  address   String?
  // Thiếu: email, height, weight
}

model PatientMedicalHistory {
  id                 String   @id @default(uuid())
  patientId          String   @unique
  conditions         String[] @default([])  // Array of strings
  allergies          String[] @default([])  // Array of strings
  surgeries          String[] @default([])  // Array of strings
  familyHistory      String?
  lifestyle          String?  // Text field
  currentMedications String[] @default([])
  notes              String?
  extras             Json?    // Có thể lưu thêm thông tin
}
```

**Vấn đề:**
- `conditions`, `allergies`, `surgeries` là mảng string đơn giản, không thể lưu thêm metadata (startDate, severity, symptoms, etc.)
- `lifestyle` là text field đơn giản, không có cấu trúc rõ ràng
- Thiếu `email`, `height`, `weight` trong `PatientProfile`

**Đề xuất cải thiện schema:**
```prisma
model PatientProfile {
  // ... existing fields
  email    String?
  height   Float?   // cm
  weight   Float?   // kg
}

// Hoặc tạo models riêng cho structured data:
model MedicalCondition {
  id          String   @id @default(uuid())
  patientId   String
  condition   String
  startDate   DateTime?
  severity    String?
  status      String?
  notes       String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  patient     User     @relation(fields: [patientId], references: [id])
}

model Allergy {
  id          String   @id @default(uuid())
  patientId   String
  allergen    String
  severity    String?
  symptoms    String?
  notes       String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  patient     User     @relation(fields: [patientId], references: [id])
}

model Surgery {
  id          String   @id @default(uuid())
  patientId   String
  surgery     String
  date        DateTime?
  hospital    String?
  doctor      String?
  notes       String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  patient     User     @relation(fields: [patientId], references: [id])
}

model Lifestyle {
  id          String   @id @default(uuid())
  patientId   String   @unique
  diet        String?
  exercise    String?
  sleep       String?
  smoking     String?
  alcohol     String?
  stress      String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  patient     User     @relation(fields: [patientId], references: [id])
}
```

---

### 2. Frontend Implementation

**Hiện tại:**
- `PatientInfo` component chỉ hiển thị và cập nhật thông tin cá nhân cơ bản (profile)
- Không có UI để xem/quản lý medical history
- Không có tabs/sections cho: conditions, allergies, surgeries, lifestyle

**Đề xuất:**
- Thêm tabs trong `PatientInfo` hoặc tạo page mới:
  - Tab "Thông tin cá nhân" (hiện có)
  - Tab "Tiền sử bệnh" (mới)
  - Tab "Dị ứng" (mới)
  - Tab "Phẫu thuật" (mới)
  - Tab "Lối sống" (mới)
- Mỗi tab có UI để thêm/sửa/xóa items

---

### 3. Backend Endpoints Cần Thêm

**3.1. Endpoints cho Patient để quản lý medical history:**

```typescript
// Xem medical history (đã có thông qua /patient/fields, nhưng có thể thêm endpoint riêng)
GET /api/patient/medical-history

// Quản lý tiền sử bệnh
POST /api/patient/medical-history/conditions
PATCH /api/patient/medical-history/conditions/:id
DELETE /api/patient/medical-history/conditions/:id

// Quản lý dị ứng
POST /api/patient/medical-history/allergies
PATCH /api/patient/medical-history/allergies/:id
DELETE /api/patient/medical-history/allergies/:id

// Quản lý phẫu thuật
POST /api/patient/medical-history/surgeries
PATCH /api/patient/medical-history/surgeries/:id
DELETE /api/patient/medical-history/surgeries/:id

// Cập nhật lối sống
PATCH /api/patient/medical-history/lifestyle
```

**3.2. Cập nhật thông tin cá nhân (thêm fields):**

```typescript
PUT /api/patient/fields
Body: {
  // ... existing fields
  email?: string,
  height?: number,  // cm
  weight?: number   // kg
}
```

---

## So Sánh với Use Case Diagram

| Yêu cầu trong Diagram | Triển khai | Ghi chú |
|----------------------|------------|---------|
| Patient phải đăng nhập | ✅ Có | JWT authentication |
| Quản lý hồ sơ bệnh án | ⚠️ Một phần | Chỉ có thể xem, chưa có UI quản lý đầy đủ |
| Cập nhật thông tin cá nhân (address) | ✅ Có | Có address |
| Cập nhật thông tin cá nhân (email) | ❌ Không có | Thiếu trong schema |
| Cập nhật thông tin cá nhân (height) | ❌ Không có | Thiếu trong schema |
| Cập nhật thông tin cá nhân (weight) | ❌ Không có | Thiếu trong schema |
| Quản lý tiền sử bệnh (thêm/sửa/xóa) | ❌ Không có | Chỉ có cho Doctor |
| Quản lý dị ứng (thêm/sửa/xóa) | ❌ Không có | Chỉ có cho Doctor |
| Quản lý phẫu thuật (thêm/sửa/xóa) | ❌ Không có | Chỉ có cho Doctor |
| Cập nhật lối sống | ❌ Không có | Chỉ có cho Doctor |

**Kết luận:** Hệ thống chưa triển khai đầy đủ use case "Quản Lý Hồ Sơ Bệnh Án" cho Patient. Hầu hết các chức năng quản lý medical history chỉ có cho Doctor, Patient không thể tự quản lý.

---

## Đề Xuất Ưu Tiên Triển Khai

### Priority 1: Thêm Fields Thiếu (Quan trọng)
- Thêm `email`, `height`, `weight` vào `PatientProfile` schema
- Cập nhật endpoint `PUT /api/patient/fields` để hỗ trợ các fields mới
- Cập nhật `PatientInfo` component để hiển thị và cập nhật các fields mới

### Priority 2: Endpoints Quản Lý Medical History (Quan trọng)
- Tạo endpoints cho Patient để quản lý conditions, allergies, surgeries, lifestyle
- Có thể giữ nguyên structure hiện tại (string arrays) hoặc refactor sang models riêng

### Priority 3: Frontend UI (Quan trọng)
- Thêm tabs/sections trong `PatientInfo` hoặc tạo page mới để quản lý medical history
- UI để thêm/sửa/xóa conditions, allergies, surgeries
- UI để cập nhật lifestyle

### Priority 4: Refactor Schema (Tùy chọn)
- Nếu muốn lưu metadata chi tiết (startDate, severity, symptoms, etc.), cần refactor schema
- Tạo models riêng cho `MedicalCondition`, `Allergy`, `Surgery`, `Lifestyle`

---

*Cập nhật: [Date]*

