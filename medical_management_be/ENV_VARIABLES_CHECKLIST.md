# 📋 Environment Variables Checklist

## ✅ Required Variables (Bắt buộc)

Các biến này **BẮT BUỘC** phải có, nếu không app sẽ **CRASH**:

### 1. Database
- [ ] **DATABASE_URL** - PostgreSQL connection string
  - Format: `postgresql://user:password@host:port/database?schema=public`
  - Railway: Copy từ PostgreSQL service → Variables → `DATABASE_PUBLIC_URL` hoặc `DATABASE_URL`

### 2. Application
- [ ] **FRONTEND_URL** - URL của frontend (Vercel)
  - Format: `https://your-app.vercel.app` hoặc `http://localhost:5173`
  - Dùng cho CORS và WebSocket

### 3. JWT & Auth (Tất cả đều REQUIRED)
- [ ] **JWT_ACCESS_TOKEN_SECRET_KEY** - Secret key cho access token
- [ ] **JWT_ACCESS_TOKEN_EXPIRATION_TIME** - Thời gian hết hạn (ví dụ: `15m`, `1h`)
- [ ] **JWT_REFRESH_TOKEN_SECRET_KEY** - Secret key cho refresh token
- [ ] **JWT_REFRESH_TOKEN_EXPIRATION_TIME** - Thời gian hết hạn (ví dụ: `7d`, `30d`)
- [ ] **JWT_VERIFY_TOKEN_SECRET_KEY** - Secret key cho verify token (email verification)
- [ ] **JWT_VERIFY_TOKEN_EXPIRATION_TIME** - Thời gian hết hạn (ví dụ: `24h`)
- [ ] **COOKIE_SECRET** - Secret key cho secure cookies

---

## ⚙️ Optional Variables (Khuyến nghị)

Các biến này có default value nhưng nên set để đảm bảo hoạt động đúng:

### 4. Application Config
- [ ] **NODE_ENV** - `production` hoặc `development`
  - Default: `development`
  - Railway: Set = `production`

- [ ] **PORT** hoặc **BACKEND_PORT** - Port của backend
  - Default: `3000` (app.config) hoặc `9944` (main.ts)
  - Railway: Set = `${{PORT}}` (Railway tự động assign)

### 5. Security & IP Whitelist (Optional)
- [ ] **FRONTEND_DOMAIN** - Domain của frontend
  - Default: `xxx.com`
  - Example: `medical.vercel.app`

- [ ] **API_DOMAIN** - Domain của API
  - Default: `api.xxx.com`
  - Example: `medical-production.up.railway.app`

- [ ] **ALLOW_IP_LOCALHOST** - Cho phép localhost IPs
  - Default: `false`
  - Development: `true`

- [ ] **IP_WHITELIST** - Danh sách IP được phép (JSON array)
  - Default: `[]`
  - Example: `["192.168.1.1", "10.0.0.1"]`

---

## 🚀 Railway Deployment Checklist

### Step 1: Backend Service Variables

Vào backend service trên Railway → Tab **"Variables"** → Thêm:

```bash
# ✅ Required
DATABASE_URL=postgresql://postgres:...@ballast.proxy.rlwy.net:47081/railway
FRONTEND_URL=https://your-vercel-url.vercel.app
NODE_ENV=production

# ✅ Required - JWT Secrets
JWT_ACCESS_TOKEN_SECRET_KEY=<generate-random-string>
JWT_ACCESS_TOKEN_EXPIRATION_TIME=15m
JWT_REFRESH_TOKEN_SECRET_KEY=<generate-random-string>
JWT_REFRESH_TOKEN_EXPIRATION_TIME=7d
JWT_VERIFY_TOKEN_SECRET_KEY=<generate-random-string>
JWT_VERIFY_TOKEN_EXPIRATION_TIME=24h
COOKIE_SECRET=<generate-random-string>

# ✅ Optional but recommended
PORT=${{PORT}}
BACKEND_PORT=${{PORT}}
FRONTEND_DOMAIN=your-vercel-url.vercel.app
API_DOMAIN=your-railway-domain.up.railway.app
```

### Step 2: Generate Random Secrets

Tạo random secrets cho JWT và COOKIE:

```bash
# Linux/Mac
openssl rand -base64 32

# Hoặc dùng online tool
# https://randomkeygen.com/
```

### Step 3: Verify

Sau khi add tất cả variables, redeploy và kiểm tra logs:
- ✅ Không còn lỗi "Required" validation
- ✅ Database connection thành công
- ✅ App start thành công

---

## 📝 Notes

1. **DATABASE_URL**: Trên Railway, dùng `DATABASE_PUBLIC_URL` thay vì internal URL nếu internal không hoạt động

2. **PORT**: Railway tự động assign port, dùng `${{PORT}}` để reference

3. **JWT Secrets**: Phải là random strings dài và phức tạp cho production

4. **FRONTEND_URL**: Phải đúng URL frontend (Vercel) để CORS và WebSocket hoạt động

5. **NODE_ENV**: Set = `production` trên Railway để enable production mode

---

## 🔍 Current Status

### ✅ Đã có trên Railway:
- [x] DATABASE_URL (từ PostgreSQL service)

### ❌ Còn thiếu (cần thêm):
- [ ] FRONTEND_URL (bắt buộc - đang thiếu)
- [ ] JWT_ACCESS_TOKEN_SECRET_KEY
- [ ] JWT_ACCESS_TOKEN_EXPIRATION_TIME
- [ ] JWT_REFRESH_TOKEN_SECRET_KEY
- [ ] JWT_REFRESH_TOKEN_EXPIRATION_TIME
- [ ] JWT_VERIFY_TOKEN_SECRET_KEY
- [ ] JWT_VERIFY_TOKEN_EXPIRATION_TIME
- [ ] COOKIE_SECRET
- [ ] NODE_ENV=production

---

**Sau khi thêm tất cả biến trên, app sẽ start thành công! 🎉**

