# So Sánh Use Case: Phân Quyền Hệ Thống (System Authorization/Permission Management) - Admin

## Use Case Diagram: Phân Quyền Hệ Thống

### 📊 Tổng Quan

| Use Case | Trạng thái | Endpoint/Chức năng | Ghi chú |
|----------|------------|-------------------|---------|
| **1. Đăng nhập (Login)** - Included | ✅ **CÓ** | `POST /api/auth/login` | Bắt buộc để quản lý phân quyền |
| **2. Phân quyền hệ thống** - Main | ⚠️ **MỘT PHẦN** | Role-based access control (RBAC)<br>Không có module quản lý permission riêng | Hệ thống dùng RBAC đơn giản, chưa có permission management |
| **3. Tạo quyền mới** - Extended | ❌ **THIẾU** | Không có endpoint tạo permission | Hệ thống chỉ có 3 roles cố định |
| **4. Chỉnh sửa quyền** - Extended | ❌ **THIẾU** | Không có endpoint edit permission | Roles là enum cố định |
| **5. Gán quyền cho người dùng** - Extended | ✅ **CÓ** | `PATCH /api/admin/users/:id` với `role`<br>`POST /api/admin/users` với `role` | Gán role cho user (ADMIN, DOCTOR, PATIENT) |
| **6. Xem danh sách quyền** - Extended | ⚠️ **MỘT PHẦN** | Không có endpoint list permissions<br>Có thể xem roles trong User model | Roles là enum, không có permission list riêng |

---

## Chi Tiết Các Endpoint Đã Triển Khai

### 1. Đăng nhập (Login) ✅ - Included Use Case

```typescript
POST /api/auth/login
Body: { phoneNumber: string, password: string }
Response: { accessToken: string, refreshToken: string, user: {...} }
Cookie: token (JWT)
```

**Mô tả:** Bắt buộc phải đăng nhập trước khi quản lý phân quyền.

---

### 2. Phân Quyền Hệ Thống ⚠️ - Main Use Case (Một Phần)

**2.1. Hệ thống hiện tại:**
- **Role-Based Access Control (RBAC)** đơn giản
- 3 roles cố định: `ADMIN`, `DOCTOR`, `PATIENT`
- Roles được định nghĩa trong Prisma schema như enum:
```prisma
enum UserRole {
  ADMIN
  DOCTOR
  PATIENT
}
```

**2.2. Authorization logic:**
- Mỗi endpoint kiểm tra role của user:
```typescript
if (user.roles !== UserRole.ADMIN) {
  throw new HttpException('Bạn không có quyền', HttpStatus.FORBIDDEN);
}
```

**2.3. Thiếu:**
- ❌ Không có module quản lý permission riêng
- ❌ Không có model `Permission` trong database
- ❌ Không có hệ thống permission granular (chỉ có role-based)
- ❌ Không có UI để quản lý permissions

**Đề xuất triển khai (nếu cần permission management):**
```prisma
model Permission {
  id          String   @id @default(uuid())
  name        String   @unique
  code        String   @unique
  description String?
  module      String   // e.g., "PRESCRIPTIONS", "PATIENTS", "MEDICATIONS"
  action      String   // e.g., "CREATE", "READ", "UPDATE", "DELETE"
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  roles       Role[]   @relation("RolePermissions")
}

model Role {
  id          String       @id @default(uuid())
  name        String       @unique
  code        String       @unique
  description String?
  permissions Permission[] @relation("RolePermissions")
  users       User[]
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
}

// Update User model:
model User {
  // ... existing fields
  roleId  String?
  role    Role?   @relation(fields: [roleId], references: [id])
}
```

---

### 3. Tạo Quyền Mới ❌ - Extended Use Case (Thiếu)

**Trạng thái:** Hệ thống không có chức năng tạo permission mới.

**3.1. Thiếu:**
- ❌ Không có model `Permission` trong database
- ❌ Không có endpoint `POST /api/admin/permissions`
- ❌ Không có UI để tạo permission

**Lý do:**
- Hệ thống hiện tại sử dụng RBAC đơn giản với 3 roles cố định
- Permissions được hardcode trong code (kiểm tra role trong controllers)
- Không có nhu cầu tạo permission động

**Nếu muốn triển khai:**
```typescript
POST /api/admin/permissions
Body: {
  name: string,
  code: string,
  description?: string,
  module: string,
  action: "CREATE" | "READ" | "UPDATE" | "DELETE"
}
Response: Permission
```

---

### 4. Chỉnh Sửa Quyền ❌ - Extended Use Case (Thiếu)

**Trạng thái:** Hệ thống không có chức năng chỉnh sửa permission.

**4.1. Thiếu:**
- ❌ Không có endpoint `PATCH /api/admin/permissions/:id`
- ❌ Không có UI để edit permission

**Lý do:**
- Permissions được hardcode trong code
- Không có model Permission để edit

**Nếu muốn triển khai:**
```typescript
PATCH /api/admin/permissions/:id
Body: {
  name?: string,
  description?: string,
  module?: string,
  action?: string
}
Response: Permission
```

---

### 5. Gán Quyền Cho Người Dùng ✅ - Extended Use Case

**5.1. Gán role khi tạo user:**
```typescript
POST /api/admin/users
Body: {
  fullName: string,
  phoneNumber: string,
  password: string,
  role: "ADMIN" | "DOCTOR" | "PATIENT"  // ✅ Gán role
}
Response: User
```

**5.2. Cập nhật role:**
```typescript
PATCH /api/admin/users/:id
Body: {
  role?: "ADMIN" | "DOCTOR" | "PATIENT"  // ✅ Cập nhật role
}
Response: User
```

**Frontend:**
- `UserManagement` có role selector trong create/edit user form
- Có thể chọn role: Admin, Doctor, Patient

**Lưu ý:** Đây là gán **role**, không phải gán **permission** riêng lẻ. Mỗi role có một set permissions cố định được hardcode trong code.

---

### 6. Xem Danh Sách Quyền ⚠️ - Extended Use Case (Một Phần)

**6.1. Đã có:**
- Có thể xem roles trong User model (ADMIN, DOCTOR, PATIENT)
- Có thể xem danh sách users với role của họ

**6.2. Thiếu:**
- ❌ Không có endpoint `GET /api/admin/permissions`
- ❌ Không có UI để xem danh sách permissions
- ❌ Không có mapping giữa roles và permissions

**Frontend:**
- `UserManagement` hiển thị role của mỗi user
- Không có page để xem danh sách permissions

**Nếu muốn triển khai:**
```typescript
GET /api/admin/permissions
Response: Permission[]

GET /api/admin/roles
Response: Role[]  // Với permissions của mỗi role

GET /api/admin/roles/:id/permissions
Response: {
  role: Role,
  permissions: Permission[]
}
```

---

## Tổng Kết

| Use Case | Trạng thái | Tỷ lệ |
|----------|------------|-------|
| Đã triển khai đầy đủ | ✅ 1/6 | **16.7%** |
| Đã triển khai một phần | ⚠️ 2/6 | **33.3%** |
| Chưa triển khai | ❌ 3/6 | **50%** |

**Kết luận:** Hệ thống đã triển khai **16.7%** các use case đầy đủ, **33.3%** một phần, và **50%** chưa triển khai. 

**Lý do:** Hệ thống sử dụng **RBAC đơn giản** với 3 roles cố định, không có hệ thống permission management phức tạp. Điều này phù hợp với yêu cầu hiện tại, nhưng nếu cần granular permissions, cần refactor sang hệ thống permission-based.

---

## Chi Tiết Bổ Sung

### 1. Hệ Thống Phân Quyền Hiện Tại

**Architecture:**
- **Type:** Role-Based Access Control (RBAC) đơn giản
- **Roles:** 3 roles cố định (ADMIN, DOCTOR, PATIENT)
- **Authorization:** Kiểm tra role trong controllers
- **Storage:** Role được lưu trong User model (enum)

**Authorization Pattern:**
```typescript
// Pattern được sử dụng trong tất cả controllers:
private ensureAdmin(user: IUserFromToken) {
  if (user.roles !== UserRole.ADMIN) {
    throw new HttpException('Bạn không có quyền', HttpStatus.FORBIDDEN);
  }
}

private ensureDoctor(user: IUserFromToken) {
  if (user.roles !== UserRole.DOCTOR && user.roles !== UserRole.ADMIN) {
    throw new HttpException('Bạn không có quyền', HttpStatus.FORBIDDEN);
  }
}
```

**Permissions được hardcode:**
- ADMIN: Full access
- DOCTOR: Manage patients, prescriptions, view adherence
- PATIENT: View own data, confirm medication intake

---

### 2. So Sánh với Use Case Diagram

**Use Case Diagram yêu cầu:**
- Tạo quyền mới
- Chỉnh sửa quyền
- Gán quyền cho người dùng
- Xem danh sách quyền

**Hệ thống hiện tại:**
- ✅ Gán role cho người dùng (tương đương "gán quyền")
- ⚠️ Xem danh sách roles (không phải permissions)
- ❌ Tạo/chỉnh sửa permission (không có permission model)

**Kết luận:** Hệ thống hiện tại **không phù hợp** với use case diagram nếu diagram yêu cầu permission management phức tạp. Nếu chỉ cần role management, thì đã đáp ứng một phần.

---

### 3. Đề Xuất Triển Khai (Nếu Cần Permission Management)

**Option 1: Giữ nguyên RBAC đơn giản (Khuyến nghị)**
- Phù hợp với hệ thống nhỏ/trung bình
- Dễ maintain
- Đủ cho yêu cầu hiện tại
- Không cần refactor

**Option 2: Nâng cấp sang Permission-Based (Nếu cần)**
- Tạo models: `Permission`, `Role`, `RolePermission`
- Tạo endpoints: CRUD permissions, assign permissions to roles
- Tạo UI: Permission management page
- Refactor authorization logic: Kiểm tra permission thay vì chỉ role

**Implementation nếu chọn Option 2:**
```prisma
// Schema
model Permission {
  id          String   @id @default(uuid())
  name        String   @unique
  code        String   @unique
  description String?
  module      String
  action      String
  roles       Role[]   @relation("RolePermissions")
}

model Role {
  id          String       @id @default(uuid())
  name        String       @unique
  code        String       @unique
  permissions Permission[] @relation("RolePermissions")
  users       User[]
}
```

```typescript
// Endpoints
POST /api/admin/permissions
GET /api/admin/permissions
PATCH /api/admin/permissions/:id
DELETE /api/admin/permissions/:id

POST /api/admin/roles
GET /api/admin/roles
PATCH /api/admin/roles/:id
POST /api/admin/roles/:id/permissions  // Assign permissions to role
```

---

### 4. Kết Luận

**Hệ thống hiện tại:**
- ✅ Đã có RBAC cơ bản
- ✅ Có thể gán role cho user
- ✅ Authorization hoạt động tốt
- ❌ Không có permission management phức tạp

**Khuyến nghị:**
- Nếu use case diagram chỉ yêu cầu role management → Hệ thống đã đáp ứng đủ
- Nếu use case diagram yêu cầu permission management chi tiết → Cần refactor và nâng cấp hệ thống

**Quyết định:**
- Tùy thuộc vào yêu cầu thực tế của dự án
- RBAC đơn giản thường đủ cho hầu hết các hệ thống
- Permission-based chỉ cần khi có yêu cầu phân quyền rất chi tiết

---

*Cập nhật: [Date]*

