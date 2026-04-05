import { Queue } from 'bullmq';
import { redis } from '../config/redis.js';

export const alertQueue = new Queue('alert-evaluation', { connection: redis });

export async function enqueueAlertEvaluation(alertId) {
  await alertQueue.add('evaluate-alert', { alertId }, { removeOnComplete: 200, attempts: 3, backoff: { type: 'exponential', delay: 2000 } });
}
