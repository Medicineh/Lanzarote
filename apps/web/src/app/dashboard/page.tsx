'use client';

import { useEffect, useState } from 'react';

type Alert = { _id: string; name: string; type: string; active: boolean };

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

export default function Dashboard() {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/alerts`, { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => setAlerts(Array.isArray(data) ? data : []))
      .catch(() => setAlerts([]));
  }, []);

  async function enablePush() {
    const sw = await navigator.serviceWorker.ready;
    const keyRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/push/vapid-public-key`);
    const { publicKey } = await keyRes.json();

    const subscription = await sw.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey)
    });

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/push/subscribe`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(subscription)
    });
  }

  return (
    <main className="container">
      <h2>Dashboard</h2>
      <div className="grid">
        <section className="card">
          <h3>Alertas activas</h3>
          <ul>
            {alerts.map((a) => (
              <li key={a._id}>{a.name} ({a.type}) - {a.active ? 'Activa' : 'Pausada'}</li>
            ))}
          </ul>
        </section>
        <section className="card">
          <h3>Plan</h3>
          <p>Free / Pro / Premium con Stripe Checkout.</p>
          <button onClick={enablePush}>Activar Web Push</button>
        </section>
      </div>
    </main>
  );
}
