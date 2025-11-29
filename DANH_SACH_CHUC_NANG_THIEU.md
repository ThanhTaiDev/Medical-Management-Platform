# Danh Sách Chi Tiết Các Chức Năng Còn Thiếu

## 📋 TỔNG QUAN

Tổng cộng: **16 use cases**
- ✅ Hoàn thiện (100%): **4 use cases**
- ✅ Tốt (≥70%): **3 use cases**
- ⚠️ Cần cải thiện (50-70%): **5 use cases**
- ❌ Cần cải thiện nhiều (<50%): **4 use cases**

---

## ❌ CHỨC NĂNG THIẾU HOÀN TOÀN

### 1. **Chỉnh sửa xác nhận đã uống thuốc** (Edit Confirmation)
- **Use Case:** Xác nhận đã uống thuốc (Patient) - 83.3% hoàn thành
- **Thiếu:**
  - Endpoint `PATCH /api/patient/prescriptions/:prescriptionId/adherence-logs/:logId`
  - Endpoint `DELETE /api/patient/prescriptions/:prescriptionId/adherence-logs/:logId`
  - UI nút "Sửa" và "Xóa" trong danh sách lịch sử xác nhận
  - Dialog để chỉnh sửa thông tin xác nhận
- **Lưu ý:** Có thể giới hạn thời gian sửa/xóa (ví dụ: trong 24 giờ)

---

### 2. **Xuất Excel/PDF** (Export Reports)
- **Use Cases bị ảnh hưởng:**
  - ✅ Quản lý người dùng (Admin) - 77.8% hoàn thành
  - ✅ Quản lý đơn thuốc (Admin) - 57.1% hoàn thành
  - ✅ Xem báo cáo tổng quan (Admin) - 57.1% hoàn thành
  - ✅ Xem lịch sử điều trị (Doctor) - 57.1% hoàn thành
  - ✅ Xem lịch sử dùng thuốc (Patient) - 40% hoàn thành
- **Thiếu:**
  - Backend endpoints export Excel/PDF
  - UI button "Xuất Excel" / "Xuất PDF"
  - Library xử lý export (xlsx, pdfkit)
- **Khuyến nghị:** Tạo module export chung để tái sử dụng

---

### 3. **Xem trước đơn thuốc** (Preview Prescription)
- **Use Case:** Kê đơn thuốc điện tử (Doctor) - 33.3% hoàn thành
- **Thiếu:**
  - UI preview modal/dialog
  - Button "Xem trước" trong form kê đơn
  - Hiển thị formatted prescription với:
    - Thông tin bệnh nhân (tên, tuổi, giới tính)
    - Bảng danh sách thuốc (tên, liều lượng, số lần/ngày, thời gian uống, số ngày)
    - Timeline lịch uống thuốc (calendar view)
    - Ghi chú của bác sĩ
    - Tổng số ngày điều trị
    - Ngày bắt đầu và kết thúc dự kiến
  - Nút "Xác nhận" và "Chỉnh sửa" trong preview
- **Lưu ý:** Backend không cần endpoint riêng, dùng data từ form

---

### 4. **Quản lý hồ sơ bệnh án cho Patient**
- **Use Case:** Quản lý hồ sơ bệnh án (Patient) - 14.3% hoàn thành
- **Thiếu:**

#### 4.1. Thông tin cá nhân thiếu fields:
- ❌ **Email** - Không có trong schema `PatientProfile`
- ❌ **Chiều cao (Height)** - Không có trong schema
- ❌ **Cân nặng (Weight)** - Không có trong schema
- **Cần:** Cập nhật schema và endpoint `PUT /api/patient/fields`

#### 4.2. Quản lý tiền sử bệnh (Conditions):
- ❌ Endpoints cho Patient:
  - `POST /api/patient/medical-history/conditions`
  - `PATCH /api/patient/medical-history/conditions/:id`
  - `DELETE /api/patient/medical-history/conditions/:id`
- ❌ UI để patient thêm/sửa/xóa conditions
- **Lưu ý:** Hiện tại chỉ Doctor có thể quản lý qua `PUT /api/doctor/patients/:id/history`

#### 4.3. Quản lý dị ứng (Allergies):
- ❌ Endpoints cho Patient:
  - `POST /api/patient/medical-history/allergies`
  - `PATCH /api/patient/medical-history/allergies/:id`
  - `DELETE /api/patient/medical-history/allergies/:id`
- ❌ UI để patient thêm/sửa/xóa allergies

#### 4.4. Quản lý phẫu thuật (Surgeries):
- ❌ Endpoints cho Patient:
  - `POST /api/patient/medical-history/surgeries`
  - `PATCH /api/patient/medical-history/surgeries/:id`
  - `DELETE /api/patient/medical-history/surgeries/:id`
- ❌ UI để patient thêm/sửa/xóa surgeries

#### 4.5. Cập nhật lối sống (Lifestyle):
- ❌ Endpoint `PATCH /api/patient/medical-history/lifestyle`
- ❌ UI để patient cập nhật lifestyle
- **Lưu ý:** Hiện tại `lifestyle` là string đơn giản, có thể cần cấu trúc phức tạp hơn

#### 4.6. Frontend UI:
- ❌ Tabs/sections trong `PatientInfo` component:
  - Tab "Thông tin cá nhân" (hiện có)
  - Tab "Tiền sử bệnh" (mới)
  - Tab "Dị ứng" (mới)
  - Tab "Phẫu thuật" (mới)
  - Tab "Lối sống" (mới)

---

### 5. **Permission Management** (Phân quyền hệ thống)
- **Use Case:** Phân quyền hệ thống (Admin) - 16.7% hoàn thành
- **Thiếu:**
  - Model Permission và Role trong database
  - Endpoints CRUD permissions:
    - `GET /api/admin/permissions` - Danh sách quyền
    - `POST /api/admin/permissions` - Tạo quyền mới
    - `PATCH /api/admin/permissions/:id` - Chỉnh sửa quyền
    - `DELETE /api/admin/permissions/:id` - Xóa quyền
  - UI quản lý permissions
- **Lưu ý:** Hệ thống hiện dùng RBAC đơn giản với 3 roles cố định (ADMIN, DOCTOR, PATIENT). Cần xác nhận với stakeholder xem có cần permission management chi tiết hay không.

---

## ⚠️ CHỨC NĂNG THIẾU MỘT PHẦN

### 1. **Xem biểu đồ tuân thủ** (Adherence Charts)
- **Use Cases bị ảnh hưởng:**
  - ✅ Giám sát tuân thủ uống thuốc (Doctor) - 71.4% hoàn thành
    - Có trong dashboard, chưa có trong trang giám sát
  - ✅ Xem lịch sử dùng thuốc (Patient) - 40% hoàn thành
    - Chưa có cho Patient (chỉ có cho Admin/Doctor)
- **Thiếu:**
  - ReactECharts component trong trang giám sát tuân thủ (Doctor)
  - ReactECharts component trong trang lịch sử dùng thuốc (Patient)
  - Biểu đồ hiển thị tỷ lệ tuân thủ theo thời gian

---

### 2. **Tìm kiếm/Search**
- **Use Cases bị ảnh hưởng:**
  - ✅ Kê đơn thuốc (Doctor) - 33.3% hoàn thành
    - ✅ **ĐÃ TRIỂN KHAI:** Search UI trong medication selector (vừa hoàn thành)
  - ✅ Quản lý đơn thuốc (Admin) - 57.1% hoàn thành
    - Chưa có search text (chỉ có filter)
- **Thiếu:**
  - Search box trong trang quản lý đơn thuốc (Admin)
  - Backend search support cho prescriptions (tìm theo tên bệnh nhân, tên thuốc, etc.)

---

### 3. **Xem đơn thuốc gần nhất** (Load from Recent)
- **Use Case:** Kê đơn thuốc điện tử (Doctor) - 33.3% hoàn thành
- **Thiếu:**
  - Endpoint `GET /api/doctor/prescriptions/patient/:patientId/most-recent`
  - Button "Xem đơn gần nhất" trong form kê đơn
  - Pre-fill form từ đơn cũ
  - Cho phép chỉnh sửa trước khi tạo mới

---

### 4. **Xem lịch sử điều trị** (Treatment History Timeline)
- **Use Cases bị ảnh hưởng:**
  - ✅ Quản lý bệnh nhân (Doctor) - 62.5% hoàn thành
    - Chưa có endpoint/timeline riêng
  - ✅ Xem lịch sử điều trị (Doctor) - 57.1% hoàn thành
    - Chưa có endpoint riêng
- **Thiếu:**
  - Endpoint `GET /api/doctor/patients/:id/treatment-history`
  - Timeline view hiển thị:
    - Các đơn thuốc theo thời gian
    - Các lần khám
    - Ghi chú điều trị
    - Biểu đồ tiến triển

---

### 5. **Filter theo thời gian** (Date Range Filter)
- **Use Cases bị ảnh hưởng:**
  - ✅ Xem lịch sử dùng thuốc (Patient) - 40% hoàn thành
    - Chưa có date range filter
  - ✅ Xem báo cáo tổng quan (Admin) - 57.1% hoàn thành
    - Chưa có time-based stats endpoint
- **Thiếu:**
  - Date range picker component
  - Backend support cho date range queries
  - Endpoint thống kê theo thời gian

---

### 6. **Xem chi tiết thuốc** (Medication Detail)
- **Use Case:** Quản lý thuốc (Admin) - 50% hoàn thành
- **Thiếu:**
  - Endpoint riêng `GET /api/admin/medications/:id`
  - Detail modal hiển thị:
    - Thông tin chi tiết thuốc
    - Usage statistics (số lần được kê đơn, số bệnh nhân sử dụng)
    - Lịch sử sử dụng

---

### 7. **Lọc bệnh nhân** (Patient Filter)
- **Use Case:** Quản lý bệnh nhân (Doctor) - 62.5% hoàn thành
- **Thiếu:**
  - Filter UI với các options:
    - Status (ACTIVE, INACTIVE, BLOCKED)
    - Gender (MALE, FEMALE, OTHER)
    - Age range (từ - đến)
  - Filter panel component

---

### 8. **Xem ghi chú điều trị** (Treatment Notes Aggregate View)
- **Use Case:** Xem lịch sử điều trị (Doctor) - 57.1% hoàn thành
- **Thiếu:**
  - Aggregate view hiển thị tất cả ghi chú điều trị
  - UI để xem và tìm kiếm ghi chú

---

## 📊 TÓM TẮT THEO MỨC ĐỘ ƯU TIÊN

### 🔴 Priority 1: Quan Trọng Nhất (Cần triển khai ngay)

1. **Xuất Excel/PDF** (Nhiều use cases)
   - Impact: Cao
   - Effort: Trung bình
   - Use cases: 5 use cases

2. **Xem trước đơn thuốc** (Kê đơn thuốc)
   - Impact: Cao (tránh lỗi khi kê đơn)
   - Effort: Thấp-Trung bình
   - Use case: 1 use case

3. **Quản lý hồ sơ bệnh án cho Patient** (Quản lý hồ sơ bệnh án)
   - Impact: Cao (Patient cần tự quản lý)
   - Effort: Trung bình-Cao
   - Use case: 1 use case

4. **Tìm kiếm thuốc trong form kê đơn** (Kê đơn thuốc)
   - Impact: Trung bình-Cao (UX tốt hơn)
   - Effort: Thấp
   - ✅ **ĐÃ TRIỂN KHAI**

---

### 🟡 Priority 2: Cải Thiện UX (Có thể triển khai sau)

5. **Xem biểu đồ tuân thủ** (Giám sát tuân thủ, Xem lịch sử)
   - Impact: Trung bình
   - Effort: Trung bình
   - Use cases: 2 use cases

6. **Xem lịch sử điều trị với timeline** (Quản lý bệnh nhân, Xem lịch sử điều trị)
   - Impact: Trung bình
   - Effort: Trung bình
   - Use cases: 2 use cases

7. **Filter theo thời gian** (Xem lịch sử, Báo cáo)
   - Impact: Trung bình
   - Effort: Thấp-Trung bình
   - Use cases: 2 use cases

8. **Chỉnh sửa xác nhận** (Xác nhận đã uống thuốc)
   - Impact: Thấp-Trung bình
   - Effort: Trung bình
   - Use case: 1 use case

9. **Xem đơn thuốc gần nhất** (Kê đơn thuốc)
   - Impact: Trung bình
   - Effort: Thấp-Trung bình
   - Use case: 1 use case

10. **Tìm kiếm đơn thuốc** (Quản lý đơn thuốc Admin)
    - Impact: Trung bình
    - Effort: Thấp
    - Use case: 1 use case

11. **Lọc bệnh nhân** (Quản lý bệnh nhân)
    - Impact: Trung bình
    - Effort: Thấp-Trung bình
    - Use case: 1 use case

12. **Xem chi tiết thuốc** (Quản lý thuốc)
    - Impact: Thấp-Trung bình
    - Effort: Thấp
    - Use case: 1 use case

---

### 🟢 Priority 3: Tùy Chọn (Có thể bỏ qua hoặc triển khai sau)

13. **Permission Management** (Phân quyền hệ thống)
    - **Lưu ý:** Hệ thống hiện dùng RBAC đơn giản, có thể không cần
    - Impact: Thấp (nếu không có yêu cầu cụ thể)
    - Effort: Cao (cần refactor toàn bộ)
    - Use case: 1 use case

14. **Hard delete thuốc** (Quản lý thuốc)
    - Impact: Thấp (soft delete đã đủ)
    - Effort: Thấp
    - Use case: 1 use case

---

## 📝 GHI CHÚ QUAN TRỌNG

### 1. Permission Management
- Hệ thống hiện dùng **RBAC đơn giản** với 3 roles cố định
- Use case diagram yêu cầu permission management phức tạp
- **Quyết định:** Cần xác nhận với stakeholder xem có cần permission management chi tiết hay không

### 2. Export Excel/PDF
- Thiếu ở nhiều use cases
- **Khuyến nghị:** Tạo một module export chung để tái sử dụng

### 3. Patient Medical History Management
- Hiện tại chỉ Doctor có thể quản lý
- Patient chỉ có thể xem
- **Khuyến nghị:** Cho phép Patient tự quản lý một phần (conditions, allergies, surgeries, lifestyle)

### 4. Preview Prescription
- Quan trọng để tránh lỗi khi kê đơn
- **Khuyến nghị:** Ưu tiên triển khai

### 5. Search Medication
- ✅ **ĐÃ TRIỂN KHAI** - Tìm kiếm thuốc trong form kê đơn đã được thêm vào

---

*Cập nhật: [Date]*

