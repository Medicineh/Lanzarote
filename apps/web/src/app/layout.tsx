import './styles.css';
import type { ReactNode } from 'react';
import { PWARegistrar } from '../components/PWARegistrar';
import { TenantTheme } from '../components/TenantTheme';

export const metadata = {
  title: 'Lanzarote Alerts',
  description: 'Alertas inteligentes 24/7'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
      </head>
      <body>
        <TenantTheme />
        <PWARegistrar />
        {children}
      </body>
    </html>
  );
}
