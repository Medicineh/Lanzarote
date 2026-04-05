import * as Sentry from '@sentry/node';
import { env } from './env.js';

export function setupSentry(app) {
  if (!env.sentryDsn) return;
  Sentry.init({
    dsn: env.sentryDsn,
    environment: env.nodeEnv,
    tracesSampleRate: 0.2
  });

  app.use(Sentry.Handlers.requestHandler());
}

export function sentryErrorHandler() {
  return Sentry.Handlers.errorHandler();
}
