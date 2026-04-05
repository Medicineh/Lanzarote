import fetch from 'node-fetch';

export async function sendTelegramMessage({ botToken, chatId, message }) {
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'HTML' })
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Telegram error: ${body}`);
  }

  return response.json();
}
