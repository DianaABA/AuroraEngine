# AI Usage – Local vs BYOK

- Local (WebLLM): runs in-browser; no keys; good for drafts.
- BYOK (OpenAI/compat): higher quality; pass key at call-time (no storage).
- Assistant API expects header `x-openai-key` (preferred) or env `OPENAI_API_KEY` (server-side only).
- Keep outputs within schema; use `textId` for localization.

## Ask Aurora (in-template chat)
- Open the app and click `Ask Aurora` (top-right overlay).
- Set AI Mode to `BYOK` in Settings and paste your key. Keys are stored locally in your browser.
- Send a question (authoring, errors, examples). Responses stream live (Vercel) or return when ready (Netlify).

## Streaming behavior
- Vercel route (`/api/aurora-assistant`) supports NDJSON streaming with lines like `{ "delta": "..." }` and finishes with `{ "done": true }`.
- Netlify route currently returns a full JSON payload; streaming can be added later.

## Local development
- Recommended: run the serverless API and the template with a proxy.

Vercel Dev (API + UI together):
```powershell
npx vercel dev
```

Vite + proxy to Vercel Dev:
```powershell
$env:ASSISTANT_API_TARGET = "http://localhost:3000"
npm run --prefix templates/minimal dev
```

The template proxies `/api/*` to `ASSISTANT_API_TARGET` (defaults to `http://localhost:3000`).

## Safety & limits
- Provider allowlist: `openai`.
- Model allowlist: `gpt-4.1-mini`, `o4-mini`, `gpt-4o-mini`.
- Guards: message count/size caps and a 20s timeout with clear errors (e.g., `timeout`, HTTP 429).
