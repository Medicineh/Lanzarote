import Stripe from 'stripe';
import { env } from '../config/env.js';

export const stripe = new Stripe(env.stripeSecretKey);

export async function createCheckoutSession({ customerEmail, priceId, userId }) {
  return stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${env.appUrl}/dashboard/billing?status=success`,
    cancel_url: `${env.appUrl}/dashboard/billing?status=cancel`,
    customer_email: customerEmail,
    metadata: { userId }
  });
}
