# Lanzarote Alerts SaaS

Plataforma SaaS de alertas inteligentes 24/7 con arquitectura escalable y segura.

## Estado actual (incluye mejoras solicitadas)
- ✅ Google OAuth (Google Identity ID token verification en backend).
- ✅ Web Push provider + Service Worker PWA.
- ✅ Sentry instrumentation + métricas Prometheus (`/api/v1/metrics`).
- ✅ Tests de integración con MongoMemoryServer.
- ✅ White-label multi-tenant avanzado por dominio + tema dinámico.

## Stack
- Backend: Express + MongoDB + Redis + BullMQ + Socket.IO
- Frontend: Next.js (App Router)
- Seguridad: JWT rotación, CSRF, Helmet, sanitización, rate limits
- Pagos: Stripe Checkout + webhook firmado

## Estructura
```
apps/api     API REST, auth, seguridad, Stripe, Push, multi-tenant
apps/web     Dashboard, PWA, registro SW, theming por tenant
apps/worker  BullMQ worker
```

## Endpoints clave
- `/api/v1/auth/google` login Google Identity con `idToken`.
- `/api/v1/push/vapid-public-key`, `/api/v1/push/subscribe`.
- `/api/v1/tenant/theme` tema por dominio.
- `/api/v1/metrics` métricas Prometheus.
- `/api/v1/health` healthcheck.

## Telegram
1. Crea bot con **@BotFather** (`/newbot`).
2. Obtén `botToken`.
3. Envía mensaje a tu bot.
4. Consulta `https://api.telegram.org/bot<BOT_TOKEN>/getUpdates`.
5. Toma `chat.id` y guárdalo en Settings.

## Desarrollo
```bash
npm install
npm run dev
```

## Tests
```bash
npm run test
```
