import { Router } from 'express';
import { createAlert, deleteAlert, listAlerts, updateAlert } from '../controllers/alertsController.js';
import { ensurePlan } from '../middlewares/plan.js';

const router = Router();

router.get('/', listAlerts);
router.post('/', ensurePlan('alerts'), createAlert);
router.patch('/:id', updateAlert);
router.delete('/:id', deleteAlert);

export default router;
