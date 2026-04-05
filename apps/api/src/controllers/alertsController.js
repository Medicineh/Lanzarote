import { Alert } from '../models/Alert.js';
import { AuditLog } from '../models/AuditLog.js';
import { alertSchema } from '../validators/alertValidators.js';

export async function listAlerts(req, res) {
  const alerts = await Alert.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.json(alerts);
}

export async function createAlert(req, res) {
  const payload = alertSchema.parse(req.body);
  const count = await Alert.countDocuments({ userId: req.user.id });
  if (count >= req.planLimit) return res.status(403).json({ error: 'Límite de plan alcanzado' });

  const alert = await Alert.create({ ...payload, userId: req.user.id, tenantId: req.user.tenantId });
  await AuditLog.create({ userId: req.user.id, tenantId: req.user.tenantId, action: 'alert.create', metadata: { alertId: alert.id } });
  res.status(201).json(alert);
}

export async function updateAlert(req, res) {
  const payload = alertSchema.partial().parse(req.body);
  const alert = await Alert.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, payload, { new: true });
  if (!alert) return res.status(404).json({ error: 'Alerta no encontrada' });
  await AuditLog.create({ userId: req.user.id, tenantId: req.user.tenantId, action: 'alert.update', metadata: { alertId: alert.id } });
  res.json(alert);
}

export async function deleteAlert(req, res) {
  const alert = await Alert.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  if (!alert) return res.status(404).json({ error: 'Alerta no encontrada' });
  await AuditLog.create({ userId: req.user.id, tenantId: req.user.tenantId, action: 'alert.delete', metadata: { alertId: alert.id } });
  res.json({ ok: true });
}
