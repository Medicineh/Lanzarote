import { User } from '../models/User.js';
import { encrypt } from '../utils/crypto.js';

export async function me(req, res) {
  res.json({
    id: req.user.id,
    email: req.user.email,
    name: req.user.name,
    role: req.user.role,
    plan: req.user.plan,
    telegram: { chatId: req.user.telegram?.chatId }
  });
}

export async function updateTelegram(req, res) {
  const { botToken, chatId } = req.body;
  await User.findByIdAndUpdate(req.user.id, {
    telegram: {
      botTokenEnc: encrypt(botToken),
      chatId
    }
  });

  res.json({ ok: true });
}
