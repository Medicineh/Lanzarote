# Lanzarote Alerts SaaS

Plataforma SaaS de alertas inteligentes 24/7, lista para producción, con arquitectura escalable, seguridad por defecto e integración con Telegram + Stripe.

## Stack
- **Backend**: Node.js + Express + MongoDB + Redis + BullMQ + Socket.IO
- **Frontend**: Next.js (App Router)
- **Auth**: JWT Access/Refresh, cookies httpOnly, base para Google OAuth
- **Billing**: Stripe Checkout + webhook firmado
- **Observabilidad**: Pino, audit logs, endpoint `/api/v1/health`
- **CI/CD**: GitHub Actions

## Estructura
```
.
├─ apps/
│  ├─ api/      # API REST / WebSocket / seguridad / Stripe / Telegram
│  ├─ web/      # Dashboard Next.js
│  └─ worker/   # Procesamiento en background (BullMQ)
├─ docs/
├─ docker-compose.yml
└─ .github/workflows/ci.yml
```

## Funcionalidades implementadas
- Multiusuario con aislamiento por `userId` y base para `tenantId`.
- Roles `user/admin`.
- CRUD de alertas con límites por plan (`free`, `pro`, `premium`).
- Integración Telegram (almacenando botToken cifrado AES-256-GCM).
- Refresh token rotation + invalidación real en logout.
- Protección XSS/NoSQLi (Helmet + sanitización + validación Joi/Zod).
- Stripe Checkout y webhook seguro con verificación de firma.
- Worker de evaluación con deduplicación hash de eventos.
- API pública versionada (`/api/v1/public`) con rate limit.
- Logs de auditoría: login, alertas, billing.

## Variables de entorno
1. Copia `apps/api/.env.example` a `apps/api/.env`.
2. Ajusta secretos (`JWT_*`, `ENCRYPTION_KEY`, `STRIPE_*`, etc).

## Desarrollo local
```bash
npm install
npm run dev
```
- Web: http://localhost:3000
- API: http://localhost:4000

## Docker
```bash
docker compose up --build
```

## Tests
```bash
npm run test
```

## Telegram: cómo obtener `botToken` y `chatId`
1. En Telegram abre **@BotFather**.
2. Ejecuta `/newbot` y sigue los pasos.
3. Copia el token entregado por BotFather (`botToken`).
4. Inicia chat con tu bot y envía un mensaje.
5. Abre: `https://api.telegram.org/bot<BOT_TOKEN>/getUpdates`
6. Busca `chat.id` en la respuesta JSON y úsalo como `chatId`.

## Stripe
- Endpoint webhook: `POST /api/v1/billing/webhook`
- Eventos manejados:
  - `checkout.session.completed` => `payment_success`
  - `customer.subscription.updated` => `subscription_updated`

## Pendientes recomendados para producción enterprise
- Completar login Google OAuth (Passport/Google Identity).
- Añadir proveedor de Web Push + service worker PWA.
- Instrumentación Sentry + métricas Prometheus.
- Expandir tests de integración con MongoMemoryServer.
- Afinar white-label avanzado por tenant (dominio y tema dinámico).
