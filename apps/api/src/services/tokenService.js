import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { env } from '../config/env.js';
import { RefreshToken } from '../models/RefreshToken.js';

export function signAccessToken(user) {
  return jwt.sign({ sub: user.id, role: user.role, plan: user.plan, tenantId: user.tenantId }, env.jwtAccessSecret, {
    expiresIn: env.accessTokenTTL
  });
}

export async function issueRefreshToken(user, ctx = {}) {
  const tokenId = uuidv4();
  const refreshToken = jwt.sign({ sub: user.id, tv: user.tokenVersion, jti: tokenId }, env.jwtRefreshSecret, {
    expiresIn: env.refreshTokenTTL
  });

  const decoded = jwt.decode(refreshToken);
  await RefreshToken.create({
    userId: user.id,
    tokenId,
    expiresAt: new Date(decoded.exp * 1000),
    userAgent: ctx.userAgent,
    ip: ctx.ip
  });

  return refreshToken;
}

export async function rotateRefreshToken(token, user, ctx = {}) {
  const payload = jwt.verify(token, env.jwtRefreshSecret);
  const current = await RefreshToken.findOne({ tokenId: payload.jti, userId: user.id, revokedAt: null });
  if (!current) throw new Error('Refresh token invalidado');

  const next = await issueRefreshToken(user, ctx);
  const nextPayload = jwt.decode(next);

  current.revokedAt = new Date();
  current.replacedByTokenId = nextPayload.jti;
  await current.save();

  return next;
}
