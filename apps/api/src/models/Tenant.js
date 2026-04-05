import mongoose from 'mongoose';

const tenantSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    domain: { type: String, required: true, unique: true },
    branding: {
      logoUrl: String,
      primaryColor: { type: String, default: '#2563eb' },
      secondaryColor: { type: String, default: '#0f172a' },
      appName: { type: String, default: 'Lanzarote Alerts' }
    }
  },
  { timestamps: true }
);

export const Tenant = mongoose.model('Tenant', tenantSchema);
