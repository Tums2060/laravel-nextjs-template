# Laravel API Template (Sanctum SPA Auth)

This backend is preconfigured for a Next.js frontend using cookie-based authentication with Laravel Sanctum.

## Quick Start

1. Copy environment file and install dependencies.

```bash
cp .env.example .env
composer install
php artisan key:generate
```

2. Configure database in `.env`, then run migrations.

```bash
php artisan migrate
```

3. Start backend server.

```bash
php artisan serve
```

By default, backend runs on `http://localhost:8000`.

## Frontend Connectivity Defaults

The template is configured for Next.js on `http://localhost:3000`.

- `FRONTEND_URLS=http://localhost:3000`
- `SANCTUM_STATEFUL_DOMAINS=localhost:3000,127.0.0.1:3000,localhost:8000,127.0.0.1:8000`
- CORS credentials support is enabled.

If you change hosts/ports, update those env vars.

## API Endpoints

All routes return JSON.

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/user` (auth required)
- `POST /api/auth/logout` (auth required)

Sanctum CSRF endpoint:

- `GET /sanctum/csrf-cookie`

## Notes

- Authentication guard uses session cookies (`web` + Sanctum stateful API middleware).
- Protected API routes use `auth:sanctum`.
