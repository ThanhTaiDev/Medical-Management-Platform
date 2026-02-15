<p align="center">
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/PostgreSQL_16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/Socket.IO-010101?style=for-the-badge&logo=socketdotio&logoColor=white" alt="Socket.IO" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
</p>

# 🏥 MediTrack — Medical Management System

> A comprehensive full-stack web application for prescription management, medication adherence tracking, and real-time patient-doctor communication — built with modern technologies and production-ready architecture.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Database Schema](#-database-schema)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Docker Deployment](#-docker-deployment)
- [API Documentation](#-api-documentation)
- [Environment Variables](#-environment-variables)
- [Scripts Reference](#-scripts-reference)
- [UML Documentation](#-uml-documentation)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**MediTrack** is a modern healthcare management platform designed to streamline the interaction between **doctors**, **patients**, and **administrators**. It provides tools for digital prescription management, automated medication reminders, adherence tracking analytics, and real-time notifications — all within a secure, role-based access system.

### 🎯 Problem Statement

Medication non-adherence is a critical challenge in healthcare, leading to poor treatment outcomes. MediTrack addresses this by providing:

- **Automated reminders** that notify patients at scheduled medication times
- **Adherence tracking** that gives doctors visibility into patient compliance
- **Real-time alerts** when patients miss doses or show low adherence patterns
- **AI-powered insights** for smarter healthcare decision-making

---

## ✨ Key Features

### 👨‍⚕️ Doctor Portal
- 📋 Create and manage digital prescriptions with detailed medication items
- 👥 View and manage assigned patient list with medical histories
- 📊 Monitor patient adherence rates with visual analytics
- 🔔 Receive real-time alerts for missed doses and low adherence
- 📅 Schedule and manage patient appointments (calendar view with drag-and-drop)
- 📹 Video call consultations with patients
- 📑 Generate and export prescription reports (PDF)

### 🧑‍🤝‍🧑 Patient Portal
- 💊 View active prescriptions and medication schedules
- ✅ Log medication intake (taken, missed, skipped)
- 📆 Interactive calendar showing daily medication timeline
- 📈 Track personal adherence statistics over time
- 🔔 Receive medication reminders via real-time notifications
- 📋 View and manage personal health profile & medical history

### 🛡️ Admin Dashboard
- 👤 User management (doctors, patients, administrators)
- 🏷️ Medical specialty (major) management for doctor categorization
- 💊 Medication catalog management
- 📊 System-wide analytics and reporting dashboard
- 🎟️ Voucher and order management

### 🔧 System Capabilities
- 🔐 JWT authentication with access/refresh token rotation
- 🛡️ Role-Based Access Control (RBAC): Admin, Doctor, Patient
- ⚡ Real-time WebSocket notifications via Socket.IO
- 📧 Transactional email notifications (Resend + React Email templates)
- 🤖 AI integration (OpenAI GPT & Google Gemini)
- ⏰ Background job processing with BullMQ (cron-based medication reminders)
- 📊 Queue monitoring dashboard (Bull Board)
- 🌙 Dark/Light mode theme toggle

---

## 🛠️ Tech Stack

### Backend

| Technology | Version | Purpose |
|---|---|---|
| **NestJS** | v11 | Progressive Node.js framework |
| **Fastify** | — | High-performance HTTP adapter (replaces Express) |
| **Prisma** | v6.8 | Next-gen ORM with type-safe queries |
| **PostgreSQL** | 16 | Relational database |
| **Passport.js** | v0.7 | JWT & local authentication strategies |
| **Socket.IO** | v4.8 | Real-time WebSocket communication |
| **BullMQ** | v5.53 | Redis-based background job queue |
| **Resend** | v4.5 | Transactional email delivery |
| **OpenAI SDK** | v5.3 | AI-powered features |
| **Google Generative AI** | v0.24 | Alternative AI provider |
| **Zod** | v3.25 | Runtime schema validation |
| **Swagger** | v11.2 | Auto-generated API documentation |

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| **React** | v19 | UI library (latest) |
| **Vite** | v6.3 | Lightning-fast build tool & dev server |
| **TypeScript** | v5.7 | Type safety across the stack |
| **Tailwind CSS** | v4.1 | Utility-first CSS framework |
| **Radix UI** | — | Accessible headless UI components |
| **TanStack Query** | v5.80 | Server state management & caching |
| **TanStack Table** | v8.21 | Powerful data table component |
| **React Hook Form** | v7.57 | Performant form management |
| **Framer Motion** | v12.7 | Smooth animations & transitions |
| **Recharts + ECharts** | — | Data visualization & analytics charts |
| **Schedule-X** | v2.32 | Interactive calendar with drag-and-drop |
| **Socket.IO Client** | v4.8 | Real-time communication |
| **html2pdf.js** | — | Client-side PDF generation |

### DevOps & Tooling

| Technology | Purpose |
|---|---|
| **Docker** + **Docker Compose** | Containerized deployment (multi-stage builds) |
| **Nginx** | Frontend static file serving & reverse proxy |
| **Jest** + **Supertest** | Unit & E2E testing |
| **ESLint** + **Prettier** | Code linting & formatting |
| **SWC** | Fast TypeScript compilation |
| **Prisma Studio** | Visual database management GUI |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Browser                        │
├──────────────────────────┬──────────────────────────────────┤
│      React 19 + Vite     │       Socket.IO Client           │
│   (TanStack Query, Axios)│    (Real-time Notifications)     │
└──────────┬───────────────┴──────────────┬───────────────────┘
           │ HTTP/REST                    │ WebSocket
           ▼                             ▼
┌─────────────────────────────────────────────────────────────┐
│                   NestJS + Fastify Backend                   │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────┐ ┌──────────┐ ┌───────────┐ ┌──────────────┐  │
│  │   Auth   │ │  Doctor  │ │  Patient  │ │Prescriptions │  │
│  │  Module  │ │  Module  │ │  Module   │ │   Module     │  │
│  └──────────┘ └──────────┘ └───────────┘ └──────────────┘  │
│  ┌──────────┐ ┌──────────┐ ┌───────────┐ ┌──────────────┐  │
│  │  Users   │ │Medications│ │  Reports  │ │Notifications │  │
│  │  Module  │ │  Module  │ │  Module   │ │ (WebSocket)  │  │
│  └──────────┘ └──────────┘ └───────────┘ └──────────────┘  │
├─────────────────────────────────────────────────────────────┤
│         Prisma ORM │ BullMQ Jobs │ Socket.IO Gateway        │
└─────────┬──────────┴──────┬──────┴──────────────────────────┘
          │                 │
          ▼                 ▼
┌──────────────────┐ ┌──────────────┐  ┌────────────────────┐
│  PostgreSQL 16   │ │    Redis     │  │  External Services │
│  (Primary DB)    │ │  (Job Queue) │  │  Resend, OpenAI,   │
│                  │ │              │  │  Google AI         │
└──────────────────┘ └──────────────┘  └────────────────────┘
```

### Design Patterns Used

- **Modular Monolith** — NestJS module-based architecture for clean separation
- **Dependency Injection** — Built-in IoC container
- **Repository Pattern** — Prisma client abstraction layer
- **DTO Pattern** — Data Transfer Objects with class-validator + Zod
- **Guard Pattern** — JWT & role-based authorization guards
- **Interceptor Pattern** — Response transformation & logging

---

## 🗄️ Database Schema

```mermaid
erDiagram
    User ||--o| PatientProfile : has
    User ||--o| PatientMedicalHistory : has
    User ||--o{ Prescription : "creates (doctor)"
    User ||--o{ Prescription : "receives (patient)"
    User ||--o{ AdherenceLog : logs
    User ||--o{ Alert : "receives (as doctor)"
    User ||--o{ Alert : "receives (as patient)"
    MajorDoctorTable ||--o{ User : categorizes

    Prescription ||--|{ PrescriptionItem : contains
    Prescription ||--o{ AdherenceLog : tracks
    Prescription ||--o{ Alert : triggers

    PrescriptionItem }o--|| Medication : references
    PrescriptionItem ||--o{ AdherenceLog : logs

    User {
        uuid id PK
        string phoneNumber UK
        string password
        string fullName
        enum role "ADMIN | DOCTOR | PATIENT"
        enum status "ACTIVE | INACTIVE | BLOCKED"
    }

    Prescription {
        uuid id PK
        uuid patientId FK
        uuid doctorId FK
        enum status "ACTIVE | COMPLETED | CANCELLED"
        datetime startDate
        datetime endDate
    }

    PrescriptionItem {
        uuid id PK
        string dosage
        int frequencyPerDay
        string[] timesOfDay
        int durationDays
    }

    AdherenceLog {
        uuid id PK
        datetime takenAt
        enum status "TAKEN | MISSED | SKIPPED"
    }

    Medication {
        uuid id PK
        string name
        string strength
        string form
    }

    Alert {
        uuid id PK
        enum type "MISSED_DOSE | LOW_ADHERENCE | OTHER"
        string message
        boolean resolved
    }
```

---

## 📁 Project Structure

```
medical_CDIO4/
├── 📄 docker-compose.yml              # Docker orchestration (3 services)
├── 📄 docker-compose-production.yml    # Production deployment config
├── 📄 docker-compose.dev.yml          # Development overrides
│
├── 🔧 medical_management_be/          # ── Backend (NestJS + Fastify) ──
│   ├── prisma/
│   │   ├── schema.prisma              # Database schema (8 models)
│   │   ├── migrations/                # SQL migration files
│   │   └── seed.ts                    # Sample data seeding script
│   ├── src/
│   │   ├── main.ts                    # App bootstrap (Fastify adapter)
│   │   ├── core/                      # Core infrastructure
│   │   │   ├── auth/                  # JWT, Passport, Guards, Strategies
│   │   │   ├── configs/               # App configuration
│   │   │   ├── database/              # Prisma service
│   │   │   ├── errors/                # Custom error handling
│   │   │   └── logger/                # Logging service
│   │   ├── modules/                   # Feature modules
│   │   │   ├── doctor/                # Doctor-specific APIs
│   │   │   ├── patient/               # Patient-specific APIs
│   │   │   ├── prescriptions/         # Prescription CRUD
│   │   │   ├── medications/           # Medication catalog
│   │   │   ├── notifications/         # WebSocket gateway + alerts
│   │   │   ├── users/                 # User management
│   │   │   ├── reports/               # Analytics & reports
│   │   │   └── major/                 # Medical specialties
│   │   ├── common/                    # Decorators, interceptors, pipes
│   │   └── utils/                     # Shared utilities
│   ├── scripts/                       # DB seed & verification scripts
│   ├── Dockerfile                     # Multi-stage production build
│   └── package.json
│
├── 🎨 medical_management_fe/          # ── Frontend (React 19 + Vite) ──
│   ├── src/
│   │   ├── main.tsx                   # App entry point
│   │   ├── api/                       # Axios client & API modules
│   │   ├── components/                # React components
│   │   │   ├── ui/                    # 32 base UI components (Radix)
│   │   │   ├── layout/                # App shell & navigation
│   │   │   ├── dialogs/               # Modal dialogs
│   │   │   ├── data-table/            # Reusable data table
│   │   │   └── dashboard/             # Dashboard widgets
│   │   ├── screen/                    # 20 page components
│   │   │   ├── Login.tsx / SignUp.tsx  # Authentication
│   │   │   ├── DashboardHomepage.tsx   # Main dashboard
│   │   │   ├── DoctorPatientsPage.tsx  # Doctor → patient management
│   │   │   ├── PatientPage.tsx         # Patient portal
│   │   │   ├── VideoCall.tsx           # Video consultation
│   │   │   └── ...                    # And more
│   │   ├── hooks/                     # Custom React hooks
│   │   ├── router/                    # React Router config
│   │   ├── schemas/                   # Zod validation schemas
│   │   ├── types/                     # TypeScript type definitions
│   │   └── providers/                 # Context providers
│   ├── Dockerfile                     # Multi-stage build → Nginx
│   ├── nginx.conf                     # Nginx SPA configuration
│   └── package.json
│
└── 📚 documents/                      # ── UML & Documentation ──
    ├── uml-diagrams/                  # 7 UML diagram types
    │   ├── 00-Use-Case-Diagram.md
    │   ├── 01-Class-Diagram.md
    │   ├── 02-Sequence-Diagrams.md
    │   ├── 03-Activity-Diagrams.md
    │   ├── 04-State-Machine-Diagrams.md
    │   ├── 05-Component-Diagrams.md
    │   └── 06-System-Overview.md
    └── use-cases/                     # Detailed use case specifications
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v20+
- **Yarn** v1.22+
- **PostgreSQL** 16+ (or use Docker)
- **Redis** (required for BullMQ background jobs)

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/<your-username>/meditrack-medical-management.git
cd meditrack-medical-management
```

### 2️⃣ Backend Setup

```bash
cd medical_management_be

# Install dependencies
yarn install

# Configure environment
cp .env.example .env
# Edit .env with your database credentials and secrets

# Generate Prisma client
yarn prisma:generate

# Run database migrations
yarn prisma:migrate

# (Optional) Seed sample data
yarn db:seed

# Start development server
yarn dev
```

Backend runs at: `http://localhost:9900`

### 3️⃣ Frontend Setup

```bash
cd medical_management_fe

# Install dependencies
yarn install

# Configure environment
cp .env.example .env
# Set VITE_API_URL=http://localhost:9900

# Start development server
yarn dev
```

Frontend runs at: `http://localhost:5173` (Vite default)

### 4️⃣ Access the Application

| Service | URL |
|---|---|
| Frontend | `http://localhost:5173` |
| Backend API | `http://localhost:9900/api` |
| Prisma Studio | Run `yarn prisma:studio` → `http://localhost:5555` |

---

## 🐳 Docker Deployment

### Quick Start (Recommended)

```bash
# Clone and deploy with a single command
docker compose up -d --build
```

This spins up **3 containers**:

| Service | Container | Port | Image |
|---|---|---|---|
| PostgreSQL | `medical-postgres` | `5432` | `postgres:16` |
| Backend | `medical-backend` | `9900` | Node.js 20 Alpine |
| Frontend | `medical-frontend` | `9901` | Nginx Alpine |

### Production Deployment

```bash
docker compose -f docker-compose-production.yml up -d --build
```

### Health Check

```bash
# Check all services are running
docker compose ps

# View backend logs
docker compose logs -f backend

# Access PostgreSQL
docker compose exec postgres psql -U postgres -d medical_management
```

---

## 📡 API Documentation

### Base URL

```
http://localhost:9900/api
```

### Authentication

All protected endpoints require a Bearer token:

```
Authorization: Bearer <access_token>
```

### Endpoint Overview

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/auth/login` | Login with phone + password | Public |
| `POST` | `/auth/register` | Register new account | Public |
| `POST` | `/auth/logout` | Logout & invalidate token | Required |
| `GET` | `/auth/me` | Get current user info | Required |
| `GET` | `/users/profile` | Get user profile | Required |
| `PUT` | `/users/profile` | Update user profile | Required |
| `GET` | `/prescriptions` | List prescriptions | Required |
| `POST` | `/prescriptions` | Create new prescription | Doctor |
| `GET` | `/prescriptions/:id` | Get prescription details | Required |
| `PATCH` | `/prescriptions/:id` | Update prescription | Doctor |
| `GET` | `/doctor/patients` | List doctor's patients | Doctor |
| `GET` | `/doctor/adherence` | Get adherence reports | Doctor |
| `GET` | `/patient/prescriptions` | Patient's prescriptions | Patient |
| `GET` | `/patient/schedule` | Medication schedule | Patient |
| `GET` | `/notifications/doctor` | Doctor notifications | Doctor |
| `GET` | `/notifications/patient` | Patient notifications | Patient |
| `POST` | `/notifications/send-reminder` | Send medication reminder | Doctor |

### WebSocket Events

| Event | Direction | Description |
|---|---|---|
| `join-room` | Client → Server | Join notification room |
| `leave-room` | Client → Server | Leave notification room |
| `medication-reminder` | Server → Client | Medication reminder alert |
| `adherence-alert` | Server → Client | Adherence status alert |

---

## ⚙️ Environment Variables

### Backend (`.env`)

```env
# Database
DATABASE_URL=postgresql://postgres:postgres123@localhost:5432/medical_management?schema=public

# Server
NODE_ENV=development
PORT=9900
FRONTEND_URL=http://localhost:5173

# JWT Secrets (⚠️ Change in production!)
JWT_ACCESS_TOKEN_SECRET_KEY=your-access-token-secret
JWT_REFRESH_TOKEN_SECRET_KEY=your-refresh-token-secret
JWT_VERIFY_TOKEN_SECRET_KEY=your-verify-token-secret

# Token Expiration
JWT_ACCESS_TOKEN_EXPIRATION_TIME=15m
JWT_REFRESH_TOKEN_EXPIRATION_TIME=7d
JWT_VERIFY_TOKEN_EXPIRATION_TIME=24h

# Cookie
COOKIE_SECRET=your-cookie-secret

# External Services (Optional)
RESEND_API_KEY=your-resend-api-key
OPENAI_API_KEY=your-openai-api-key
GOOGLE_AI_API_KEY=your-google-ai-key
```

### Frontend (`.env`)

```env
VITE_API_URL=http://localhost:9900
VITE_BACKEND_URL=http://localhost:9900
```

---

## 📜 Scripts Reference

### Backend

| Command | Description |
|---|---|
| `yarn dev` | Start dev server with hot-reload |
| `yarn build` | Build for production |
| `yarn start:prod` | Run production build |
| `yarn prisma:generate` | Generate Prisma client |
| `yarn prisma:migrate` | Run database migrations |
| `yarn prisma:studio` | Open Prisma Studio GUI |
| `yarn db:seed` | Seed database with sample data |
| `yarn test` | Run unit tests |
| `yarn test:e2e` | Run end-to-end tests |
| `yarn lint` | Lint & fix code |

### Frontend

| Command | Description |
|---|---|
| `yarn dev` | Start Vite dev server |
| `yarn build` | Build production bundle |
| `yarn preview` | Preview production build |
| `yarn lint` | Lint code |

---

## 📐 UML Documentation

The project includes comprehensive UML documentation in `documents/uml-diagrams/`:

| Diagram | File | Description |
|---|---|---|
| Use Case | `00-Use-Case-Diagram.md` | System actors and interactions |
| Class | `01-Class-Diagram.md` | Domain model & relationships |
| Sequence | `02-Sequence-Diagrams.md` | Key workflow interactions |
| Activity | `03-Activity-Diagrams.md` | Process flow diagrams |
| State Machine | `04-State-Machine-Diagrams.md` | Entity state transitions |
| Component | `05-Component-Diagrams.md` | System component architecture |
| System Overview | `06-System-Overview.md` | High-level architecture overview |

---

## 🔐 Security

- **Password Hashing** — bcrypt with configurable salt rounds
- **JWT Tokens** — Short-lived access tokens (15m) with refresh rotation (7d)
- **HTTP-only Cookies** — XSS-resistant token storage
- **Helmet** — Security headers (HSTS, CSP, X-Frame-Options)
- **CORS** — Configurable origin restrictions
- **Input Validation** — DTO validation via class-validator + Zod schemas
- **SQL Injection Prevention** — Parameterized queries through Prisma ORM
- **IP Whitelisting** — Optional middleware for access restriction
- **Soft Delete** — Data recovery support via Prisma extension

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add patient adherence dashboard
fix: resolve prescription date validation
docs: update API endpoint documentation
refactor: optimize database queries for reports
```

---

## 📄 License

This project is developed as part of the **CDIO 4** capstone project.

---

<p align="center">
  Built with ❤️ using <strong>NestJS</strong>, <strong>React</strong>, and <strong>TypeScript</strong>
</p>
