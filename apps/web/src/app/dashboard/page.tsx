'use client';

import { useEffect, useState } from 'react';

type Alert = { _id: string; name: string; type: string; active: boolean };

export default function Dashboard() {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/alerts`, { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => setAlerts(Array.isArray(data) ? data : []))
      .catch(() => setAlerts([]));
  }, []);

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
        </section>
      </div>
    </main>
  );
}
