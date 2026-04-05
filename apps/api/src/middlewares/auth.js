import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/User.js';

export async function requireAuth(req, res, next) {
  try {
    const bearer = req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : null;
    const token = req.cookies?.accessToken ?? bearer;
    if (!token) return res.status(401).json({ error: 'No autenticado' });

    const payload = jwt.verify(token, env.jwtAccessSecret);
    const user = await User.findById(payload.sub);
    if (!user) return res.status(401).json({ error: 'Usuario inválido' });

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido' });
  }
}

export async function requireRefreshAuth(req, res, next) {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) return res.status(401).json({ error: 'Refresh token faltante' });

    const payload = jwt.verify(token, env.jwtRefreshSecret);
    const user = await User.findById(payload.sub);
    if (!user || user.tokenVersion !== payload.tv) {
      return res.status(401).json({ error: 'Refresh token inválido' });
    }

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ error: 'Refresh token inválido' });
  }
}

export function requireRole(role) {
  return (req, res, next) => {
    if (req.user?.role !== role) return res.status(403).json({ error: 'Sin permisos' });
    next();
  };
}
