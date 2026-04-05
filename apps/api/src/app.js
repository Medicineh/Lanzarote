import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import csrf from 'csurf';
import pinoHttp from 'pino-http';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import authRoutes from './routes/authRoutes.js';
import alertRoutes from './routes/alertRoutes.js';
import userRoutes from './routes/userRoutes.js';
import billingRoutes from './routes/billingRoutes.js';
import publicApiRoutes from './routes/publicApiRoutes.js';
import tenantRoutes from './routes/tenantRoutes.js';
import pushRoutes from './routes/pushRoutes.js';
import { env } from './config/env.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { requireAuth } from './middlewares/auth.js';
import { resolveTenant } from './middlewares/tenant.js';
import { metricsHandler, metricsMiddleware } from './config/metrics.js';
import { sentryErrorHandler, setupSentry } from './config/sentry.js';

export function buildApp() {
  const app = express();

  app.set('trust proxy', 1);
  setupSentry(app);
  app.use(pinoHttp());
  app.use(helmet());
  app.use(cors({ origin: env.corsOrigins, credentials: true }));
  app.use(cookieParser());
  app.use((req, res, next) => {
    if (req.originalUrl === '/api/v1/billing/webhook') return next();
    return express.json({ limit: '256kb' })(req, res, next);
  });
  app.use(mongoSanitize());
  app.use(rateLimit({ windowMs: 60_000, limit: 120 }));
  app.use(metricsMiddleware);
  app.use(resolveTenant);

  const csrfProtection = csrf({ cookie: true });

  app.get('/api/v1/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));
  app.get('/api/v1/metrics', metricsHandler);
  app.get('/api/v1/csrf-token', csrfProtection, (req, res) => res.json({ csrfToken: req.csrfToken() }));

  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/user', requireAuth, userRoutes);
  app.use('/api/v1/alerts', requireAuth, csrfProtection, alertRoutes);
  app.use('/api/v1/billing', billingRoutes);
  app.use('/api/v1/public', publicApiRoutes);
  app.use('/api/v1/push', pushRoutes);
  app.use('/api/v1/tenant', tenantRoutes);

  app.use(sentryErrorHandler());
  app.use(errorHandler);

  const httpServer = createServer(app);
  const io = new Server(httpServer, { cors: { origin: env.corsOrigins, credentials: true } });

  io.on('connection', (socket) => {
    socket.on('join-user-room', (userId) => socket.join(`user:${userId}`));
  });

  return { app, httpServer, io };
}
