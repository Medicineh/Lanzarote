import { Router } from 'express';
import { me, updateTelegram } from '../controllers/userController.js';

const router = Router();

router.get('/me', me);
router.put('/telegram', updateTelegram);

export default router;
