import { OAuth2Client } from 'google-auth-library';
import { env } from '../config/env.js';

const client = new OAuth2Client(env.googleClientId);

export async function verifyGoogleIdToken(idToken) {
  const ticket = await client.verifyIdToken({ idToken, audience: env.googleClientId });
  const payload = ticket.getPayload();
  if (!payload?.email_verified) {
    throw new Error('Google email no verificado');
  }

  return {
    googleId: payload.sub,
    email: payload.email,
    name: payload.name || payload.email.split('@')[0]
  };
}
