# Deploying dimitri_dispensary to Railway

## Pre-flight checklist

Before deploying, apply the fixes from this PR to your codebase:

- [ ] `vite.config.ts` — `jsxLocPlugin` now dev-only
- [ ] `server/_core/index.ts` — port binding fixed for production
- [ ] `server/_core/vite.ts` — `serveStatic` path logic corrected
- [ ] `railway.json` added to repo root
- [ ] `nixpacks.toml` added to repo root
- [ ] `.env.example` updated

---

## Step 1 — Create a Railway account

Go to [railway.app](https://railway.app) and sign up with your GitHub account.

---

## Step 2 — Create a new project

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Authorize Railway and select `laserpanama/dimitri_dispensary`
4. Railway will detect the `railway.json` automatically

---

## Step 3 — Add a MySQL database

1. In your Railway project dashboard, click **"+ New"**
2. Select **"Database"** → **"Add MySQL"**
3. Railway will automatically inject `DATABASE_URL` into your service's environment

---

## Step 4 — Set environment variables

In your Railway service → **Variables** tab, add every variable from `.env.example`:

| Variable | Notes |
|---|---|
| `NODE_ENV` | Set to `production` |
| `DATABASE_URL` | Auto-set by Railway MySQL plugin |
| `JWT_SECRET` | Run `openssl rand -base64 32` to generate |
| `OAUTH_SERVER_URL` | Your OAuth provider URL |
| `OLLAMA_URL` | Must be a publicly accessible URL (not localhost) |
| `AWS_ACCESS_KEY_ID` | From your AWS IAM user |
| `AWS_SECRET_ACCESS_KEY` | From your AWS IAM user |
| `AWS_REGION` | e.g. `us-east-1` |
| `AWS_S3_BUCKET` | Your S3 bucket name |
| `VITE_ANALYTICS_ENDPOINT` | Optional |
| `VITE_ANALYTICS_WEBSITE_ID` | Optional |

> ⚠️ `VITE_*` variables are baked into the frontend bundle at build time.
> If you change them, you must redeploy (not just restart) for changes to take effect.

---

## Step 5 — Generate a public domain

In Railway → your service → **Settings → Networking** → click **"Generate Domain"**

You'll get a free `*.up.railway.app` URL.

---

## Step 6 — Deploy

Railway will auto-deploy on every push to `main`. The deploy process:

1. `pnpm install` — installs all dependencies
2. `pnpm build` — builds Vite frontend → `dist/public/` and bundles server → `dist/index.js`
3. `pnpm drizzle-kit migrate` — applies DB migrations
4. `node dist/index.js` — starts the production server

---

## Step 7 — Verify

Once deployed, check:

- `https://your-app.up.railway.app/` — frontend loads
- `https://your-app.up.railway.app/api/trpc/health` — API responds

---

## Ollama in production

Your app uses `OLLAMA_URL` which points to `localhost` in development. In production
you have two options:

- **Option A**: Add an Ollama service inside the same Railway project and use its
  internal hostname (e.g. `http://ollama.railway.internal:11434`)
- **Option B**: Use a hosted Ollama provider (e.g. [Together AI](https://together.ai),
  [Groq](https://groq.com)) and update the relevant router to use their API

---

## Local development (unchanged)

```bash
cp .env.example .env   # fill in your local values
pnpm install
pnpm db:push           # generate + apply migrations
pnpm dev               # starts Vite + Express together
```
