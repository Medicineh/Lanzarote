import { Router } from 'express';
import { getVapidKey, saveSubscription, sendTestPush } from '../controllers/pushController.js';
import { requireAuth } from '../middlewares/auth.js';

const router = Router();

router.get('/vapid-public-key', getVapidKey);
router.post('/subscribe', requireAuth, saveSubscription);
router.post('/test', requireAuth, sendTestPush);

export default router;
