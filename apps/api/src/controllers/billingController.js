import { createCheckoutSession, stripe } from '../services/stripeService.js';
import { User } from '../models/User.js';
import { env } from '../config/env.js';
import { AuditLog } from '../models/AuditLog.js';

const priceToPlan = {
  price_pro: 'pro',
  price_premium: 'premium'
};

export async function createCheckout(req, res) {
  const { priceId } = req.body;
  const session = await createCheckoutSession({ customerEmail: req.user.email, priceId, userId: req.user.id });
  res.json({ url: session.url });
}

export async function stripeWebhook(req, res) {
  const signature = req.headers['stripe-signature'];
  const event = stripe.webhooks.constructEvent(req.body, signature, env.stripeWebhookSecret);

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    await User.findByIdAndUpdate(session.metadata.userId, { plan: 'pro' });
    await AuditLog.create({ userId: session.metadata.userId, action: 'billing.payment_success' });
  }

  if (event.type === 'customer.subscription.updated') {
    const sub = event.data.object;
    const userId = sub.metadata?.userId;
    const item = sub.items?.data?.[0]?.price?.id;
    if (userId) {
      await User.findByIdAndUpdate(userId, { plan: priceToPlan[item] ?? 'free' });
      await AuditLog.create({ userId, action: 'billing.subscription_updated' });
    }
  }

  res.json({ received: true });
}
