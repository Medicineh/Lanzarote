# Deployment Guide

## Producción recomendada
- API y worker en contenedores separados.
- MongoDB Atlas + Redis gestionado.
- HTTPS obligatorio con reverse proxy.
- Secrets en gestor seguro.
- Sentry DSN configurado para captura de errores.
- Prometheus scrapeando `/api/v1/metrics`.

## White-label por tenant
- Crear tenant admin con `slug`, `domain`, `branding`.
- Configurar DNS/CNAME al frontend.
- Frontend obtiene tema dinámico desde `/api/v1/tenant/theme`.

## Web push
- Generar VAPID keys y cargarlas en `.env`.
- Service worker disponible en `/sw.js`.
