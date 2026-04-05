import mongoose from 'mongoose';

const pushSubscriptionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    endpoint: { type: String, required: true },
    keys: {
      p256dh: String,
      auth: String
    },
    tenantId: String
  },
  { timestamps: true }
);

pushSubscriptionSchema.index({ userId: 1, endpoint: 1 }, { unique: true });

export const PushSubscription = mongoose.model('PushSubscription', pushSubscriptionSchema);
