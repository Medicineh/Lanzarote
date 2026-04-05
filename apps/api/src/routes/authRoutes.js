import { Router } from 'express';
import { login, loginWithGoogle, logout, refresh, register } from '../controllers/authController.js';
import { requireAuth, requireRefreshAuth } from '../middlewares/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', loginWithGoogle);
router.post('/refresh', requireRefreshAuth, refresh);
router.post('/logout', requireAuth, logout);

export default router;
