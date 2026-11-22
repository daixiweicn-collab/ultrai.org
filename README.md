# UltrAI.org — Open AI Benchmarks, MCP Registry & Monetization Intelligence

Independent AI model performance & pricing telemetry, security-graded MCP server registry, interactive Token ROI calculator, and empirical AI monetization intelligence.

## Features

- **Free AI Tokens & Live Promos (`/free-tokens`)**: Hourly & daily auto-synced `$0/1M` OpenRouter free models, zero-credit-card free API tiers, China-direct free quotas, off-peak discounts, and up to `$350K` cloud AI startup grants.
- **Model Benchmarks (`/benchmarks`)**: Side-by-side LLM quality index, coding score, speed (tokens/s), and blended API pricing synced via OpenRouter.
- **Token ROI Calculator (`/calculator`)**: Real-time monthly & annual API spend estimator with workload presets.
- **Security-Graded MCP Registry (`/registry`)**: Audited MCP servers & agent skills with A+/A/B grades and copy-paste JSON configs.
- **AI Monetization Intelligence (`/intelligence`)**: Data-driven teardowns + automated **Live AI Radar** (Hacker News & GitHub MCP trending).
- **Submit & Sponsor Portal (`/submit`)**: Free listing, expedited 48h audit, and B2B sponsorship workflow.
- **SEO & GEO Ready**: Built-in `/llms.txt`, dynamic `/sitemap.xml`, and `/robots.txt`.

## Quick Start

```bash
npm install
npm run dev
```

## Automated Daily Data Sync

```bash
npm run sync
```

Powered by `.github/workflows/daily-sync.yml` (runs daily at `00:30 UTC`). Optionally add `GEMINI_API_KEY` to GitHub repository secrets for automatic Chinese title translation.

## Production Environment Variables (Optional)

- `NEXT_PUBLIC_SITE_URL`: Canonical site URL (default: `https://www.ultrai.org`).
- `SUBMISSION_WEBHOOK_URL`: Webhook endpoint (e.g. Supabase Edge Function, Slack, Feishu, Make/Zapier) to persist `/api/submit` tool & Pro waitlist submissions in Serverless environments.
- `SUBSCRIBE_WEBHOOK_URL`: Webhook endpoint to persist `/api/subscribe` newsletter signups (falls back to `SUBMISSION_WEBHOOK_URL` if unset).
