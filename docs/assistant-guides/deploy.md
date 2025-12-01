# Deploy Aurora Assistant API (BYOK)

Aurora Assistant is a stateless proxy — it never stores API keys or user data. Use BYOK (Bring Your Own Key) and pass it at request-time.

## Vercel (Node 20)
- Entry: `api/aurora-assistant.ts` (delegates to `assistant/api/aurora-assistant.ts`).
- Streaming: enabled via NDJSON (`content-type: application/x-ndjson`).
- Env: optional `OPENAI_API_KEY` (used only if the client doesn’t pass `x-openai-key`).

## Netlify (Node 20)
- Entry: `netlify/functions/aurora-assistant.ts`.
- Streaming: enabled via NDJSON (`content-type: application/x-ndjson`).
- Env: `OPENAI_API_KEY` optional as above.

## Dev Proxy (Vite)
- The minimal template proxies `/api/*` to your serverless dev host via `ASSISTANT_API_TARGET`.
- Set `ASSISTANT_API_TARGET` (default `http://localhost:3000`) and run template dev as usual.

## Security & Limits
- Provider/model allowlist enforced in the handler.
- Guards: max messages, per-message size, total size, and 20s timeout.
- Errors are sanitized; keys are never logged.

## Client Usage (BYOK)
Send `POST /api/aurora-assistant` with headers:
- `content-type: application/json`
- `x-openai-key: <YOUR_KEY>`

Body:
```json
{
  "provider": "openai",
  "model": "gpt-4.1-mini",
  "messages": [
    { "role": "user", "content": "How do I add a choice?" }
  ],
  "stream": true
}
```

If no `system` message is provided, the API prepends the default from `assistant/prompts/system-prompt.txt`.
