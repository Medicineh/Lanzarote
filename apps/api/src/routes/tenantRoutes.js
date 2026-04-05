import { Router } from 'express';
import { getTenantTheme, upsertTenant } from '../controllers/tenantController.js';
import { requireAuth, requireRole } from '../middlewares/auth.js';

const router = Router();

router.get('/theme', getTenantTheme);
router.put('/', requireAuth, requireRole('admin'), upsertTenant);

export default router;
