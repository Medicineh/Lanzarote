'use client';

import { useEffect } from 'react';

type Theme = { branding?: { primaryColor?: string; secondaryColor?: string } };

export function TenantTheme() {
  useEffect(() => {
    const domain = window.location.hostname;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/tenant/theme`, {
      headers: { 'x-tenant-domain': domain }
    })
      .then((r) => r.json())
      .then((theme: Theme) => {
        if (theme.branding?.primaryColor) {
          document.documentElement.style.setProperty('--primary', theme.branding.primaryColor);
        }
        if (theme.branding?.secondaryColor) {
          document.documentElement.style.setProperty('--secondary', theme.branding.secondaryColor);
        }
      })
      .catch(() => null);
  }, []);

  return null;
}
