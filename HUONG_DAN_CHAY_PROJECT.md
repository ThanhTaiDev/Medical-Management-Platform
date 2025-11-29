# Hướng Dẫn Chạy Project Medical Management

## Yêu Cầu Hệ Thống

- **Docker Desktop** (Windows/Mac) hoặc **Docker Engine** (Linux)
- **Docker Compose** (thường đi kèm với Docker Desktop)
- Tối thiểu **4GB RAM** trống
- **Ports cần mở**: 9900 (Backend), 9901 (Frontend), 5432 (PostgreSQL)

---

## Cách 1: Chạy Bằng Docker Compose (Khuyến Nghị)

### Bước 1: Kiểm Tra Docker

Mở terminal/PowerShell và kiểm tra Docker đã cài đặt:

```bash
docker --version
docker-compose --version
```

Nếu chưa có, tải Docker Desktop tại: https://www.docker.com/products/docker-desktop

### Bước 2: Khởi Động Project

Từ thư mục gốc của project (`medical`), chạy lệnh:

```bash
docker-compose up -d
```

Lệnh này sẽ:
- Tải images cần thiết (nếu chưa có)
- Build backend và frontend
- Khởi động PostgreSQL database
- Chạy tất cả services

### Bước 3: Kiểm Tra Logs

Xem logs để đảm bảo mọi thứ chạy đúng:

```bash
# Xem logs tất cả services
docker-compose logs -f

# Hoặc xem logs từng service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Bước 4: Seed Database (Lần Đầu Tiên)

Sau khi backend đã khởi động xong, seed database với dữ liệu mẫu:

```bash
docker-compose exec backend sh -c "cd /app && tsx prisma/seed.ts"
```

### Bước 5: Truy Cập Ứng Dụng

- **Frontend**: http://localhost:9901
- **Backend API**: http://localhost:9900
- **API Docs**: http://localhost:9900/api/docs (nếu có Swagger)

---

## Cách 2: Chạy Thủ Công (Development Mode)

### Backend

```bash
cd medical_management_be

# Cài đặt dependencies
yarn install

# Tạo Prisma Client
npx prisma generate

# Chạy database migrations
npx prisma migrate dev

# Seed database (lần đầu)
yarn db:seed

# Chạy backend
yarn dev
```

Backend sẽ chạy tại: http://localhost:9900

### Frontend

Mở terminal mới:

```bash
cd medical_management_fe

# Cài đặt dependencies
yarn install

# Tạo file .env (nếu chưa có)
echo "VITE_API_URL=http://localhost:9900" > .env

# Chạy frontend
yarn dev
```

Frontend sẽ chạy tại: http://localhost:5173 (hoặc port khác nếu 5173 bận)

**Lưu ý**: Cần chạy PostgreSQL database trước. Có thể dùng Docker:

```bash
docker run -d \
  --name medical-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres123 \
  -e POSTGRES_DB=medical_management \
  -p 5432:5432 \
  postgres:16
```

---

## Tài Khoản Mặc Định

Sau khi seed database, có thể đăng nhập với:

### Admin
- **Số điện thoại**: `0889001505`
- **Mật khẩu**: `admin001`

### Doctor
- **Số điện thoại**: `0808080808`
- **Mật khẩu**: `doctor001`

### Patient
- **Số điện thoại**: `0909090909`
- **Mật khẩu**: `patient001`

---

## Các Lệnh Docker Hữu Ích

### Dừng Services
```bash
docker-compose down
```

### Dừng và Xóa Volumes (Xóa dữ liệu database)
```bash
docker-compose down -v
```

### Rebuild Images
```bash
docker-compose build --no-cache
docker-compose up -d
```

### Xem Trạng Thái Services
```bash
docker-compose ps
```

### Vào Container Backend
```bash
docker-compose exec backend sh
```

### Xem Database với Prisma Studio
```bash
docker-compose exec backend npx prisma studio
```

Sau đó truy cập: http://localhost:5555

### Restart Service Cụ Thể
```bash
docker-compose restart backend
docker-compose restart frontend
```

---

## Xử Lý Lỗi Thường Gặp

### 1. Port Đã Được Sử Dụng

**Lỗi**: `port is already allocated`

**Giải pháp**: 
- Đổi port trong `docker-compose.yml`
- Hoặc dừng service đang dùng port đó

### 2. Database Connection Error

**Lỗi**: `Can't reach database server`

**Giải pháp**:
```bash
# Kiểm tra PostgreSQL đã chạy chưa
docker-compose ps postgres

# Xem logs PostgreSQL
docker-compose logs postgres

# Restart PostgreSQL
docker-compose restart postgres
```

### 3. Backend Không Khởi Động

**Giải pháp**:
```bash
# Xem logs chi tiết
docker-compose logs backend

# Rebuild backend
docker-compose build backend --no-cache
docker-compose up -d backend
```

### 4. Frontend Không Kết Nối Được Backend

**Kiểm tra**:
- Backend đã chạy chưa: http://localhost:9900
- Environment variable `VITE_API_URL` đúng chưa
- CORS settings trong backend

### 5. Migration Errors

**Lỗi**: `P3005 The database schema is not empty`

**Giải pháp**:
```bash
# Vào container backend
docker-compose exec backend sh

# Chạy db push thay vì migrate
npx prisma db push --skip-generate
```

---

## Cấu Trúc Project

```
medical/
├── docker-compose.yml          # Docker Compose config
├── medical_management_be/       # Backend (NestJS)
│   ├── src/                    # Source code
│   ├── prisma/                 # Database schema & migrations
│   └── Dockerfile
├── medical_management_fe/      # Frontend (React + Vite)
│   ├── src/                    # Source code
│   └── Dockerfile
└── documents/                  # Documentation
```

---

## Environment Variables

### Backend (trong docker-compose.yml)
- `DATABASE_URL`: Connection string đến PostgreSQL
- `JWT_ACCESS_TOKEN_SECRET_KEY`: Secret key cho JWT
- `PORT`: Port backend (mặc định: 9900)
- `FRONTEND_URL`: URL frontend để CORS

### Frontend (build args trong docker-compose.yml)
- `VITE_API_URL`: URL backend API
- `VITE_BACKEND_URL`: URL backend (có thể giống VITE_API_URL)

---

## Production Deployment

Để deploy production, sử dụng file `docker-compose-production.yml`:

```bash
docker-compose -f docker-compose-production.yml up -d
```

**Lưu ý**: Nhớ thay đổi các secret keys và environment variables cho production!

---

## Hỗ Trợ

Nếu gặp vấn đề, kiểm tra:
1. Logs của services: `docker-compose logs`
2. Trạng thái containers: `docker-compose ps`
3. Database connection: `docker-compose exec postgres psql -U postgres -d medical_management`

---

*Cập nhật: [Date]*

