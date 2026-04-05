import Link from 'next/link';

export default function Home() {
  return (
    <main className="container">
      <h1>Lanzarote Alerts SaaS</h1>
      <p>Alertas inteligentes 24/7 con Telegram, email y tiempo real.</p>
      <div className="card">
        <Link href="/dashboard">Ir al dashboard</Link>
      </div>
    </main>
  );
}
