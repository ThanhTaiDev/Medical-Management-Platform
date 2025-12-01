# 📋 Tổng Quan Hệ Thống Medical Management

## 🎯 Mục Đích Hệ Thống

Hệ thống quản lý y tế (Medical Management System) là một ứng dụng web toàn diện được thiết kế để quản lý đơn thuốc, theo dõi tuân thủ điều trị (medication adherence), và cung cấp thông báo tự động cho bệnh nhân và bác sĩ.

---

## 🛠️ Programming Languages

### Backend
- **TypeScript** (v5.7.3) - Ngôn ngữ chính
- **Node.js** (v20) - Runtime environment

### Frontend
- **TypeScript** (v5.7.2) - Ngôn ngữ chính
- **JavaScript/JSX** - React components

### Database
- **SQL** - PostgreSQL queries
- **Prisma Schema** - Type-safe database schema

---

## 🏗️ Frameworks & Libraries

### Backend Stack

#### Core Framework
- **NestJS** (v11.0.1) - Progressive Node.js framework
  - Sử dụng Fastify adapter thay vì Express (hiệu suất cao hơn)
  - Module-based architecture
  - Dependency injection
  - Decorators và metadata

#### HTTP & WebSocket
- **Fastify** (qua @nestjs/platform-fastify) - HTTP framework
- **Socket.IO** (v4.8.1) - WebSocket cho real-time notifications
- **@nestjs/websockets** - WebSocket integration

#### Authentication & Security
- **Passport.js** (v0.7.0) - Authentication middleware
  - `passport-local` - Local strategy (username/password)
  - `passport-jwt` - JWT strategy
- **@nestjs/jwt** (v11.0.0) - JWT token generation/validation
- **bcryptjs** (v3.0.2) - Password hashing
- **helmet** (v8.1.0) - Security headers

#### Database & ORM
- **Prisma** (v6.8.2) - Next-generation ORM
  - Type-safe database client
  - Migration system
  - Prisma Studio (database GUI)
- **PostgreSQL** (v16) - Relational database
- **nestjs-prisma** (v0.25.0) - Prisma integration cho NestJS

#### Validation & Transformation
- **class-validator** (v0.14.2) - DTO validation
- **class-transformer** (v0.5.1) - Object transformation
- **zod** (v3.25.13) - Schema validation
- **nestjs-zod** (v4.3.1) - Zod integration

#### Background Jobs & Queue
- **BullMQ** (v5.53.0) - Redis-based queue
- **@nestjs/bullmq** (v11.0.2) - BullMQ integration
- **@nestjs/schedule** (v6.0.0) - Cron jobs
- **@bull-board/api** (v6.9.6) - Queue monitoring UI

#### External Services
- **Resend** (v4.5.1) - Email service
- **@react-email/components** (v0.0.41) - Email templates
- **OpenAI** (v5.3.0) - AI services
- **@google/generative-ai** (v0.24.1) - Google AI services

#### Utilities
- **dayjs** (v1.11.13) - Date manipulation
- **axios** (v1.9.0) - HTTP client
- **chalk** (v5.4.1) - Terminal colors
- **otp-generator** (v4.0.1) - OTP generation

### Frontend Stack

#### Core Framework
- **React** (v19.0.0) - UI library
- **Vite** (v6.3.1) - Build tool và dev server
- **TypeScript** (v5.7.2) - Type safety

#### State Management & Data Fetching
- **@tanstack/react-query** (v5.80.6) - Server state management
- **@tanstack/react-query-devtools** (v5.80.6) - Dev tools
- **React Hooks** - Local state management

#### UI Components & Styling
- **Radix UI** - Headless UI components
  - Dialog, Dropdown, Select, Tabs, Tooltip, etc.
- **Tailwind CSS** (v4.1.4) - Utility-first CSS
- **@tailwindcss/vite** - Vite plugin
- **framer-motion** (v12.7.4) - Animation library
- **lucide-react** (v0.514.0) - Icon library
- **react-icons** (v5.5.0) - Icon library

#### Forms & Validation
- **react-hook-form** (v7.57.0) - Form management
- **@hookform/resolvers** (v5.1.1) - Validation resolvers
- **zod** (v3.25.63) - Schema validation

#### Routing
- **react-router-dom** (v7.5.1) - Client-side routing

#### Data Visualization
- **recharts** (v2.15.3) - Chart library
- **echarts** (v5.6.0) - Advanced charts
- **echarts-for-react** (v3.0.2) - React wrapper

#### Calendar & Scheduling
- **@schedule-x/calendar** (v2.32.0) - Calendar component
- **@schedule-x/drag-and-drop** (v2.32.0) - Drag & drop
- **@schedule-x/react** (v2.32.0) - React integration
- **react-day-picker** - Date picker

#### Real-time Communication
- **socket.io-client** (v4.8.1) - WebSocket client

#### Utilities
- **axios** (v1.9.0) - HTTP client
- **date-fns** (v4.1.0) - Date utilities
- **lodash** (v4.17.21) - Utility functions
- **react-hot-toast** (v2.5.2) - Toast notifications
- **html2pdf.js** (v0.10.3) - PDF generation
- **html-to-image** (v1.11.13) - Image export

---

## 🗄️ Database & ORM

### Database
- **PostgreSQL 16** - Relational database
  - ACID compliance
  - JSON support
  - Full-text search
  - Foreign keys và constraints

### ORM
- **Prisma** (v6.8.2)
  - Type-safe database client
  - Migration system
  - Prisma Studio (GUI)
  - Prisma Extensions:
    - `prisma-extension-soft-delete` - Soft delete
    - `prisma-extension-nested-operations` - Nested operations

### Database Schema

#### Core Models
1. **User** - Người dùng (Admin, Doctor, Patient)
2. **PatientProfile** - Thông tin chi tiết bệnh nhân
3. **PatientMedicalHistory** - Lịch sử y tế
4. **Medication** - Danh mục thuốc
5. **Prescription** - Đơn thuốc
6. **PrescriptionItem** - Chi tiết đơn thuốc
7. **AdherenceLog** - Log tuân thủ điều trị
8. **Alert** - Cảnh báo và thông báo
9. **MajorDoctorTable** - Chuyên khoa bác sĩ

#### Relationships
- User → PatientProfile (1:1)
- User → PatientMedicalHistory (1:1)
- User → Prescription (1:N) - Doctor và Patient
- Prescription → PrescriptionItem (1:N)
- PrescriptionItem → AdherenceLog (1:N)
- User → Alert (1:N) - Doctor và Patient

---

## 🌐 API Architecture

### REST API
- **Base URL**: `/api`
- **Framework**: NestJS với Fastify
- **Content-Type**: `application/json`
- **Authentication**: JWT Bearer token

### WebSocket
- **Namespace**: `/medical-management`
- **Library**: Socket.IO
- **Purpose**: Real-time notifications
- **Events**:
  - `join-room` - Join notification room
  - `leave-room` - Leave room
  - `medication-reminder` - Medication reminders
  - `adherence-alert` - Adherence alerts

### API Endpoints Structure

```
/api
├── /auth
│   ├── POST /login
│   ├── POST /register
│   ├── POST /logout
│   └── GET /me
├── /users
│   ├── GET /profile
│   └── PUT /profile
├── /prescriptions
│   ├── GET /
│   ├── GET /:id
│   ├── POST /
│   └── PATCH /:id
├── /doctor
│   ├── /prescriptions
│   ├── /patients
│   └── /adherence
├── /patient
│   ├── /prescriptions
│   └── /schedule
├── /notifications
│   ├── GET /doctor
│   ├── GET /patient
│   └── POST /send-reminder
└── /major-doctors
    ├── GET /
    ├── POST /
    └── PATCH /:id
```

### API Response Format

```typescript
{
  statusCode: number,
  message?: string,
  data?: any
}
```

---

## 🔐 Authentication & Authorization

### Authentication Method
- **Strategy**: JWT (JSON Web Tokens)
- **Implementation**: Passport.js với JWT và Local strategies

### Token Types
1. **Access Token**
   - Expiration: 15 minutes (configurable)
   - Secret: `JWT_ACCESS_TOKEN_SECRET_KEY`
   - Stored: HTTP-only cookie + localStorage

2. **Refresh Token**
   - Expiration: 7 days (configurable)
   - Secret: `JWT_REFRESH_TOKEN_SECRET_KEY`
   - Stored: localStorage

3. **Verify Token** (for email verification)
   - Expiration: 24 hours
   - Secret: `JWT_VERIFY_TOKEN_SECRET_KEY`

### Password Security
- **Hashing**: bcryptjs với salt rounds = 10
- **Storage**: Hashed passwords trong database
- **Validation**: Minimum 6 characters

### Authorization
- **Role-Based Access Control (RBAC)**
  - Roles: `ADMIN`, `DOCTOR`, `PATIENT`
  - Guards: `JwtAuthGuard`, `LocalAuthGuard`
  - Decorators: `@Public()`, `@UserInfo()`

### Cookie Settings
- **httpOnly**: true (prevent XSS)
- **secure**: true (production only, requires HTTPS)
- **sameSite**: 'lax' (development), 'none' (production)
- **domain**: localhost (development), api.uniko.id.vn (production)

### CORS Configuration
- **Development**: Allow all origins (`*`)
- **Production**: Specific origins (configurable)
- **Credentials**: Enabled
- **Methods**: GET, POST, PUT, PATCH, DELETE, OPTIONS

---

## 🚀 Deployment Method

### Docker & Docker Compose

#### Services
1. **PostgreSQL** (port 5432)
   - Image: `postgres:16`
   - Volume: `postgres-data`
   - Health check: `pg_isready`

2. **Backend** (port 9900)
   - Multi-stage build
   - Base: `node:20-alpine`
   - Build: Install dependencies, generate Prisma, build
   - Production: Copy dist và node_modules

3. **Frontend** (port 9901)
   - Multi-stage build
   - Builder: `node:20-alpine` - Build React app
   - Production: `nginx:alpine` - Serve static files

#### Network
- **Name**: `medical-management-network`
- **Type**: Bridge
- **Subnet**: 172.20.0.0/16

#### Volumes
- `postgres-data` - PostgreSQL data persistence

### Build Process

#### Backend
```dockerfile
1. Install dependencies (yarn install)
2. Generate Prisma Client (npx prisma generate)
3. Build TypeScript (yarn build)
4. Copy dist, node_modules, prisma to production image
```

#### Frontend
```dockerfile
1. Install dependencies (yarn install --frozen-lockfile)
2. Build React app (yarn build) với VITE_API_URL
3. Copy dist to nginx html directory
4. Serve với nginx
```

### Environment Variables

#### Backend (.env hoặc docker-compose.yml)
```env
NODE_ENV=development|production
DATABASE_URL=postgresql://user:pass@host:port/db
PORT=9900
FRONTEND_URL=http://localhost:9901
JWT_ACCESS_TOKEN_SECRET_KEY=...
JWT_REFRESH_TOKEN_SECRET_KEY=...
JWT_VERIFY_TOKEN_SECRET_KEY=...
JWT_ACCESS_TOKEN_EXPIRATION_TIME=15m
JWT_REFRESH_TOKEN_EXPIRATION_TIME=7d
JWT_VERIFY_TOKEN_EXPIRATION_TIME=24h
COOKIE_SECRET=...
```

#### Frontend (build-time)
```env
VITE_API_URL=http://localhost:9900
VITE_BACKEND_URL=http://localhost:9900
```

---

## 📁 Project Folder Structure

### Root Structure
```
medical/
├── docker-compose.yml          # Docker Compose configuration
├── medical_management_be/      # Backend application
├── medical_management_fe/      # Frontend application
└── documents/                  # Documentation (UML, use cases)
```

### Backend Structure (`medical_management_be/`)
```
medical_management_be/
├── prisma/
│   ├── schema.prisma           # Database schema
│   ├── migrations/             # Database migrations
│   └── seed.ts                 # Seed data script
├── src/
│   ├── main.ts                 # Application entry point
│   ├── app.module.ts           # Root module
│   ├── core/                   # Core modules
│   │   ├── auth/               # Authentication
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── guards/         # Auth guards
│   │   │   └── strategy/       # Passport strategies
│   │   ├── configs/            # Configuration
│   │   ├── database/           # Database service
│   │   ├── errors/             # Error handling
│   │   └── logger/             # Logging
│   ├── modules/                # Feature modules
│   │   ├── users/              # User management
│   │   ├── prescriptions/      # Prescription management
│   │   ├── doctor/             # Doctor features
│   │   ├── patient/            # Patient features
│   │   ├── medications/        # Medication management
│   │   ├── notifications/      # Notifications & WebSocket
│   │   ├── major/              # Major doctor categories
│   │   └── reports/            # Reports
│   ├── common/                 # Shared utilities
│   │   ├── decorators/         # Custom decorators
│   │   ├── interceptors/       # Interceptors
│   │   ├── middleware/         # Middleware
│   │   └── pipes/              # Pipes
│   ├── utils/                  # Utility functions
│   └── schemas/                # Validation schemas
├── scripts/                    # Utility scripts
│   ├── seed-development.ts
│   ├── seed-major-doctors.ts
│   └── verify-data.ts
├── Dockerfile                  # Backend Dockerfile
├── package.json
└── tsconfig.json
```

### Frontend Structure (`medical_management_fe/`)
```
medical_management_fe/
├── src/
│   ├── main.tsx                # Application entry
│   ├── api/                    # API clients
│   │   ├── axios.ts            # Axios configuration
│   │   ├── auth/               # Auth API
│   │   ├── user/               # User API
│   │   └── ...
│   ├── components/             # React components
│   │   ├── ui/                 # Base UI components
│   │   └── ...
│   ├── screen/                 # Page components
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   └── ...
│   ├── hooks/                  # Custom hooks
│   ├── router/                 # Routing configuration
│   ├── lib/                    # Utilities
│   ├── types/                  # TypeScript types
│   ├── schemas/                # Validation schemas
│   └── utils/                  # Helper functions
├── public/                     # Static assets
├── Dockerfile                  # Frontend Dockerfile
├── nginx.conf                  # Nginx configuration
├── vite.config.ts              # Vite configuration
└── package.json
```

---

## 🔧 Environment Variables

### Backend Required Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:9901` |
| `NODE_ENV` | Environment mode | `development` or `production` |
| `PORT` | Backend port | `9900` |
| `JWT_ACCESS_TOKEN_SECRET_KEY` | JWT access token secret | Random string |
| `JWT_REFRESH_TOKEN_SECRET_KEY` | JWT refresh token secret | Random string |
| `JWT_VERIFY_TOKEN_SECRET_KEY` | JWT verify token secret | Random string |
| `JWT_ACCESS_TOKEN_EXPIRATION_TIME` | Access token expiry | `15m` |
| `JWT_REFRESH_TOKEN_EXPIRATION_TIME` | Refresh token expiry | `7d` |
| `JWT_VERIFY_TOKEN_EXPIRATION_TIME` | Verify token expiry | `24h` |
| `COOKIE_SECRET` | Cookie encryption secret | Random string |

### Frontend Build-Time Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:9900` |
| `VITE_BACKEND_URL` | Backend URL (alternative) | `http://localhost:9900` |

---

## 🌍 Third-Party Services & External APIs

### Email Service
- **Resend** (v4.5.1)
  - Transactional emails
  - Email templates với React Email

### AI Services
- **OpenAI** (v5.3.0)
  - AI-powered features
- **Google Generative AI** (v0.24.1)
  - Alternative AI provider

### Notification Services (Planned)
- **SMS Service** - SMS notifications (not yet implemented)
- **Push Notification Service** - Mobile push (not yet implemented)

### Queue Service
- **BullMQ** với Redis
  - Background job processing
  - Queue monitoring với Bull Board

---

## 🏛️ Architecture Pattern

### Monolithic Architecture
- **Type**: Monolithic (single backend service)
- **Structure**: Modular monolith với NestJS modules
- **Benefits**:
  - Simpler deployment
  - Easier development
  - Shared database
- **Drawbacks**:
  - Single point of failure
  - Scaling limitations

### Module Organization
- **Core Module**: Authentication, database, config, logging
- **Feature Modules**: Users, prescriptions, notifications, etc.
- **Shared Module**: Common decorators, interceptors, middleware

### Design Patterns
- **Dependency Injection**: NestJS built-in DI
- **Repository Pattern**: Prisma client abstraction
- **Service Layer**: Business logic separation
- **DTO Pattern**: Data Transfer Objects cho validation
- **Guard Pattern**: Authentication/authorization guards
- **Interceptor Pattern**: Response transformation

---

## 🧪 Dev Tools

### Linters & Formatters
- **ESLint** (v9.27.0)
  - Backend: `@typescript-eslint/eslint-plugin`
  - Frontend: `eslint-plugin-react-hooks`
- **Prettier** (v3.4.2)
  - Code formatting

### Testing
- **Jest** (v29.7.0)
  - Unit tests
  - E2E tests
- **Supertest** (v7.0.0)
  - HTTP assertion library
- **ts-jest** (v29.2.5)
  - TypeScript support

### Build Tools
- **SWC** (v1.10.7)
  - Fast TypeScript/JavaScript compiler
- **ts-loader** (v9.5.2)
  - TypeScript loader
- **Vite** (v6.3.1)
  - Frontend build tool

### Development Tools
- **Prisma Studio**
  - Database GUI
- **React Query Devtools**
  - Frontend state debugging
- **Bull Board**
  - Queue monitoring

### CI/CD
- **Not configured** (có thể setup với GitHub Actions)

---

## 🔄 Data Flow

### Request Flow

```
1. Client Request
   ↓
2. Frontend (React)
   - Axios interceptor adds JWT token
   ↓
3. Backend (NestJS)
   - CORS middleware
   - Helmet security headers
   - IP whitelist middleware
   - JWT Auth Guard (if not @Public())
   ↓
4. Controller
   - Validates request với DTO
   - Calls service
   ↓
5. Service
   - Business logic
   - Database operations via Prisma
   ↓
6. Database (PostgreSQL)
   - Query execution
   - Returns data
   ↓
7. Service
   - Transforms data
   - Returns to controller
   ↓
8. Controller
   - Transform interceptor
   - Returns response
   ↓
9. Frontend
   - React Query caches response
   - Updates UI
```

### WebSocket Flow

```
1. Client connects
   ↓
2. WebSocket Gateway
   - Authenticates (TODO: not fully implemented)
   - Joins room
   ↓
3. Notification Service
   - Sends notification
   ↓
4. WebSocket Gateway
   - Emits to room
   ↓
5. Client receives
   - Updates UI in real-time
```

### Background Job Flow

```
1. Cron Job triggers
   ↓
2. Scheduler Service
   - Checks medication schedules
   - Checks adherence
   ↓
3. Notification Service
   - Creates alerts
   - Sends notifications
   ↓
4. WebSocket Gateway
   - Emits real-time updates
```

---

## 📜 Important Scripts

### Backend Scripts (`package.json`)

| Script | Purpose |
|--------|---------|
| `yarn dev` | Start development server với hot reload |
| `yarn build` | Build production bundle |
| `yarn start:prod` | Start production server |
| `yarn prisma:generate` | Generate Prisma Client |
| `yarn prisma:migrate` | Run database migrations |
| `yarn prisma:studio` | Open Prisma Studio GUI |
| `yarn db:seed` | Seed database với sample data |
| `yarn test` | Run unit tests |
| `yarn test:e2e` | Run end-to-end tests |
| `yarn lint` | Lint code |

### Database Scripts (`scripts/`)

| Script | Purpose |
|--------|---------|
| `seed-development.ts` | Seed data cho development |
| `seed-major-doctors.ts` | Seed major doctor categories |
| `verify-data.ts` | Verify database data |
| `check-data.ts` | Check data integrity |
| `assign-patients-to-doctors.ts` | Assign patients to doctors |

### Frontend Scripts (`package.json`)

| Script | Purpose |
|--------|---------|
| `yarn dev` | Start Vite dev server |
| `yarn build` | Build production bundle |
| `yarn preview` | Preview production build |
| `yarn lint` | Lint code |

---

## 🔒 Security-Sensitive Areas

### Authentication & Authorization
- **JWT Secrets**: Stored in environment variables
- **Password Hashing**: bcryptjs với salt rounds
- **Token Expiration**: Short-lived access tokens (15m)
- **Cookie Security**: httpOnly, secure (production), sameSite

### CORS Configuration
- **Development**: Open (`*`) - **⚠️ Security risk in production**
- **Production**: Should be restricted to specific origins
- **Credentials**: Enabled for cookie-based auth

### Input Validation
- **DTO Validation**: class-validator
- **Schema Validation**: Zod
- **SQL Injection**: Prevented by Prisma (parameterized queries)

### Security Headers
- **Helmet**: Security headers middleware
  - XSS protection
  - Content Security Policy
  - HSTS

### IP Whitelist
- **Middleware**: `IpWhitelistMiddleware`
- **Purpose**: Restrict access by IP (optional)

### Areas Needing Attention
1. **WebSocket Authentication**: Not fully implemented (allows connections without auth)
2. **CORS in Production**: Should restrict origins
3. **Rate Limiting**: Not implemented
4. **API Key Management**: Secrets should be rotated regularly

---

## 🔌 Backend & Frontend Communication

### HTTP Communication

#### Request
```typescript
// Frontend
axiosInstance.post('/auth/login', { phoneNumber, password })

// Backend receives
@Post('/login')
@UseGuards(LocalAuthGuard)
async login(@Body() body: LoginDto)
```

#### Response
```typescript
// Backend returns
{
  accessToken: string,
  refreshToken: string,
  user: User
}

// Frontend stores
localStorage.setItem('accessToken', token)
```

### WebSocket Communication

#### Connection
```typescript
// Frontend
const socket = io(`${API_URL}/medical-management`, {
  auth: { token: accessToken }
})

// Backend
@WebSocketGateway({
  namespace: '/medical-management',
  cors: { origin: FRONTEND_URL }
})
```

#### Events
```typescript
// Frontend emits
socket.emit('join-room', { room: 'doctor-123' })

// Backend handles
@SubscribeMessage('join-room')
handleJoinRoom(@MessageBody() data, @ConnectedSocket() client)

// Backend emits
this.server.to(room).emit('medication-reminder', data)

// Frontend listens
socket.on('medication-reminder', (data) => {
  // Update UI
})
```

### Error Handling
```typescript
// Frontend interceptor
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Redirect to login
    }
    return Promise.reject(error)
  }
)
```

---

## 🐳 Docker Usage

### Docker Compose Services

#### PostgreSQL Service
```yaml
postgres:
  image: postgres:16
  environment:
    POSTGRES_USER: postgres
    POSTGRES_PASSWORD: postgres123
    POSTGRES_DB: medical_management
  volumes:
    - postgres-data:/var/lib/postgresql/data
  healthcheck:
    test: ["CMD-SHELL", "pg_isready -U postgres"]
```

#### Backend Service
```yaml
backend:
  build:
    context: ./medical_management_be
    dockerfile: Dockerfile
  environment:
    DATABASE_URL: postgresql://postgres:postgres123@postgres:5432/medical_management
    PORT: 9900
  depends_on:
    postgres:
      condition: service_healthy
```

#### Frontend Service
```yaml
frontend:
  build:
    context: ./medical_management_fe
    dockerfile: Dockerfile
    args:
      VITE_API_URL: http://localhost:9900
  ports:
    - "9901:9901"
```

### Multi-Stage Builds

#### Backend Dockerfile
```dockerfile
# Stage 1: Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN npx prisma generate
RUN yarn build

# Stage 2: Production
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
CMD ["node", "dist/main.js"]
```

#### Frontend Dockerfile
```dockerfile
# Stage 1: Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN yarn build

# Stage 2: Production
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Network
- **Type**: Bridge network
- **Name**: `medical-management-network`
- **Subnet**: 172.20.0.0/16
- **Purpose**: Service communication

### Volume Management
- **postgres-data**: Persistent storage cho PostgreSQL
- **Location**: Docker managed volume

---

## ⚠️ Outdated, Unused, or Redundant Tech

### Potentially Outdated
1. **Yarn v1.22.22** - Có thể upgrade lên Yarn v3/v4
2. **Some dependencies** - Cần kiểm tra updates thường xuyên

### Unused Features
1. **BullMQ/Redis** - Đã cài nhưng có thể chưa sử dụng đầy đủ
2. **Microservices** - `@nestjs/microservices` đã cài nhưng không dùng (monolithic)
3. **React Email** - Đã cài nhưng có thể chưa implement đầy đủ

### Redundant
1. **Multiple date libraries**: dayjs và date-fns (có thể chọn một)
2. **Multiple chart libraries**: recharts và echarts (có thể chọn một)

---

## 💡 Suggestions for Improvements

### Security
1. ✅ **Implement rate limiting** - Prevent brute force attacks
2. ✅ **Complete WebSocket authentication** - Hiện tại cho phép connection không auth
3. ✅ **Restrict CORS in production** - Không nên dùng `*`
4. ✅ **Add API versioning** - `/api/v1/...`
5. ✅ **Implement refresh token rotation**

### Performance
1. ✅ **Add Redis caching** - Cache frequently accessed data
2. ✅ **Database indexing** - Optimize queries
3. ✅ **Implement pagination** - Cho tất cả list endpoints
4. ✅ **Add compression** - Gzip/Brotli compression

### Code Quality
1. ✅ **Add more unit tests** - Increase test coverage
2. ✅ **Add E2E tests** - Critical user flows
3. ✅ **Setup CI/CD** - GitHub Actions
4. ✅ **Add code coverage reports**

### Architecture
1. ✅ **Consider microservices** - Nếu cần scale
2. ✅ **Add API Gateway** - Centralized routing
3. ✅ **Implement event-driven architecture** - Cho notifications

### Developer Experience
1. ✅ **Add API documentation** - Swagger/OpenAPI
2. ✅ **Improve error messages** - More descriptive
3. ✅ **Add logging service** - Centralized logging
4. ✅ **Setup monitoring** - APM tools

---

## 📊 Concise System Summary

### For New Team Members

**Medical Management System** là một ứng dụng web quản lý đơn thuốc và theo dõi tuân thủ điều trị. Hệ thống gồm:

1. **Backend (NestJS + PostgreSQL)**
   - REST API cho CRUD operations
   - WebSocket cho real-time notifications
   - JWT authentication
   - Prisma ORM

2. **Frontend (React + Vite)**
   - React 19 với TypeScript
   - React Query cho state management
   - Tailwind CSS cho styling
   - Socket.IO client cho real-time

3. **Database (PostgreSQL)**
   - Users, Prescriptions, Medications, Adherence Logs
   - Prisma schema-driven

4. **Deployment (Docker)**
   - Docker Compose cho local development
   - Multi-stage builds cho production

### Key Features
- ✅ User authentication (Admin, Doctor, Patient)
- ✅ Prescription management
- ✅ Medication adherence tracking
- ✅ Real-time notifications
- ✅ Scheduled medication reminders
- ✅ Reports và analytics

### Tech Stack Summary
- **Backend**: NestJS, Fastify, Prisma, PostgreSQL, Socket.IO
- **Frontend**: React, Vite, TypeScript, Tailwind, React Query
- **DevOps**: Docker, Docker Compose
- **Auth**: JWT, Passport.js, bcryptjs

---

## 🏗️ Architecture Visualization

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  React Frontend (Port 9901)                          │   │
│  │  - React 19 + TypeScript                             │   │
│  │  - React Query (State Management)                    │   │
│  │  - Axios (HTTP Client)                                │   │
│  │  - Socket.IO Client (WebSocket)                      │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/REST + WebSocket
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      API GATEWAY LAYER                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  NestJS Backend (Port 9900)                          │   │
│  │  - Fastify HTTP Server                               │   │
│  │  - Socket.IO WebSocket Server                       │   │
│  │  - CORS Middleware                                   │   │
│  │  - Helmet Security                                   │   │
│  │  - JWT Auth Guard                                    │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│  Controllers │   │   Services   │   │  WebSocket   │
│  - Auth      │   │  - Auth      │   │  Gateway     │
│  - Users     │   │  - Users     │   │  - Real-time │
│  - Presc.    │   │  - Presc.    │   │  - Notif.    │
│  - Doctor    │   │  - Doctor    │   │              │
│  - Patient   │   │  - Patient   │   │              │
└──────────────┘   └──────────────┘   └──────────────┘
        │                   │
        │                   │
        └───────────┬───────┘
                    │
                    ▼
        ┌───────────────────────┐
        │   Prisma ORM Client   │
        │   - Type-safe queries │
        │   - Migrations        │
        └───────────────────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │   PostgreSQL (5432)  │
        │   - Relational DB     │
        │   - ACID compliance   │
        └───────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    BACKGROUND JOBS                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Cron Jobs (@nestjs/schedule)                       │   │
│  │  - Medication Reminders                             │   │
│  │  - Adherence Checks                                 │   │
│  │  - Report Generation                                │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  EXTERNAL SERVICES                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Resend     │  │   OpenAI     │  │   Google AI  │      │
│  │   (Email)    │  │   (AI)       │  │   (AI)       │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow Example: Create Prescription

```
1. Doctor (Frontend)
   ↓ POST /api/doctor/prescriptions
   { patientId, items: [...] }
   
2. Backend Controller
   ↓ DoctorPrescriptionsController.create()
   Validates DTO
   
3. Prescription Service
   ↓ PrescriptionService.create()
   Business logic validation
   
4. Prisma Client
   ↓ prisma.prescription.create()
   Database transaction
   
5. PostgreSQL
   ↓ INSERT INTO prescriptions...
   Returns created record
   
6. Notification Service
   ↓ NotificationService.sendPrescriptionCreated()
   Creates alert
   
7. WebSocket Gateway
   ↓ socket.to(patientRoom).emit('prescription-created')
   Real-time notification
   
8. Patient (Frontend)
   ↓ socket.on('prescription-created')
   Updates UI
```

---

## 📝 Notes

- Hệ thống sử dụng **monolithic architecture** với modular design
- **Prisma** cung cấp type safety từ database đến application code
- **WebSocket authentication** chưa được implement đầy đủ (cần hoàn thiện)
- **CORS** trong development cho phép tất cả origins (cần restrict trong production)
- **Docker Compose** được sử dụng cho local development và có thể dùng cho production
- **Background jobs** sử dụng cron scheduling cho medication reminders

---

**Last Updated**: 2025-11-27  
**Version**: 1.0.0  
**Maintainer**: Development Team

