import crypto from 'crypto';
import { env } from '../config/env.js';

const key = Buffer.from(env.encryptionKey, 'utf8');

export function encrypt(value) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const enc = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString('hex')}.${tag.toString('hex')}.${enc.toString('hex')}`;
}

export function decrypt(payload) {
  const [ivHex, tagHex, dataHex] = payload.split('.');
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(ivHex, 'hex'));
  decipher.setAuthTag(Buffer.from(tagHex, 'hex'));
  const dec = Buffer.concat([decipher.update(Buffer.from(dataHex, 'hex')), decipher.final()]);
  return dec.toString('utf8');
}

export function hashEvent(value) {
  return crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
}
