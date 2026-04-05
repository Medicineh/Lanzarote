import { z } from 'zod';
import { ALERT_TYPES } from '../constants/alertTypes.js';

export const alertSchema = z.object({
  type: z.enum(ALERT_TYPES),
  name: z.string().min(2).max(120),
  config: z.record(z.any()),
  threshold: z.number().optional(),
  active: z.boolean().default(true)
});
