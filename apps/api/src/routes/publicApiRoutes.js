import { Router } from 'express';
import rateLimit from 'express-rate-limit';

const router = Router();

router.use(rateLimit({ windowMs: 60_000, limit: 30 }));
router.get('/alerts/summary', async (req, res) => {
  res.json({ activeUsers: 0, alertsSent24h: 0, conversionFreeToPro: 0 });
});

export default router;
