# Deployment Readiness Guide

**Application**: Full-Stack Blog Platform with Comments  
**Stack**: React 19 + TypeScript + Vite | Node.js + Express + Prisma ORM + PostgreSQL  
**Repository**: [https://github.com/AshwinKirbaa/Blog-Platform](https://github.com/AshwinKirbaa/Blog-Platform)  

---

## 1. Architecture & Hosting Strategy

The application is structured for independent frontend and backend deployment. Free-tier friendly options include:

| Layer | Recommended Free Tier Host | Alternatives |
|---|---|---|
| **Database** | **Neon** (Serverless PostgreSQL) | Supabase, Render PostgreSQL |
| **Backend API** | **Render** (Web Service free tier) | Railway, Fly.io |
| **Frontend** | **Vercel** / **Netlify** | Cloudflare Pages, GitHub Pages |

---

## 2. Environment Variables Configuration

### Backend (`backend/.env`)
```bash
# Database connection string (PostgreSQL with SSL enabled in production)
DATABASE_URL="postgresql://<user>:<password>@<host>:<port>/<dbname>?sslmode=require"

# Server Port
PORT=5000

# Strong Random 256-bit JWT Secret Key
JWT_SECRET="generate-a-strong-random-secret-key-for-production-min-32-chars"
JWT_EXPIRES_IN="7d"

# Allowed Frontend Origins (comma separated or exact production origin)
CORS_ORIGIN="https://your-frontend-app.vercel.app"

# Node Environment
NODE_ENV="production"
```

### Frontend (`frontend/.env`)
```bash
# Production Backend REST API Base URL
VITE_API_BASE_URL="https://your-backend-service.onrender.com/api"
```

---

## 3. Step-by-Step Deployment Guide

### Step 1: Database Setup (Neon PostgreSQL)
1. Sign up at [neon.tech](https://neon.tech) and create a new project `blogdb`.
2. Copy the PostgreSQL connection string (`postgresql://...`).

### Step 2: Backend Deployment (Render)
1. Create a new **Web Service** on [Render](https://render.com) connected to your GitHub repository.
2. Configure settings:
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npm start`
3. Add Environment Variables:
   - `DATABASE_URL`: *(Neon connection string)*
   - `JWT_SECRET`: *(Strong secret)*
   - `CORS_ORIGIN`: *(Frontend URL from Step 3)*
   - `NODE_ENV`: `production`
4. Run Database Migrations:
   - In Render Shell or locally targeting production DB:
     ```bash
     npx prisma migrate deploy
     ```

### Step 3: Frontend Deployment (Vercel)
1. Sign in to [Vercel](https://vercel.com) and import the repository.
2. Configure settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Add Environment Variable:
   - `VITE_API_BASE_URL`: `https://<your-render-backend>.onrender.com/api`
4. Deploy.

---

## 4. Production Health Verification

Once deployed, verify:
- Backend Health Check: `GET https://your-backend.onrender.com/api/health` -> HTTP 200 `{ status: "ok" }`
- Registration & Login Flow on live frontend
- Creation and viewing of published blog posts
