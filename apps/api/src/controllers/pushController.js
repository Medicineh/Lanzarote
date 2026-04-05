import { PushSubscription } from '../models/PushSubscription.js';
import { getPublicVapidKey, sendWebPush } from '../services/pushService.js';

export async function getVapidKey(req, res) {
  res.json({ publicKey: getPublicVapidKey() });
}

export async function saveSubscription(req, res) {
  const subscription = req.body;
  await PushSubscription.findOneAndUpdate(
    { userId: req.user.id, endpoint: subscription.endpoint },
    { ...subscription, userId: req.user.id, tenantId: req.user.tenantId },
    { upsert: true, new: true }
  );
  res.status(201).json({ ok: true });
}

export async function sendTestPush(req, res) {
  const subs = await PushSubscription.find({ userId: req.user.id });
  await Promise.all(
    subs.map((s) =>
      sendWebPush({ endpoint: s.endpoint, keys: s.keys }, { title: 'Test alert', body: 'Push funcionando correctamente' })
    )
  );
  res.json({ sent: subs.length });
}
