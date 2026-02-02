# Deploy – La Soirée du Rire

Deploys use **Cloudflare Pages Git integration only** — no GitHub Actions workflow. Push to `main` → Cloudflare detects the commit and auto-builds/deploys.

## Ensure auto-deploy on git push

1. **Cloudflare Dashboard** → **Workers & Pages** → open your Pages project (e.g. srdg).
2. **Settings** → **Builds & deployments** → under **Build configuration**, confirm **Source** is **Connect to Git** (GitHub) and points to this repo.
3. **Production branch** should be `main` (or your chosen branch). Every push to that branch triggers a new build and deploy.
4. Do **not** add a GitHub Actions workflow to deploy to Pages — Cloudflare’s own Git integration handles it. This repo has no `.github/workflows` deploy file.

## Environment variables (Cloudflare Pages)

Set build-time variables in **Cloudflare Dashboard → Workers & Pages → your project (e.g. srdg) → Settings → Environment variables** (Production and/or Preview). After adding or changing a variable, redeploy (e.g. **Deployments → Retry deployment** on the latest, or push a new commit to trigger a build).

| Variable | Used for |
|--------|----------|
| `REACT_APP_GOOGLE_CLIENT_ID` | Dashboard Google Sign-In |
| `REACT_APP_GA4_PROPERTY_ID` | Dashboard GA4 |
| `REACT_APP_DASHBOARD_ADMIN_EMAIL` | Admin auto-access |
| `EMAILJS_SERVICE_ID`, `EMAILJS_TEMPLATE_ID`, `EMAILJS_PUBLIC_KEY` | Contact / forms |
| `REACT_APP_EMAILJS_DASHBOARD_REQUEST_TEMPLATE_ID` | Access-request emails (optional) |
| `REACT_APP_MCP_INSIGHTS_URL` | Dashboard AI insights (optional). **Full URL** including `https://`, e.g. `https://my-mcp-server.<subdomain>.workers.dev/insights`. |

## Cloudflare D1 (dashboard access)

```bash
wrangler d1 create dashboard-access
# Add database_id and preview_database_id to wrangler.toml [[d1_databases]]
wrangler d1 execute dashboard-access --file=./schema.sql
```

## Deploy site

Push to `main` → Cloudflare (via its Git integration) auto-builds and deploys. No GitHub workflow is used. Dashboard: e.g. `stats.lasoireedurire.ca` (subdomain in Cloudflare Pages).

## MCP server (AI insights)

Separate repo; deploy with `npx wrangler deploy` from that repo. See [MCP_CURSOR_SETUP.md](MCP_CURSOR_SETUP.md).
