# Danh Sách Chức Năng Đã Triển Khai

Tài liệu này liệt kê tất cả các chức năng đã được triển khai trong hệ thống Medical Management, bao gồm cả Backend (API endpoints) và Frontend (pages/routes).

---

## 📋 MỤC LỤC

1. [Authentication & Authorization](#authentication--authorization)
2. [Theo Vai Trò Người Dùng](#theo-vai-trò-người-dùng)
   - [Admin](#admin)
   - [Doctor](#doctor)
   - [Patient](#patient)
   - [Common/Shared](#commonshared)
3. [Theo Module/Domain](#theo-moduledomain)
   - [User Management](#user-management)
   - [Patient Management](#patient-management)
   - [Doctor Management](#doctor-management)
   - [Prescription Management](#prescription-management)
   - [Medication Management](#medication-management)
   - [Major/Specialty Management](#majorspecialty-management)
   - [Notifications & Alerts](#notifications--alerts)
   - [Reports & Statistics](#reports--statistics)
   - [Other Features](#other-features)

---

## Authentication & Authorization

### Backend Endpoints

**Controller:** `AuthController` (`/api/auth`)

| Method | Endpoint | Mô tả | Quyền truy cập |
|--------|----------|-------|----------------|
| POST | `/api/auth/login` | Đăng nhập (trả về JWT token, set cookie) | Public |
| POST | `/api/auth/register` | Đăng ký tài khoản mới | Public |
| POST | `/api/auth/logout` | Đăng xuất (xóa cookie) | Public |
| GET | `/api/auth/me` | Lấy thông tin user hiện tại | Authenticated |

---

## Theo Vai Trò Người Dùng

### Admin

#### Backend Endpoints

**1. User Management** (`AdminUsersController` - `/api/admin/users`)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/admin/users` | Danh sách tất cả users (có phân trang, tìm kiếm, lọc theo role) |
| GET | `/api/admin/users/:id` | Chi tiết user theo ID |
| POST | `/api/admin/users` | Tạo user mới (Admin, Doctor, Patient) |
| PATCH | `/api/admin/users/:id` | Cập nhật thông tin user |
| DELETE | `/api/admin/users/:id` | Xóa mềm user |

**2. Prescription Management** (`AdminPrescriptionsController` - `/api/admin/prescriptions`)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/admin/prescriptions` | Danh sách tất cả đơn thuốc (có filter theo status, doctorId, patientId) |
| GET | `/api/admin/prescriptions/stats` | Thống kê tổng quan về đơn thuốc |
| GET | `/api/admin/prescriptions/:id` | Chi tiết đơn thuốc theo ID |
| GET | `/api/admin/prescriptions/doctor/:doctorId` | Danh sách đơn thuốc của một bác sĩ |
| GET | `/api/admin/prescriptions/patient/:patientId` | Danh sách đơn thuốc của một bệnh nhân |
| GET | `/api/admin/prescriptions/:id/adherence-logs` | Lịch sử tuân thủ của một đơn thuốc |
| GET | `/api/admin/prescriptions/patient/:patientId/schedule` | Lịch uống thuốc của bệnh nhân |
| PATCH | `/api/admin/prescriptions/:id` | Cập nhật đơn thuốc |

**3. Medication Management** (`MedicationsController` - `/api/admin/medications`)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/admin/medications/get-all` | Danh sách tất cả thuốc (có filter active/inactive, phân trang) |
| POST | `/api/admin/medications` | Tạo thuốc mới |
| PATCH | `/api/admin/medications/:id` | Cập nhật thông tin thuốc |
| DELETE | `/api/admin/medications/:id` | Vô hiệu hóa thuốc |

**4. Major/Specialty Management** (`MajorController` - `/api/major-doctors`)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/api/major-doctors` | Tạo chuyên khoa mới |
| GET | `/api/major-doctors` | Danh sách chuyên khoa (có phân trang, tìm kiếm) |
| GET | `/api/major-doctors/active` | Danh sách chuyên khoa đang hoạt động |
| GET | `/api/major-doctors/:id` | Chi tiết chuyên khoa |
| PATCH | `/api/major-doctors/:id` | Cập nhật thông tin chuyên khoa |
| PATCH | `/api/major-doctors/:id/status` | Cập nhật trạng thái hoạt động |
| DELETE | `/api/major-doctors/:id` | Xóa chuyên khoa |

**5. Reports** (`ReportsController` - `/api/admin/reports`)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/admin/reports/overview` | Tổng quan thống kê hệ thống |

**6. User Management (General)** (`UsersController` - `/api/users`)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/api/users` | Tạo user (chỉ Admin) |
| GET | `/api/users/me` | Thông tin user hiện tại |
| PATCH | `/api/users/:id` | Cập nhật user (chỉ Admin) |
| DELETE | `/api/users/:id` | Xóa user (chỉ Admin) |
| DELETE | `/api/users/multiple` | Xóa nhiều users (chỉ Admin) |
| DELETE | `/api/users/patient/:id` | Xóa bệnh nhân (chỉ Admin) |
| DELETE | `/api/users/patient/multiple` | Xóa nhiều bệnh nhân (chỉ Admin) |

#### Frontend Pages

| Route | Component | Mô tả |
|-------|-----------|-------|
| `/dashboard` | `DashboardHomepage` | Dashboard tổng quan (có thể xem thống kê của bác sĩ) |
| `/dashboard/user-management` | `UserManagement` | Quản lý users (xem danh sách, tìm kiếm, lọc theo role, xem chi tiết) |
| `/dashboard/doctor-management` | `DoctorManagement` | Quản lý bác sĩ và bệnh nhân (tabs: patients, prescriptions, alerts, doctors) |
| `/dashboard/major-management` | `MajorManagement` | Quản lý chuyên khoa (CRUD) |
| `/dashboard/doctor-patients` | `DoctorPatientsPage` | Xem danh sách bệnh nhân của bác sĩ (Admin có thể chọn bác sĩ) |
| `/dashboard/doctor-prescriptions` | `DoctorMissisPillPage` | Xem tình trạng tuân thủ của bệnh nhân |
| `/dashboard/doctor-medications` | `DoctorMedicationsPage` | Xem danh sách thuốc |
| `/dashboard/doctor-info` | `DoctorInfo` | Xem/chỉnh sửa thông tin bác sĩ |
| `/dashboard/patient-info` | `PatientInfo` | Xem/chỉnh sửa thông tin bệnh nhân |

---

### Doctor

#### Backend Endpoints

**1. Doctor Management** (`DoctorController` - `/api/doctor`)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/doctor/doctor` | Danh sách bác sĩ (có tìm kiếm, phân trang) |
| GET | `/api/doctor/patients` | Danh sách bệnh nhân có đơn thuốc ACTIVE (của bác sĩ hiện tại) |
| GET | `/api/doctor/patients/all` | Tất cả bệnh nhân của bác sĩ (kể cả chưa có đơn thuốc) |
| GET | `/api/doctor/patients/:id` | Chi tiết bệnh nhân |
| GET | `/api/doctor/patients/doctor/:doctorId` | Danh sách bệnh nhân theo doctorId |
| POST | `/api/doctor/patients` | Tạo bệnh nhân mới |
| PUT | `/api/doctor/patients/:id/profile` | Cập nhật profile bệnh nhân (gender, birthDate, address) |
| PUT | `/api/doctor/patients/:id/history` | Cập nhật lịch sử y tế bệnh nhân (conditions, allergies, surgeries, etc.) |
| GET | `/api/doctor/overview` | Tổng quan bác sĩ (số đơn thuốc, số bệnh nhân, tỉ lệ tuân thủ) |
| GET | `/api/doctor/overview/prescription-items` | Danh sách các thuốc đã kê (kèm thông tin bệnh nhân) |
| GET | `/api/doctor/overview/active-patients` | Danh sách bệnh nhân đang điều trị kèm tỉ lệ tuân thủ |
| GET | `/api/doctor/patients/:id/adherence` | Thống kê tuân thủ của một bệnh nhân |
| GET | `/api/doctor/alerts` | Danh sách cảnh báo |
| PUT | `/api/doctor/alerts/:id/resolve` | Giải quyết cảnh báo |
| GET | `/api/doctor/adherence/missed` | Danh sách bệnh nhân có liều bỏ lỡ (trong N ngày) |
| GET | `/api/doctor/adherence/status` | Danh sách bệnh nhân với trạng thái tuân thủ và cảnh báo chi tiết |
| POST | `/api/doctor/patients/:id/warn` | Gửi cảnh báo tuân thủ cho bệnh nhân |
| POST | `/api/doctor/test-websocket` | Test WebSocket notification |
| GET | `/api/doctor/fields` | Lấy tất cả thông tin bác sĩ hiện tại |
| PUT | `/api/doctor/fields` | Cập nhật thông tin bác sĩ (fullName, phoneNumber, password, major) |
| POST | `/api/doctor/doctor` | Tạo bác sĩ mới |
| PUT | `/api/doctor/doctor/:id` | Cập nhật bác sĩ |
| DELETE | `/api/doctor/doctor/:id` | Xóa bác sĩ |
| GET | `/api/doctor/doctor/:id` | Chi tiết bác sĩ |

**2. Prescription Management** (`DoctorPrescriptionsController` - `/api/doctor/prescriptions`)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/api/doctor/prescriptions` | Tạo đơn thuốc mới (kèm items: medicationId, dosage, frequencyPerDay, timesOfDay, durationDays) |
| GET | `/api/doctor/prescriptions` | Danh sách đơn thuốc của bác sĩ (có filter theo status, patientId) |
| GET | `/api/doctor/prescriptions/patient/:patientId` | Danh sách đơn thuốc của một bệnh nhân |
| GET | `/api/doctor/prescriptions/:id` | Chi tiết đơn thuốc |
| PATCH | `/api/doctor/prescriptions/:id` | Cập nhật đơn thuốc (status, dates, notes, items) |
| GET | `/api/doctor/prescriptions/patient/:patientId/adherence` | Báo cáo tuân thủ của bệnh nhân (có thể filter theo prescriptionId) |

**3. Notifications** (`NotificationsController` - `/api/notifications`)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/notifications/doctor` | Danh sách thông báo của bác sĩ (phân trang) |
| PUT | `/api/notifications/:id/resolve` | Đánh dấu thông báo đã giải quyết |
| POST | `/api/notifications/doctor/send-reminder` | Gửi nhắc nhở thủ công cho bệnh nhân |
| GET | `/api/notifications/doctor/adherence-report` | Báo cáo tuân thủ của bệnh nhân (chi tiết) |

#### Frontend Pages

| Route | Component | Mô tả |
|-------|-----------|-------|
| `/dashboard/doctor-patients` | `DoctorPatientsPage` | Quản lý bệnh nhân (xem danh sách, tạo mới, xem chi tiết, cập nhật profile/history, gửi nhắc nhở) |
| `/dashboard/doctor-prescriptions` | `DoctorMissisPillPage` | Xem tình trạng tuân thủ của bệnh nhân (real-time với WebSocket) |
| `/dashboard/doctor-medications` | `DoctorMedicationsPage` | Tra cứu danh sách thuốc (để kê đơn) |
| `/dashboard/doctor-info` | `DoctorInfo` | Xem/chỉnh sửa thông tin cá nhân bác sĩ |
| `/dashboard` | `DashboardHomepage` | Dashboard tổng quan (số đơn thuốc, số bệnh nhân, tỉ lệ tuân thủ, danh sách thuốc đã kê, danh sách bệnh nhân) |

---

### Patient

#### Backend Endpoints

**1. Patient Management** (`PatientController` - `/api/patient`)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/patient/fields` | Lấy tất cả thông tin bệnh nhân hiện tại |
| PUT | `/api/patient/fields` | Cập nhật thông tin bệnh nhân (fullName, phoneNumber, password, gender, birthDate, address) |
| GET | `/api/patient/history` | Lịch sử đơn thuốc của bệnh nhân (phân trang, sắp xếp) |
| GET | `/api/patient/reminders` | Nhắc nhở uống thuốc (có thể filter theo date) |
| GET | `/api/patient/adherence` | Lịch sử tuân thủ |
| GET | `/api/patient/overview` | Tổng quan bệnh nhân (số đơn thuốc active, số lần đã uống, số lần bỏ lỡ, số cảnh báo) |
| GET | `/api/patient/alerts` | Danh sách cảnh báo của bệnh nhân |

**2. Prescription Management** (`PatientPrescriptionsController` - `/api/patient/prescriptions`)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/patient/prescriptions` | Danh sách đơn thuốc của bệnh nhân (có filter theo status) |
| GET | `/api/patient/prescriptions/:id` | Chi tiết đơn thuốc |
| GET | `/api/patient/prescriptions/schedule` | Lịch uống thuốc (có thể filter theo date) |
| GET | `/api/patient/prescriptions/today` | Lịch uống thuốc hôm nay |
| POST | `/api/patient/prescriptions/:id/confirm-taken` | Xác nhận đã uống thuốc |
| POST | `/api/patient/prescriptions/:id/mark-missed` | Đánh dấu bỏ lỡ thuốc |
| GET | `/api/patient/prescriptions/:id/history` | Lịch sử uống thuốc của một đơn thuốc |

**3. Prescription (General)** (`PrescriptionsController` - `/api/prescriptions`)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/prescriptions/:id` | Chi tiết đơn thuốc (kiểm tra quyền) |
| GET | `/api/prescriptions/:id/adherence-logs` | Lịch sử tuân thủ của đơn thuốc (kiểm tra quyền) |
| GET | `/api/prescriptions/patient/:patientId/schedule` | Lịch uống thuốc của bệnh nhân (kiểm tra quyền) |
| POST | `/api/prescriptions/:id/log-adherence` | Ghi nhật ký tuân thủ (chỉ Patient) |

**4. Notifications** (`NotificationsController` - `/api/notifications`)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/notifications/patient` | Danh sách thông báo của bệnh nhân (phân trang) |
| PUT | `/api/notifications/:id/resolve` | Đánh dấu thông báo đã giải quyết |
| POST | `/api/notifications/patient/quick-confirm` | Xác nhận uống thuốc nhanh (từ notification) |
| GET | `/api/notifications/patient/medication-schedule` | Lịch uống thuốc (có filter theo date, prescriptionId) |
| GET | `/api/notifications/patient/upcoming-medications` | Thuốc sắp uống (trong 30 phút tới) |

#### Frontend Pages

| Route | Component | Mô tả |
|-------|-----------|-------|
| `/dashboard/patients` | `PatientPage` | Trang chính của bệnh nhân (tabs: overview, prescriptions, schedule, history, alerts) |
| `/dashboard/patient-info` | `PatientInfo` | Xem/chỉnh sửa thông tin cá nhân |

---

### Common/Shared

#### Backend Endpoints

**1. Patient Search** (`PatientController` - `/api/patient`)

| Method | Endpoint | Mô tả | Quyền truy cập |
|--------|----------|-------|---------------|
| GET | `/api/patient/get-all` | Danh sách tất cả bệnh nhân (phân trang) | Public (có thể dùng để tra cứu) |
| GET | `/api/patient/search` | Tìm kiếm bệnh nhân theo tên/số điện thoại | Public |
| GET | `/api/patient/:id/detail` | Chi tiết bệnh nhân (cho bác sĩ) | Public |

**2. Major/Specialty** (`MajorController` - `/api/major-doctors`)

| Method | Endpoint | Mô tả | Quyền truy cập |
|--------|----------|-------|---------------|
| GET | `/api/major-doctors/active` | Danh sách chuyên khoa đang hoạt động | Authenticated |

#### Frontend Pages

| Route | Component | Mô tả |
|-------|-----------|-------|
| `/login` | `Login` | Đăng nhập |
| `/dashboard` | `DashboardHomepage` | Dashboard (redirect theo role) |

---

## Theo Module/Domain

### User Management

**Backend Modules:**
- `UsersModule` - Quản lý users chung
- `AdminUsersController` - Quản lý users (Admin)
- `UsersController` - Quản lý users (general)

**Frontend:**
- `UserManagement` page - Quản lý users (Admin)

**Chức năng:**
- Tạo user (Admin, Doctor, Patient)
- Xem danh sách users (có phân trang, tìm kiếm, lọc theo role)
- Xem chi tiết user
- Cập nhật user
- Xóa user (soft delete)
- Xóa nhiều users
- Xem thông tin user hiện tại (`/me`)

---

### Patient Management

**Backend Modules:**
- `PatientModule` - Quản lý bệnh nhân
- `PatientController` - API cho bệnh nhân
- `DoctorController` - API cho bác sĩ quản lý bệnh nhân

**Frontend:**
- `PatientPage` - Trang chính của bệnh nhân
- `PatientInfo` - Thông tin cá nhân bệnh nhân
- `DoctorPatientsPage` - Quản lý bệnh nhân (Doctor/Admin)

**Chức năng:**
- Tạo bệnh nhân (Doctor)
- Xem danh sách bệnh nhân (Doctor: bệnh nhân của mình, Admin: tất cả)
- Tìm kiếm bệnh nhân (theo tên, số điện thoại)
- Xem chi tiết bệnh nhân
- Cập nhật profile bệnh nhân (gender, birthDate, address)
- Cập nhật lịch sử y tế (conditions, allergies, surgeries, familyHistory, lifestyle, currentMedications, notes)
- Xem lịch sử đơn thuốc
- Xem nhắc nhở uống thuốc
- Xem tổng quan (overview)
- Xem cảnh báo
- Xem lịch sử tuân thủ
- Cập nhật thông tin cá nhân (Patient)

---

### Doctor Management

**Backend Modules:**
- `DoctorModule` - Quản lý bác sĩ
- `DoctorController` - API cho bác sĩ

**Frontend:**
- `DoctorManagement` - Quản lý bác sĩ (Admin)
- `DoctorInfo` - Thông tin cá nhân bác sĩ

**Chức năng:**
- Tạo bác sĩ (Admin/Doctor)
- Xem danh sách bác sĩ
- Xem chi tiết bác sĩ
- Cập nhật bác sĩ
- Xóa bác sĩ
- Xem tổng quan bác sĩ (số đơn thuốc, số bệnh nhân, tỉ lệ tuân thủ)
- Xem danh sách thuốc đã kê
- Xem danh sách bệnh nhân đang điều trị
- Xem cảnh báo
- Gửi cảnh báo tuân thủ cho bệnh nhân
- Cập nhật thông tin cá nhân (Doctor)

---

### Prescription Management

**Backend Modules:**
- `PrescriptionsModule` - Quản lý đơn thuốc
- `PrescriptionsController` - API chung cho đơn thuốc
- `DoctorPrescriptionsController` - API cho bác sĩ
- `PatientPrescriptionsController` - API cho bệnh nhân
- `AdminPrescriptionsController` - API cho Admin

**Frontend:**
- `PatientPage` (tab prescriptions) - Xem đơn thuốc (Patient)
- `DoctorManagement` (tab prescriptions) - Quản lý đơn thuốc (Doctor)
- `DoctorMissisPillPage` - Tình trạng tuân thủ (Doctor/Admin)

**Chức năng:**
- Tạo đơn thuốc (Doctor) - kèm items (medicationId, dosage, frequencyPerDay, timesOfDay, durationDays, route, instructions)
- Xem danh sách đơn thuốc (có filter theo status, doctorId, patientId)
- Xem chi tiết đơn thuốc
- Cập nhật đơn thuốc (status, dates, notes, items)
- Xem lịch uống thuốc (theo ngày)
- Ghi nhật ký tuân thủ (Patient: TAKEN, MISSED, SKIPPED)
- Xác nhận đã uống thuốc (Patient)
- Đánh dấu bỏ lỡ thuốc (Patient)
- Xem lịch sử tuân thủ
- Xem thống kê đơn thuốc (Admin)

---

### Medication Management

**Backend Modules:**
- `MedicationsModule` - Quản lý thuốc
- `MedicationsController` - API cho thuốc

**Frontend:**
- `DoctorMedicationsPage` - Tra cứu thuốc (Doctor)
- `ProductManagement` - Quản lý thuốc (Admin) - *Note: Có thể là quản lý sản phẩm/dịch vụ khác*

**Chức năng:**
- Tạo thuốc mới (Admin)
- Xem danh sách thuốc (có filter active/inactive, phân trang, tìm kiếm)
- Cập nhật thông tin thuốc (name, strength, form, unit, description, isActive)
- Vô hiệu hóa thuốc (Admin)

---

### Major/Specialty Management

**Backend Modules:**
- `MajorModule` - Quản lý chuyên khoa
- `MajorController` - API cho chuyên khoa

**Frontend:**
- `MajorManagement` - Quản lý chuyên khoa (Admin)

**Chức năng:**
- Tạo chuyên khoa mới (Admin)
- Xem danh sách chuyên khoa (có phân trang, tìm kiếm, filter)
- Xem danh sách chuyên khoa đang hoạt động (cho dropdown)
- Xem chi tiết chuyên khoa
- Cập nhật thông tin chuyên khoa (code, name, nameEn, description, sortOrder)
- Cập nhật trạng thái hoạt động
- Xóa chuyên khoa (Admin)

---

### Notifications & Alerts

**Backend Modules:**
- `NotificationsModule` - Quản lý thông báo
- `NotificationsController` - API cho thông báo
- `WebSocketGateway` - WebSocket cho real-time notifications

**Frontend:**
- WebSocket integration (real-time updates)
- Notification components trong các pages

**Chức năng:**
- Xem danh sách thông báo (Doctor/Patient) - phân trang
- Đánh dấu thông báo đã giải quyết
- Gửi nhắc nhở thủ công (Doctor → Patient)
- Xác nhận uống thuốc nhanh từ notification (Patient)
- Xem lịch uống thuốc từ notification
- Xem thuốc sắp uống (trong 30 phút tới)
- Báo cáo tuân thủ (Doctor)
- Real-time updates qua WebSocket

---

### Reports & Statistics

**Backend Modules:**
- `ReportsModule` - Báo cáo và thống kê
- `ReportsController` - API cho báo cáo

**Frontend:**
- `DashboardHomepage` - Dashboard với charts/statistics
- `HealthOverview` - Tổng quan sức khỏe (hiện tại empty)

**Chức năng:**
- Tổng quan thống kê hệ thống (Admin)
- Dashboard tổng quan (Doctor: số đơn thuốc, số bệnh nhân, tỉ lệ tuân thủ)
- Thống kê đơn thuốc (Admin)
- Báo cáo tuân thủ (Doctor)

---

### Other Features

**Frontend Pages (chưa rõ backend API):**

| Route | Component | Mô tả |
|-------|-----------|-------|
| `/dashboard/health-overview` | `HealthOverview` | Tổng quan sức khỏe (hiện tại empty) |
| `/dashboard/medical-schedules` | `MedicalSchedules` | Lịch hẹn khám (có calendar view) |
| `/dashboard/order-management` | `OrderManagement` | Quản lý đơn hàng (có thể liên quan đến dịch vụ) |
| `/dashboard/product-management` | `ProductManagement` | Quản lý sản phẩm/dịch vụ |
| `/dashboard/voucher-management` | `VoucherManagement` | Quản lý voucher (chưa đọc code) |
| `/dashboard/schedule-meeting-of-doctor` | `ScheduleMeetingOfDoctor` | Lịch hẹn của bác sĩ (chưa đọc code) |
| `/dashboard/video-call` | `VideoCall` | Video call (chưa đọc code) |

**Note:** Một số pages này có thể đang trong quá trình phát triển hoặc chưa có backend API tương ứng.

---

## 📊 Tổng Kết

### Backend API Endpoints

- **Authentication:** 4 endpoints
- **User Management:** ~15 endpoints
- **Patient Management:** ~10 endpoints
- **Doctor Management:** ~20 endpoints
- **Prescription Management:** ~25 endpoints
- **Medication Management:** 4 endpoints
- **Major/Specialty Management:** 7 endpoints
- **Notifications:** 8 endpoints
- **Reports:** 1 endpoint

**Tổng cộng:** ~94 API endpoints

### Frontend Pages/Routes

- **Authentication:** 1 page (Login)
- **Dashboard:** 1 page (DashboardHomepage)
- **User Management:** 1 page
- **Patient Management:** 2 pages
- **Doctor Management:** 2 pages
- **Prescription Management:** 2 pages (tích hợp trong các pages khác)
- **Medication Management:** 1 page
- **Major Management:** 1 page
- **Other Features:** ~7 pages (một số có thể chưa hoàn thiện)

**Tổng cộng:** ~17 frontend pages/routes

---

## 🔍 Ghi Chú

1. **WebSocket:** Hệ thống sử dụng WebSocket cho real-time notifications và cập nhật tuân thủ.

2. **Permissions:** Hầu hết các endpoints đều có kiểm tra quyền truy cập dựa trên role (ADMIN, DOCTOR, PATIENT).

3. **Pagination:** Hầu hết các danh sách đều hỗ trợ phân trang (page, limit).

4. **Search & Filter:** Nhiều endpoints hỗ trợ tìm kiếm và lọc dữ liệu.

5. **Soft Delete:** Hệ thống sử dụng soft delete cho users (deletedAt).

6. **Real-time Updates:** Một số tính năng có real-time updates qua WebSocket (ví dụ: tình trạng tuân thủ).

7. **Validation:** Backend sử dụng Zod schemas cho validation (một số endpoints).

---

*Tài liệu này được tạo tự động bằng cách quét toàn bộ codebase. Cập nhật lần cuối: [Date]*

