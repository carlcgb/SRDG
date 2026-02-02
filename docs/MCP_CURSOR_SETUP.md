# MCP Server on Cloudflare Workers – Cursor Setup

Deploy a custom MCP (Model Context Protocol) server to Cloudflare Workers so Cursor can query your event/marketing data (e.g. ad spend, ROAS for La Soirée du Rire) without local servers or paid services.

## Prerequisites

- **Cloudflare account** – [dash.cloudflare.com](https://dash.cloudflare.com) (free tier is enough).
- **Node.js 18+** and npm (or yarn).
- **Wrangler CLI**: `npm i -g wrangler` then `wrangler login` (authorizes your account).

## Project location

The MCP server lives in **`my-mcp-server/`** at the repo root. All commands below run from that directory unless noted.

```bash
cd my-mcp-server
```

## Install and run locally

```bash
npm install
npm run dev
```

Server runs at **http://localhost:8787**. The MCP endpoint is **http://localhost:8787/mcp**.

## Test with MCP Inspector

In another terminal:

```bash
npx @modelcontextprotocol/inspector@latest
```

Open http://localhost:5173 in the browser, connect to **http://localhost:8787** (or **http://localhost:8787/mcp** if the inspector asks for the MCP URL). List and invoke tools to confirm `query_metrics`, `query_ga4` (if GA4 is configured), `add`, and `calculate` work.

## Deployment (manual only)

The MCP server is **not** deployed by the main repo’s GitHub Actions. The main workflow (`.github/workflows/deploy.yml`) only deploys the site to Cloudflare Pages; it does not run or deploy `my-mcp-server`. Deploy the MCP Worker manually when you change it.

### Manual deploy command

From the repo root or from `my-mcp-server/`:

```bash
cd my-mcp-server
npm install
npx wrangler deploy
```

After deploy you get a URL like:

**https://my-mcp-server.\<your-subdomain\>.workers.dev**

The MCP endpoint is: **https://my-mcp-server.\<your-subdomain\>.workers.dev/mcp**

(Free `*.workers.dev` subdomain; no custom domain required.)

### Optional: separate repository

You can move `my-mcp-server` into its own Git repository for separate versioning and optional CI (e.g. deploy only on tag or manual workflow). Steps:

1. **Create a new repo** (e.g. `my-mcp-server` on GitHub).
2. **Copy the MCP server** (without the rest of SRDG):
   ```bash
   cp -r my-mcp-server /tmp/my-mcp-server-standalone
   cd /tmp/my-mcp-server-standalone
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/<your-org>/my-mcp-server.git
   git push -u origin main
   ```
3. **Secrets**: In the new repo, set the same Wrangler secrets (`GA4_PROPERTY_ID`, `GA4_SERVICE_ACCOUNT_JSON`, `OPENAI_API_KEY`, etc.) via `npx wrangler secret put …` (or GitHub Actions secrets if you add a deploy workflow).
4. **Update references** in the main SRDG repo:
   - **Cursor** `mcp.json`: keep the same Workers URL (it doesn’t change if the Worker name and account stay the same).
   - **Dashboard** `REACT_APP_MCP_INSIGHTS_URL`: same URL (`https://my-mcp-server.<subdomain>.workers.dev/insights`), no change unless you use a different Worker name or account.
5. **Remove from main repo** (optional): delete `my-mcp-server/` from SRDG and add a note in the main README or `docs/MCP_CURSOR_SETUP.md` that the MCP server lives in `<repo-url>`.

## Cursor integration

1. Open **Cursor Settings → Tools & Integrations → Edit `mcp.json`** (or add/merge into your existing MCP config).
2. Add your deployed MCP server. Use the **Streamable HTTP** URL (path `/mcp`). If Cursor only offers an “SSE” style URL, try the same base URL with path `/mcp` first; some clients use Streamable HTTP on that path.

Example `mcp.json`:

```json
{
  "mcpServers": {
    "event-data": {
      "url": "https://my-mcp-server.<your-subdomain>.workers.dev/mcp"
    }
  }
}
```

Replace `<your-subdomain>` with your actual Workers subdomain (e.g. from `wrangler whoami` or the deploy output).

3. Restart Cursor. When the server is reachable, the MCP tool should show as connected (e.g. green dot).
4. In chat you can say: *“Using event-data, query_metrics for 'facebook' over 90 days”* and Cursor will call the tool and use the returned metrics (e.g. for Tailwind charts or copy).

## Tools exposed

| Tool             | Description |
|------------------|-------------|
| **query_metrics** | Get ROAS, spend, revenue (and optionally impressions/clicks) for a channel (`facebook` or `tiktok`) over a number of days (1–365, default 30). Returns La Soirée du Rire–style metrics. |
| **query_ga4**    | Get Google Analytics 4 data for La Soirée du Rire. Requires GA4 secrets (see below). **Parameters**: `date_range` (today, last7days, last30days, last90days), `report_type` (overview, top_pages, traffic_sources, devices), `limit` (1–50, default 10). |
| **add**          | Demo: add two numbers. |
| **calculate**    | Demo: add / subtract / multiply / divide two numbers. |

## Connect MCP to Google Analytics (GA4)

To use the **query_ga4** tool, the MCP server needs a **Google Cloud service account** with access to your GA4 property. The dashboard uses user OAuth; the MCP server uses server-side credentials so Cursor can query GA4 without a browser.

### 1. Create a service account

1. Open [Google Cloud Console](https://console.cloud.google.com/) and select (or create) the project that has your GA4 property.
2. Go to **IAM & Admin → Service accounts**.
3. Click **Create service account**. Name it (e.g. `mcp-ga4`) and finish.
4. Open the service account → **Keys** → **Add key** → **Create new key** → **JSON**. Download the JSON file (keep it private).

### 2. Enable GA4 Data API

1. In the same project, go to **APIs & Services → Library**.
2. Search for **Google Analytics Data API** and enable it.

### 3. Share the GA4 property with the service account

1. Open [Google Analytics](https://analytics.google.com/) → **Admin** (gear icon).
2. Under **Property**, click **Property access management**.
3. Click **+** (Add users) and enter the **service account email** (e.g. `mcp-ga4@your-project.iam.gserviceaccount.com`).
4. Role: **Viewer**. Save.

### 4. Set Wrangler secrets

**Security:** Never commit real API keys, Property IDs, or service account JSON to the repo. Use Wrangler secrets (or `.dev.vars` locally, which must stay gitignored).

From `my-mcp-server/`:

```bash
# GA4 Property ID (numeric, e.g. 123456789 – find it in GA Admin → Property settings)
npx wrangler secret put GA4_PROPERTY_ID
# Paste the Property ID when prompted

# Full service account JSON (paste the entire contents of the downloaded .json file)
npx wrangler secret put GA4_SERVICE_ACCOUNT_JSON
# Paste the JSON in one go (multiline is supported)
```

After redeploying (`npx wrangler deploy`), Cursor can call **query_ga4** with `date_range` and `report_type` (e.g. *“Using event-data, query_ga4 for last30days overview”* or *“query_ga4 last7days top_pages limit 5”*).

### Troubleshooting GA4

- **401/403**: Ensure the GA4 property is shared with the service account email and the GA4 Data API is enabled.
- **Invalid JSON**: When setting `GA4_SERVICE_ACCOUNT_JSON`, paste the whole file; avoid extra spaces or truncation.
- **No data**: Check that the property ID is correct (Admin → Property settings) and that the property has data for the chosen date range.

## AI Insights for the dashboard

The MCP server exposes an **HTTP endpoint** that returns AI-generated insights from GA4 data (same source as `query_ga4`). The dashboard can call it to show an “Insights IA” card.

### 1. Set OpenAI API key (Worker)

From `my-mcp-server/`:

```bash
npx wrangler secret put OPENAI_API_KEY
# Paste your OpenAI API key (used for gpt-4o-mini)
```

Redeploy: `npx wrangler deploy`.

### 2. Insights endpoint

- **URL**: `GET https://my-mcp-server.<your-subdomain>.workers.dev/insights?date_range=last30days`
- **Query**: `date_range` optional — `today`, `last7days`, `last30days`, `last90days` (default: `last30days`).
- **Response**: `{ "insight": "…", "dateRange": "last30days" }` or `{ "insight": "…", "error": true }` if GA4/OpenAI failed.

The endpoint fetches GA4 overview, top pages, and traffic sources, then asks OpenAI for 3–5 short, actionable insights in French for La Soirée du Rire.

### 3. Connect the dashboard

In your React app (or in Cloudflare Pages env vars), set:

- **`REACT_APP_MCP_INSIGHTS_URL`** = `https://my-mcp-server.<your-subdomain>.workers.dev/insights`

Rebuild and deploy the dashboard. The “🤖 Insights IA (Google Analytics)” card appears and loads insights for the selected date range.

### 4. Chat with the AI (ask questions)

The same Worker exposes **POST /chat** so you can ask the AI questions (with optional GA4 context for the current period).

- **URL**: `POST https://my-mcp-server.<your-subdomain>.workers.dev/chat`
- **Body**: `{ "message": "Comment améliorer le taux de rebond ?", "date_range": "last30days" }` — `date_range` is optional (default `last30days`).
- **Response**: `{ "reply": "…" }` or `{ "reply": "…", "error": true }`.

The dashboard includes a **“💬 Poser une question à l’IA”** section below the insights card: type a question and press Enter or **Envoyer**. The AI receives your message plus the GA4 summary for the selected date range and answers in French.

## Optional: real data and persistence

### Custom JSON endpoint (e.g. Meta/export)

Set a secret so `query_metrics` fetches from your own URL instead of mock data:

```bash
cd my-mcp-server
npx wrangler secret put DATA_JSON_URL
# Enter URL when prompted, e.g. https://your-host.com/data.json
```

Your endpoint should accept `?channel=facebook|tiktok&days=30` and return JSON with at least `spend`, `revenue`, `roas` (and optionally `impressions`, `clicks`).

### KV for event metrics

To persist metrics in KV:

1. Create a namespace:  
   `npx wrangler kv namespace create data-kv`
2. Add the binding to **`my-mcp-server/wrangler.jsonc`** (uncomment or add):

```jsonc
"kv_namespaces": [
  { "binding": "DATA_KV", "id": "<YOUR_KV_NAMESPACE_ID>" }
]
```

3. In `src/index.ts` you can then read/write from `env.DATA_KV` in your tools (e.g. cache or store event metrics by channel/date).

## Tips

- **Updates**: Edit code in `my-mcp-server/src/index.ts`, then `npx wrangler deploy` – changes go live in seconds.
- **Scale**: Free tier is generous (e.g. 100k requests/day); add Stripe/GitHub OAuth later if you need paid or multi-tenant access.
- **Multiple clients**: For other clients (e.g. Plomberie Vintage), pass account or project IDs as tool parameters and branch logic in `query_metrics` (or add new tools).

## References

- [Cloudflare: Build a Remote MCP server](https://developers.cloudflare.com/agents/guides/remote-mcp-server)
- [Deploy MCP server to Cloudflare (Apifog)](https://apidog.com/blog/deploy-mcp-server-to-cloudflare/)
- [workers-mcp (GitHub)](https://github.com/cloudflare/workers-mcp)
