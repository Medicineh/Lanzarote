import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../models/User.js';
import { AuditLog } from '../models/AuditLog.js';
import { googleLoginSchema, loginSchema, registerSchema } from '../validators/authValidators.js';
import { issueRefreshToken, rotateRefreshToken, signAccessToken } from '../services/tokenService.js';
import { verifyGoogleIdToken } from '../services/googleAuthService.js';

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  path: '/'
};

function setAuthCookies(res, accessToken, refreshToken) {
  res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
  res.cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
}

export async function register(req, res) {
  const payload = await registerSchema.validateAsync(req.body);
  const exists = await User.findOne({ email: payload.email.toLowerCase() });
  if (exists) return res.status(409).json({ error: 'Email ya registrado' });

  const passwordHash = await bcrypt.hash(payload.password, 12);
  const user = await User.create({
    name: payload.name,
    email: payload.email.toLowerCase(),
    passwordHash,
    affiliateCode: uuidv4().slice(0, 8),
    referredBy: payload.affiliateCode,
    tenantId: req.tenant.slug
  });

  await AuditLog.create({ userId: user.id, tenantId: user.tenantId, action: 'auth.register' });
  res.status(201).json({ id: user.id, email: user.email });
}

export async function login(req, res) {
  const payload = await loginSchema.validateAsync(req.body);
  const user = await User.findOne({ email: payload.email.toLowerCase(), tenantId: req.tenant.slug });
  if (!user?.passwordHash) return res.status(401).json({ error: 'Credenciales inválidas' });

  const ok = await bcrypt.compare(payload.password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Credenciales inválidas' });

  const accessToken = signAccessToken(user);
  const refreshToken = await issueRefreshToken(user, { userAgent: req.headers['user-agent'], ip: req.ip });

  setAuthCookies(res, accessToken, refreshToken);
  await AuditLog.create({ userId: user.id, tenantId: user.tenantId, action: 'auth.login' });
  res.json({ user: { id: user.id, email: user.email, role: user.role, plan: user.plan } });
}

export async function loginWithGoogle(req, res) {
  const { idToken } = await googleLoginSchema.validateAsync(req.body);
  const profile = await verifyGoogleIdToken(idToken);

  const user = await User.findOneAndUpdate(
    { email: profile.email.toLowerCase(), tenantId: req.tenant.slug },
    {
      $setOnInsert: {
        email: profile.email.toLowerCase(),
        name: profile.name,
        affiliateCode: uuidv4().slice(0, 8),
        tenantId: req.tenant.slug
      },
      $set: { googleId: profile.googleId }
    },
    { upsert: true, new: true }
  );

  const accessToken = signAccessToken(user);
  const refreshToken = await issueRefreshToken(user, { userAgent: req.headers['user-agent'], ip: req.ip });
  setAuthCookies(res, accessToken, refreshToken);

  await AuditLog.create({ userId: user.id, tenantId: user.tenantId, action: 'auth.google_login' });
  res.json({ user: { id: user.id, email: user.email, role: user.role, plan: user.plan } });
}

export async function refresh(req, res) {
  const current = req.cookies?.refreshToken;
  if (!current) return res.status(401).json({ error: 'Refresh token faltante' });

  const user = req.user;
  const nextRefresh = await rotateRefreshToken(current, user, { userAgent: req.headers['user-agent'], ip: req.ip });
  const accessToken = signAccessToken(user);

  setAuthCookies(res, accessToken, nextRefresh);
  res.json({ ok: true });
}

export async function logout(req, res) {
  await User.findByIdAndUpdate(req.user.id, { $inc: { tokenVersion: 1 } });
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  await AuditLog.create({ userId: req.user.id, tenantId: req.user.tenantId, action: 'auth.logout' });
  res.json({ ok: true });
}
