import dotenv from 'dotenv';

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 4000),
  mongoUri: process.env.MONGODB_URI,
  redisUrl: process.env.REDIS_URL,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  accessTokenTTL: process.env.ACCESS_TOKEN_TTL ?? '15m',
  refreshTokenTTL: process.env.REFRESH_TOKEN_TTL ?? '7d',
  cookieDomain: process.env.COOKIE_DOMAIN ?? 'localhost',
  corsOrigins: (process.env.CORS_ORIGINS ?? '').split(',').filter(Boolean),
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  appUrl: process.env.APP_URL,
  encryptionKey: process.env.ENCRYPTION_KEY,
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN,
  smtp: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 1025),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.FROM_EMAIL ?? 'no-reply@example.com'
  }
};
