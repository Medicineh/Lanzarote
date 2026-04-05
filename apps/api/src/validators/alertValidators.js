import { z } from 'zod';

export const alertSchema = z.object({
  type: z.enum(['weather', 'fx', 'crypto', 'stocks', 'news', 'emergency', 'moho', 'trips', 'mosca', 'larvas']),
  name: z.string().min(2).max(120),
  config: z.record(z.any()),
  threshold: z.number().optional(),
  active: z.boolean().default(true)
});
