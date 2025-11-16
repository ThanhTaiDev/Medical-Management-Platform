# 🚀 Hướng Dẫn Deploy

## ⚠️ FIX LỖI VERCEL

Vercel đang deploy sai backend. Làm như sau:

### 1. Vào Vercel Dashboard → Project "medical" → Settings

### 2. Vào phần "General" → "Root Directory"

### 3. Click "Edit" → Chọn: `medical_management_fe`

### 4. Lưu lại

### 5. Vào phần "Build & Development Settings"

Cấu hình:
- **Framework Preset**: Vite
- **Build Command**: `yarn build`  
- **Output Directory**: `dist`
- **Install Command**: `yarn install`
- **Node.js Version**: 20.x

### 6. Vào phần "Environment Variables"

Thêm:
- **Key**: `VITE_API_URL`
- **Value**: URL backend (sẽ thêm sau khi deploy BE)
- Chọn: Production, Preview, Development

### 7. Redeploy

Vào tab "Deployments" → Click "..." → "Redeploy"

---

## 🔧 DEPLOY BACKEND LÊN RAILWAY

### Bước 1: Tạo Project

1. Truy cập https://railway.app
2. Đăng nhập bằng GitHub
3. Click **"New Project"**
4. Chọn **"Deploy from GitHub repo"**
5. Tìm và chọn repo: **`ThanhTaiDev/medical`**

### Bước 2: Cấu Hình Service

Sau khi import, Railway tạo 1 service. Click vào service đó:

1. Vào tab **"Settings"**
2. Tìm phần **"Source"**:
   - **Root Directory**: Chọn `medical_management_be`

### Bước 3: Add PostgreSQL Database

1. Trong project, click **"+ New"**
2. Chọn **"Database"** → **"Add PostgreSQL"**
3. Railway tự tạo database
4. Click vào database service → Tab **"Variables"**
5. Copy giá trị **`DATABASE_URL`**

### Bước 4: Environment Variables

Quay lại backend service → Tab **"Variables"** → Thêm:

```
DATABASE_URL = <paste DATABASE_URL từ PostgreSQL service>
FRONTEND_URL = https://your-vercel-url.vercel.app
NODE_ENV = production
BACKEND_PORT = ${{PORT}}
```

**Lưu ý**: `${{PORT}}` là biến đặc biệt của Railway, tự động set port.

### Bước 5: Cấu Hình Build

Vào tab **"Settings"** → Tìm phần **"Deploy"**:

- **Build Command**: 
  ```
  yarn install && yarn prisma generate && yarn build
  ```
  
- **Start Command**:
  ```
  yarn start:prod
  ```

### Bước 6: Chạy Migration

Sau khi deploy lần đầu thành công:

1. Vào tab **"Deployments"**
2. Click vào deployment mới nhất
3. Click tab **"Logs"**
4. Tìm lỗi database (nếu có)

Hoặc chạy migration thủ công:

Vào tab **"Settings"** → Tìm **"Deploy Command"** → Thêm:

```
yarn prisma generate && yarn prisma migrate deploy && yarn build && yarn start:prod
```

### Bước 7: Lấy URL Backend

Sau khi deploy thành công:
1. Vào tab **"Settings"**
2. Phần **"Networking"** → **"Generate Domain"**
3. Copy URL (ví dụ: `medical-backend-production.up.railway.app`)
4. Thêm `/api` ở cuối: `https://medical-backend-production.up.railway.app/api`

### Bước 8: Update Vercel Environment Variable

Quay lại Vercel:
1. Project → Settings → Environment Variables
2. Sửa `VITE_API_URL` = URL backend từ Railway + `/api`
3. Redeploy frontend

---

## ✅ Checklist

### Vercel (Frontend):
- [ ] Root Directory = `medical_management_fe`
- [ ] Build Command = `yarn build`
- [ ] Output Directory = `dist`
- [ ] Environment Variable `VITE_API_URL` đã set
- [ ] Deploy thành công

### Railway (Backend):
- [ ] Root Directory = `medical_management_be`
- [ ] PostgreSQL database đã tạo
- [ ] `DATABASE_URL` đã copy vào backend service
- [ ] `FRONTEND_URL` đã set (URL Vercel)
- [ ] Build Command đã set
- [ ] Start Command đã set
- [ ] Migration đã chạy
- [ ] Backend domain đã generate
- [ ] Backend URL đã update vào `VITE_API_URL` trên Vercel

---

## 🔍 Troubleshooting

### Vercel vẫn lỗi:
- Đảm bảo Root Directory = `medical_management_fe` (không có dấu `/` ở đầu)
- Xóa project và tạo lại nếu vẫn lỗi

### Railway build fail:
- Kiểm tra logs trong tab "Deployments"
- Đảm bảo Root Directory đúng
- Kiểm tra `package.json` có đầy đủ scripts

### Database connection error:
- Kiểm tra `DATABASE_URL` đúng format
- Đảm bảo đã copy từ PostgreSQL service, không tự tạo

### CORS error:
- Backend cần set `FRONTEND_URL` = URL Vercel
- Kiểm tra CORS config trong backend code

