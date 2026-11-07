# PingCheck

Uptime monitoring SaaS. Add a URL, and PingCheck checks it on a schedule, shows live status and
uptime stats, emails you when it goes down, and can publish a public status page.

**Live demo:** https://pingcheck-web.vercel.app **Example public status page:**
https://pingcheck-web.vercel.app/status/google **API docs (Swagger):**
https://pingcheck-api.onrender.com/api

> The API runs on a free Render instance, so the first request after idle can take up to a minute.

<!-- TODO: add 2-3 screenshots: dashboard, monitor details, status page -->

## Features

- JWT authentication (register / login), bcrypt password hashing
- Monitors CRUD with per-monitor check interval (1–60 min)
- Background scheduler that pings every monitor and stores response time and status
- Real-time status updates in the dashboard via WebSocket (Socket.io)
- Uptime % and incident counts for 24h / 7d / 30d, response time chart
- Email alerts on downtime and recovery (Resend), one alert per incident
- Public status page per monitor (`/status/:slug`), no login required
- Stripe Checkout subscription (test mode) with webhook-based plan activation

## Tech stack

| Layer        | Tech                                                                       |
| ------------ | -------------------------------------------------------------------------- |
| Frontend     | Next.js (App Router), TypeScript, Tailwind CSS, Recharts, Socket.io client |
| Backend      | NestJS, Prisma, Passport JWT, @nestjs/schedule, Socket.io, Swagger         |
| Database     | PostgreSQL (Supabase)                                                      |
| Integrations | Stripe, Resend                                                             |
| Hosting      | Vercel (web), Render (API), Supabase (DB)                                  |

## Architecture

```
Next.js (Vercel) --REST + WebSocket--> NestJS (Render) --Prisma--> PostgreSQL (Supabase)
                                          |-- Scheduler (cron, every minute)
                                          |-- Resend (email alerts)
                                          '-- Stripe (checkout + webhook)
```

## Run locally

Requirements: Node.js 20+, a PostgreSQL database.

```bash
# API
cd pingcheck-api
npm install
cp .env.example .env   # fill in the variables below
npx prisma migrate deploy
npm run start:dev      # http://localhost:4000, Swagger at /api

# Web
cd pingcheck-web
npm install
npm run dev            # http://localhost:3000
```

![CI](https://github.com/YUKIF69/pingcheck-web/actions/workflows/ci.yml/badge.svg)

## Tests

```bash
npm test
```

Unit tests cover the security-critical parts: SSRF protection (private/reserved addresses,
redirects), Free/Premium plan limits and monitor ownership. CI runs lint, build and tests on every
push.

### Environment variables

API (`pingcheck-api/.env`):

```
DATABASE_URL=
JWT_SECRET=
FRONTEND_URL=http://localhost:3000
RESEND_API_KEY=
RESEND_FROM=
STRIPE_SECRET_KEY=
STRIPE_PRICE_ID=
STRIPE_WEBHOOK_SECRET=
```

Web (`pingcheck-web/.env.local`):

```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

To test Stripe webhooks locally: `stripe listen --forward-to localhost:4000/stripe/webhook`

## API overview

| Method           | Path                            | Auth             |
| ---------------- | ------------------------------- | ---------------- |
| POST             | `/auth/register`, `/auth/login` | no               |
| GET/POST         | `/monitors`                     | yes              |
| GET/PATCH/DELETE | `/monitors/:id`                 | yes              |
| GET              | `/monitors/:id/stats`           | yes              |
| GET              | `/monitors/public/:slug`        | no               |
| GET              | `/users/subscription`           | yes              |
| POST             | `/stripe/checkout`              | yes              |
| POST             | `/stripe/webhook`               | Stripe signature |
| GET              | `/health`                       | no               |

## Security

See
[Security notes and known limitations](https://github.com/YUKIF69/pingcheck-api#security-notes-and-known-limitations)
in the API repository.

## Roadmap

- Edit / pause monitors, incident history
- Telegram and Slack notifications
- Per-owner email alerts (needs a verified sending domain)
- Full Stripe subscription lifecycle (cancellations, failed renewals)
- Aggregated stats and ping log retention
- Move auth tokens from `localStorage` to HttpOnly cookies
