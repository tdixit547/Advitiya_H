# Smart Link Hub - Monorepo

A dynamic link routing system with Next.js frontend and Express backend.

## 📁 Structure

```
apps/
├── frontend/    # Next.js app (port 3000)
└── backend/     # Express API (port 3001)
```

## 🚀 Quick Start

```bash
# Install all dependencies
npm install

# Start frontend only
npm run dev:frontend

# Start backend only
npm run dev:backend
```

## 📡 API Server (Backend)

- `http://localhost:3001/:slug` - Redirect endpoint
- `http://localhost:3001/:slug/debug` - Debug resolution
- `http://localhost:3001/api/admin/*` - Admin endpoints

## 🎨 Frontend

- `http://localhost:3000` - Home page
- `http://localhost:3000/login` - Login
- `http://localhost:3000/dashboard` - Admin dashboard

## 📋 Requirements

- Node.js 18+
- MongoDB
- Redis

## 🔧 Environment Setup

```bash
# Backend environment
cp apps/backend/.env.example apps/backend/.env
# Edit with your MongoDB and Redis credentials
```
