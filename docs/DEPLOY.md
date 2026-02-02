# Deploy – La Soirée du Rire

You can deploy in either of two ways:

1. **GitHub Actions workflow** (`.github/workflows/deploy.yml`): push to `main` → workflow builds and deploys to Cloudflare Pages. Set GitHub Secrets (see below).
2. **Cloudflare Pages Git integration**: create a Pages project with Connect to Git; push to `main` → Cloudflare builds and deploys. Use one or the other to avoid double deploys.

## Ensure auto-deploy on git push

Cloudflare **cannot convert a Direct Upload project to Git**. If your project shows **“No Git connection”** and **Settings** has no **Build configuration** (no build command, no output directory), it was created with Direct Upload. You must **create a new Pages project** with Connect to Git.

### Create a new project with Git (so pushes trigger deploys)

1. **Cloudflare Dashboard** → **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
2. Sign in with **GitHub** and authorize Cloudflare. Select your repo (e.g. `carlcgb/SRDG`). **Install & Authorize** → **Begin setup**.
3. **Set up builds and deployments** (this is where Build configuration lives):
   - **Project name**: e.g. `srdg` or `srdg-git` (you can rename later).
   - **Production branch**: `main`.
   - **Build command**: `npm run build`.
   - **Build output directory**: `build`.
   - **Root directory**: leave blank (repo root).
   - Add **Environment variables** (Production) if needed: `REACT_APP_GA4_PROPERTY_ID`, `REACT_APP_MCP_INSIGHTS_URL`, etc. You can add more in Settings after.
4. **Save and Deploy**. Wait for the first build to finish.
5. **Custom domain**: in the new project → **Settings** → **Custom domains** → add your domain (e.g. `stats.lasoireedurire.ca`). In DNS, point the CNAME to the new project’s Pages URL (or remove the CNAME from the old project and add it to the new one).
6. Copy any **Variables and Secrets** from the old **srdg** project into the new project’s **Settings** → **Environment variables**.
7. Optionally **delete the old srdg** project (Settings → Delete project) after the new project is live and the domain points to it.

After that, every **git push to `main`** triggers a build and deploy.

### GitHub Actions deploy (alternative)

If you use the workflow in `.github/workflows/deploy.yml`, set these **GitHub repo Secrets** (Settings → Secrets and variables → Actions):

| Secret | Used for |
|--------|----------|
| `CLOUDFLARE_API_TOKEN` | Pages deploy (create with “Edit Cloudflare Workers” permission) |
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare account ID |
| `REACT_APP_GOOGLE_CLIENT_ID` | Dashboard Google Sign-In |
| `REACT_APP_GA4_PROPERTY_ID` | Dashboard GA4 |
| `REACT_APP_DASHBOARD_ADMIN_EMAIL` | Admin auto-access |
| `REACT_APP_MCP_INSIGHTS_URL` | AI insights (full URL with `https://`) |
| `EMAILJS_SERVICE_ID`, `EMAILJS_TEMPLATE_ID`, `EMAILJS_PUBLIC_KEY` | Contact / forms |
| `REACT_APP_EMAILJS_DASHBOARD_REQUEST_TEMPLATE_ID` | Access-request emails (optional) |

If you use this workflow, disable automatic builds in the Cloudflare Pages project (Settings → Builds & deployments) so each push doesn’t trigger both the workflow and a Cloudflare build.

### If the GitHub connection was revoked (Cloudflare Git only)

If Cloudflare Pages shows the repo as disconnected or builds stop triggering:

1. **GitHub account** (not the repo): click your **profile picture** (top right) → **Settings** → left sidebar **Applications** → **Authorized OAuth Apps** or **Installed GitHub Apps**. Cloudflare is authorized here when you connect Pages to Git — it does **not** appear under the repo’s Settings. If Cloudflare is missing, you’ll re-authorize it in step 2.
2. **Cloudflare Dashboard** → **Workers & Pages** → your Pages project → **Settings** → **Builds & deployments** (or **Build configuration**). Use **Reconnect** or **Connect to Git** → choose your repo (e.g. `carlcgb/SRDG`). GitHub will prompt you to **authorize Cloudflare** (grant repo access); accept. That adds Cloudflare to your GitHub account’s Applications.
3. Confirm **Production branch** is still `main`. Pushes to `main` will trigger deploys again.

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
