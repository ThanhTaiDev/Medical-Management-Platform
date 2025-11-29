# Development Workflow

This document describes the development workflow for the Medical Management System.

## Overview

- **Docker** is used **ONLY** for PostgreSQL database
- **Backend** runs locally using `yarn start:dev` (NestJS watcher)
- **Frontend** runs locally using `yarn dev` (Vite hot reload)
- No Docker builds for backend/frontend during development
- No build cache during development

## Prerequisites

- Node.js (v18 or higher)
- Yarn package manager (or use npm as alternative)
- Docker and Docker Compose
- PostgreSQL client (optional, for direct database access)

### Installing Yarn

If you don't have Yarn installed, you can install it globally:

```bash
npm install -g yarn
```

Alternatively, you can use `npm` instead of `yarn` for all commands (replace `yarn` with `npm` in the instructions below).

## Development Setup

### 1. Start PostgreSQL Database

```bash
docker compose -f docker-compose.dev.yml up -d postgres
```

This will start PostgreSQL on port `5432` with:
- User: `postgres`
- Password: `postgres123`
- Database: `medical_management`

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd medical_management_be
```

Install dependencies:

```bash
yarn
```

Create a `.env` file (copy from `.env.example` if available):

```env
# Database Configuration
DATABASE_URL=postgresql://postgres:postgres123@localhost:5432/medical_management?schema=public

# Application Configuration
NODE_ENV=development
PORT=9900
FRONTEND_URL=http://localhost:9901

# JWT Configuration (generate secure random strings for production)
JWT_ACCESS_TOKEN_SECRET_KEY=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_TOKEN_SECRET_KEY=your-super-secret-refresh-key-change-in-production
JWT_VERIFY_TOKEN_SECRET_KEY=your-super-secret-verify-key-change-in-production
JWT_ACCESS_TOKEN_EXPIRATION_TIME=15m
JWT_REFRESH_TOKEN_EXPIRATION_TIME=7d
JWT_VERIFY_TOKEN_EXPIRATION_TIME=24h

# Cookie Configuration
COOKIE_SECRET=your-super-secret-cookie-key-change-in-production
```

**IMPORTANT: Generate Prisma Client first:**

```bash
yarn prisma:generate
# or: npx prisma generate
```

This step is **required** before starting the backend. The Prisma client must be generated from the schema to create TypeScript types.

Run database migrations (if needed):

```bash
yarn prisma:migrate
# or: npx prisma migrate dev
```

Start the backend in development mode:

```bash
yarn start:dev
```

The backend will run on `http://localhost:9900` with hot reload enabled.

### 3. Frontend Setup

Open a new terminal and navigate to the frontend directory:

```bash
cd medical_management_fe
```

Install dependencies:

```bash
yarn
```

Create a `.env` file (copy from `.env.example` if available):

```env
# Backend API URL
VITE_API_URL=http://localhost:9900
VITE_BACKEND_URL=http://localhost:9900
```

Start the frontend in development mode:

```bash
yarn dev
```

The frontend will run on `http://localhost:9901` with Vite hot reload enabled.

## Development Workflow Summary

```bash
# Terminal 1: Start PostgreSQL
docker compose -f docker-compose.dev.yml up -d postgres

# Terminal 2: Start Backend
cd medical_management_be
yarn start:dev

# Terminal 3: Start Frontend
cd medical_management_fe
yarn dev
```

## Port Configuration

- **PostgreSQL**: `5432`
- **Backend API**: `9900` (http://localhost:9900/api)
- **Frontend**: `9901` (http://localhost:9901)

## CORS Configuration

CORS is automatically configured for development:
- In development mode (`NODE_ENV=development`), all origins are allowed
- Frontend URL is configured via `FRONTEND_URL` environment variable

## Troubleshooting

### Backend can't connect to database

1. Ensure PostgreSQL is running: `docker compose -f docker-compose.dev.yml ps`
2. Check DATABASE_URL in `.env` file matches the PostgreSQL configuration
3. Verify PostgreSQL is accessible: `psql -h localhost -U postgres -d medical_management`

### Frontend can't connect to backend

1. Ensure backend is running on port 9900
2. Check `VITE_API_URL` in frontend `.env` file
3. Verify CORS is enabled in backend (should be automatic in development mode)

### Port already in use

If port 9900 or 9901 is already in use:
- Backend: Change `PORT` in `medical_management_be/.env`
- Frontend: Change port in `medical_management_fe/vite.config.ts` server.port

### Yarn command not found

If you get "yarn is not recognized" error:

**Option 1: Install Yarn globally**
```bash
npm install -g yarn
```

**Option 2: Use npm instead**
You can replace all `yarn` commands with `npm`:
- `yarn` → `npm install`
- `yarn start:dev` → `npm run start:dev`
- `yarn dev` → `npm run dev`
- `yarn prisma:generate` → `npm run prisma:generate`

## Production Deployment

For production, use the full docker-compose setup:

```bash
docker compose up -d
```

This will build and run all services (PostgreSQL, Backend, Frontend) in containers.

## Notes

- Database migrations should be run manually during development
- Hot reload is enabled for both backend and frontend
- No Docker builds are required during development
- Production Dockerfiles and docker-compose files are preserved for deployment

