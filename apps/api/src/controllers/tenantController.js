import { Tenant } from '../models/Tenant.js';

export async function getTenantTheme(req, res) {
  const host = (req.headers['x-tenant-domain'] || req.hostname || '').split(':')[0];
  const tenant = (await Tenant.findOne({ domain: host })) || (await Tenant.findOne({ slug: 'default' }));

  if (!tenant) return res.status(404).json({ error: 'Tenant no encontrado' });

  res.json({
    slug: tenant.slug,
    name: tenant.name,
    domain: tenant.domain,
    branding: tenant.branding
  });
}

export async function upsertTenant(req, res) {
  const { slug, name, domain, branding } = req.body;
  const tenant = await Tenant.findOneAndUpdate(
    { slug },
    { slug, name, domain, branding },
    { upsert: true, new: true }
  );
  res.json(tenant);
}
