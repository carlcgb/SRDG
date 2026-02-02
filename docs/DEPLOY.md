# Deploy – La Soirée du Rire

## GitHub Secrets (Settings → Secrets and variables → Actions)

| Secret | Used for |
|--------|----------|
| `CLOUDFLARE_API_TOKEN` | Pages deploy |
| `CLOUDFLARE_ACCOUNT_ID` | Pages deploy |
| `REACT_APP_GOOGLE_CLIENT_ID` | Dashboard Google Sign-In |
| `REACT_APP_GA4_PROPERTY_ID` | Dashboard GA4 |
| `REACT_APP_DASHBOARD_ADMIN_EMAIL` | Admin auto-access |
| `EMAILJS_SERVICE_ID`, `EMAILJS_TEMPLATE_ID`, `EMAILJS_PUBLIC_KEY` | Contact / forms |
| `REACT_APP_EMAILJS_DASHBOARD_REQUEST_TEMPLATE_ID` | Access-request emails (optional) |
| `REACT_APP_MCP_INSIGHTS_URL` | Dashboard AI insights (optional). **Full URL** including `https://`, e.g. `https://my-mcp-server.<subdomain>.workers.dev/insights`. After adding or changing, redeploy so the build picks it up. |

## Cloudflare D1 (dashboard access)

```bash
wrangler d1 create dashboard-access
# Add database_id and preview_database_id to wrangler.toml [[d1_databases]]
wrangler d1 execute dashboard-access --file=./schema.sql
```

## Deploy site

Push to `main` → GitHub Actions builds and deploys to Cloudflare Pages (project name: `srdg`). Dashboard: e.g. `stats.lasoireedurire.ca` (subdomain in Cloudflare Pages).

## MCP server (AI insights)

Separate repo; deploy with `npx wrangler deploy` from that repo. See [MCP_CURSOR_SETUP.md](MCP_CURSOR_SETUP.md).
