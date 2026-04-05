import { Tenant } from '../models/Tenant.js';

export async function resolveTenant(req, res, next) {
  const host = (req.headers['x-tenant-domain'] || req.hostname || '').split(':')[0];
  let tenant = await Tenant.findOne({ domain: host });

  if (!tenant) {
    tenant = await Tenant.findOne({ slug: 'default' });
  }

  if (!tenant) {
    tenant = await Tenant.create({
      slug: 'default',
      name: 'Default Tenant',
      domain: 'localhost',
      branding: { appName: 'Lanzarote Alerts' }
    });
  }

  req.tenant = tenant;
  next();
}
