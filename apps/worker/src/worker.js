import { Worker } from 'bullmq';
import Redis from 'ioredis';
import mongoose from 'mongoose';
import crypto from 'crypto';

const redis = new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379', { maxRetriesPerRequest: null });
await mongoose.connect(process.env.MONGODB_URI ?? 'mongodb://localhost:27017/lanzarote');

const alertSchema = new mongoose.Schema({
  type: String,
  config: mongoose.Schema.Types.Mixed,
  threshold: Number,
  active: Boolean,
  lastTriggerHash: String,
  lastTriggeredAt: Date
});
const Alert = mongoose.model('Alert', alertSchema);

function eventHash(payload) {
  return crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex');
}

new Worker(
  'alert-evaluation',
  async (job) => {
    const alert = await Alert.findById(job.data.alertId);
    if (!alert || !alert.active) return;

    const fakeData = { source: alert.type, value: Math.random() * 100, ts: new Date().toISOString() };
    const h = eventHash(fakeData);

    if (h === alert.lastTriggerHash) return;
    alert.lastTriggerHash = h;
    alert.lastTriggeredAt = new Date();
    await alert.save();

    // aquí publicarías en Telegram, email o web push
  },
  { connection: redis, concurrency: 10 }
);

console.log('Worker iniciado');
