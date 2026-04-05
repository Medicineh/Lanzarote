import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: String,
    name: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    googleId: String,
    plan: { type: String, enum: ['free', 'pro', 'premium'], default: 'free' },
    telegram: {
      botTokenEnc: String,
      chatId: String
    },
    tokenVersion: { type: Number, default: 0 },
    tenantId: { type: String, default: 'default' },
    affiliateCode: { type: String, unique: true, sparse: true },
    referredBy: String
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
