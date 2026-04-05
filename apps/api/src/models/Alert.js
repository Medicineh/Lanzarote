import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    tenantId: { type: String, index: true },
    type: {
      type: String,
      enum: ['weather', 'fx', 'crypto', 'stocks', 'news', 'emergency'],
      required: true
    },
    name: { type: String, required: true },
    config: { type: mongoose.Schema.Types.Mixed, required: true },
    threshold: { type: Number },
    active: { type: Boolean, default: true },
    lastTriggerHash: String,
    lastTriggeredAt: Date
  },
  { timestamps: true }
);

alertSchema.index({ userId: 1, name: 1 }, { unique: true });

export const Alert = mongoose.model('Alert', alertSchema);
