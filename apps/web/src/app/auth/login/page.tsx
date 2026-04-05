'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [idToken, setIdToken] = useState('');

  async function loginWithGoogleToken() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/google`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ idToken })
    });

    if (response.ok) window.location.href = '/dashboard';
  }

  return (
    <main className="container">
      <h2>Login</h2>
      <div className="card">
        <p>Pega aquí el ID Token obtenido con Google Identity Services.</p>
        <input value={idToken} onChange={(e) => setIdToken(e.target.value)} placeholder="Google ID Token" />
        <button onClick={loginWithGoogleToken}>Entrar con Google</button>
      </div>
    </main>
  );
}
