# Deployment Guide

## Producción recomendada
- API y worker en contenedores separados.
- MongoDB Atlas + Redis gestionado.
- HTTPS obligatorio con reverse proxy (Nginx/Cloudflare).
- Secrets en gestor (AWS Secrets Manager / Doppler / Vault).

## Flujo
1. `npm ci && npm run test`
2. Build imágenes Docker.
3. Deploy API + worker + web.
4. Configurar Stripe webhook URL segura.
5. Activar monitorización y alertas de infraestructura.
