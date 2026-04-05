import webpush from 'web-push';
import { env } from '../config/env.js';

if (env.vapidPublicKey && env.vapidPrivateKey && env.vapidSubject) {
  webpush.setVapidDetails(env.vapidSubject, env.vapidPublicKey, env.vapidPrivateKey);
}

export function getPublicVapidKey() {
  return env.vapidPublicKey;
}

export async function sendWebPush(subscription, payload) {
  return webpush.sendNotification(subscription, JSON.stringify(payload));
}
