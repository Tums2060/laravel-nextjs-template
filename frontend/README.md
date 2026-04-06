# Next.js Frontend Template

This frontend is wired to a Laravel backend using Sanctum cookie authentication.

## Quick Start

1. Copy environment file.

```bash
cp .env.example .env.local
```

2. Install dependencies and run dev server.

```bash
npm install
npm run dev
```

3. Open `http://localhost:3000`.

## Required Backend

Run Laravel backend on `http://localhost:8000` unless you change `NEXT_PUBLIC_API_URL`.

Default env value:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Included Auth Smoke Test Page

The homepage contains:

- Register form
- Login form
- Current authenticated user fetch
- Logout action

Flow used by the frontend:

1. Request `GET /sanctum/csrf-cookie`
2. Call auth API endpoints with `credentials: include`
3. Read session user from `GET /api/auth/user`
