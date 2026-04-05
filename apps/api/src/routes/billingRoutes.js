import { Router } from 'express';
import express from 'express';
import { createCheckout, stripeWebhook } from '../controllers/billingController.js';
import { requireAuth } from '../middlewares/auth.js';

const router = Router();

router.post('/checkout', requireAuth, createCheckout);
router.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

export default router;
