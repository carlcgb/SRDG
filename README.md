# La Soirée du Rire de Granby

Site web (React) pour La Soirée du Rire de Granby : spectacles d’humour, section corporative, formulaire de contact (EmailJS), tableau de bord Analytics (Google Sign-In + GA4), accès géré via Cloudflare D1.

## Démarrage

```bash
npm install
npm start
```

Ouvre [http://localhost:3000](http://localhost:3000).

## Build & déploiement

```bash
npm run build
```

Déploiement automatique sur **Cloudflare Pages** au push sur `main`. Variables d’environnement dans Cloudflare (Workers & Pages → projet → Settings → Environment variables). Voir [docs/DEPLOY.md](docs/DEPLOY.md).

## Documentation

- **[docs/DEPLOY.md](docs/DEPLOY.md)** – Variables d’environnement (Cloudflare Pages), D1, déploiement, URL du dashboard
- **[docs/MCP_CURSOR_SETUP.md](docs/MCP_CURSOR_SETUP.md)** – MCP server (Workers AI, GA4, insights/chat pour le dashboard)
- **schema.sql** – Schéma D1 (demandes d’accès, utilisateurs)

## Stack

React, EmailJS, Google Sign-In, GA4, Cloudflare Pages, D1, Workers (API + MCP).

## Licence

MIT
