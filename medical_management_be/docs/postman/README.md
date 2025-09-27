# Medical Management API - Postman Collection

## 📋 Tổng quan

Postman collection này chứa tất cả các API endpoints cho hệ thống Medical Management, bao gồm cả API mới cho quản lý bác sĩ với field `majorDoctor`.

## 🚀 Cách sử dụng

### 1. Import Collection
- Mở Postman
- Click "Import" 
- Chọn file `Medical_Management_API.postman_collection.json`

### 2. Cấu hình Environment Variables
Collection đã được cấu hình sẵn các biến môi trường:

```json
{
  "base_url": "http://localhost:9933",
  "phoneNumber": "0931000001",
  "password": "123123",
  "doctorId": "cdda1091-1851-4e4b-b39b-710ca68d7c66",
  "majorDoctor": "DINH_DUONG"
}
```

### 3. Test API Doctor Management (Mới)

**⚠️ Lưu ý**: Tất cả API đều yêu cầu authentication. Cần login trước để lấy `access_token`.

#### 🔍 Lấy danh sách bác sĩ
```
GET /api/doctor/doctor
Authorization: Bearer {access_token}
```
- **Query params**: `q`, `page`, `limit`, `sortBy`, `sortOrder`
- **Response**: Danh sách bác sĩ với các field: `fullName`, `status`, `phoneNumber`, `majorDoctor`

#### ➕ Tạo bác sĩ mới
```
POST /api/doctor/doctor
```
- **Body**:
```json
{
  "fullName": "Dr. Test Doctor",
  "phoneNumber": "0900000999",
  "password": "123456",
  "majorDoctor": "DINH_DUONG"
}
```

#### 👤 Lấy thông tin bác sĩ theo ID
```
GET /api/doctor/doctor/{id}
```

#### ✏️ Cập nhật bác sĩ
```
PUT /api/doctor/doctor/{id}
```
- **Body**:
```json
{
  "fullName": "Dr. Updated Name",
  "phoneNumber": "0900000999",
  "majorDoctor": "TAM_THAN",
  "status": "ACTIVE"
}
```

#### 🗑️ Xóa bác sĩ (Soft Delete)
```
DELETE /api/doctor/doctor/{id}
```

## 🏥 Các chuyên khoa (MajorDoctor)

API hỗ trợ các chuyên khoa sau:

- `DINH_DUONG` - Dinh dưỡng
- `TAM_THAN` - Tâm thần
- `TIM_MACH` - Tim mạch
- `NOI_TIET` - Nội tiết
- `NGOAI_KHOA` - Ngoại khoa
- `PHU_SAN` - Phụ sản
- `NHI_KHOA` - Nhi khoa
- `MAT` - Mắt
- `TAI_MUI_HONG` - Tai mũi họng
- `DA_LIEU` - Da liễu
- `XUONG_KHOP` - Xương khớp
- `THAN_KINH` - Thần kinh
- `UNG_BUOU` - Ung bướu
- `HO_HAP` - Hô hấp
- `TIEU_HOA` - Tiêu hóa
- `THAN_TIET_NIEU` - Thận tiết niệu

## 📊 Response Format

### Thành công
```json
{
  "data": {
    "id": "uuid",
    "fullName": "Dr. Test User",
    "phoneNumber": "0900000999",
    "role": "DOCTOR",
    "majorDoctor": "DINH_DUONG",
    "status": "ACTIVE",
    "profile": null
  },
  "statusCode": 200
}
```

### Danh sách với pagination
```json
{
  "data": {
    "items": [...],
    "total": 10,
    "page": 1,
    "limit": 20
  },
  "statusCode": 200
}
```

### Lỗi
```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Validation failed"
}
```

## 🧪 Test Cases

### 1. Test CRUD Operations
1. **Create**: Tạo bác sĩ mới với majorDoctor
2. **Read**: Lấy danh sách và chi tiết bác sĩ
3. **Update**: Cập nhật thông tin bác sĩ
4. **Delete**: Xóa bác sĩ (soft delete)

### 2. Test Validation
- Tạo bác sĩ với majorDoctor không hợp lệ
- Tạo bác sĩ với phoneNumber đã tồn tại
- Cập nhật với dữ liệu không hợp lệ

### 3. Test Pagination & Search
- Lấy danh sách với các tham số pagination
- Tìm kiếm bác sĩ theo tên
- Sắp xếp theo các field khác nhau

## 🔧 Lưu ý quan trọng

### ⚠️ Authentication
- Tất cả API Doctor Management đều yêu cầu authentication
- Cần login trước để lấy `access_token`
- Chỉ DOCTOR và ADMIN mới có quyền truy cập

### 🗄️ Database
- Đã chạy migration để thêm field `majorDoctor`
- Đã chạy seed để tạo dữ liệu mẫu với majorDoctor

### 📝 Logs
- Backend logs sẽ hiển thị các Prisma operations
- Có thể theo dõi performance và debug issues

## 🎯 Next Steps

1. **Authentication**: Implement proper authentication cho production
2. **Authorization**: Thêm role-based access control
3. **Validation**: Thêm Zod validation schemas
4. **Testing**: Viết unit tests và integration tests
5. **Documentation**: Cập nhật Swagger documentation

## 📞 Support

Nếu có vấn đề gì, hãy kiểm tra:
1. Backend logs
2. Database connection
3. Environment variables
4. API endpoint URLs
