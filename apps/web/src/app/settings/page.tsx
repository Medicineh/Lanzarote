'use client';

import { useState } from 'react';

export default function SettingsPage() {
  const [botToken, setBotToken] = useState('');
  const [chatId, setChatId] = useState('');

  async function saveTelegram() {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/telegram`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ botToken, chatId })
    });
    alert('Configuración guardada');
  }

  return (
    <main className="container">
      <h2>Integración Telegram</h2>
      <div className="card">
        <input placeholder="bot token" value={botToken} onChange={(e) => setBotToken(e.target.value)} />
        <input placeholder="chat id" value={chatId} onChange={(e) => setChatId(e.target.value)} />
        <button onClick={saveTelegram}>Guardar</button>
      </div>
    </main>
  );
}
