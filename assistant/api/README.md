# Aurora Assistant API Contracts

This document outlines the stateless BYOK proxy and local model endpoints used by the Assistant.

## Principles
- Stateless: no keys or user data stored server-side.
- Safety caps: max tokens, timeouts, model allowlist, header redaction in logs.
- JSON-first: prefer structured responses with schema guidance when requested.

## Endpoints

### POST `/api/assistant/chat`
- Purpose: Proxy chat/completions to configured provider (OpenAI-compatible).
- Auth: `x-openai-key` header (or provider-specific); never persisted.
- Body (subset):
```
{
  "model": "gpt-4o-mini",
  "messages": [ { "role": "system", "content": "..." }, { "role": "user", "content": "..." } ],
  "stream": true,
  "max_tokens": 2048
}
```
- Response: NDJSON stream of events
```
{ "type": "chunk", "data": "..." }
{ "type": "error", "message": "..." }
{ "type": "done" }
```
- Safety:
  - Reject models not in allowlist.
  - Cap `max_tokens`.
  - Timeout long responses.

### GET `/api/assistant/models`
- Purpose: List allowed provider presets and local models.
- Response:
```
{
  "providers": ["openai", "anthropic", "groq", "deepseek"],
  "models": [ { "id": "gpt-4o-mini", "provider": "openai" }, { "id": "local-tiny", "provider": "local" } ]
}
```

### POST `/api/assistant/generate-scene`
- Purpose: Request schema-guided scene JSON.
- Body:
```
{ "prompt": "Write an intro scene...", "hints": { "textId": true, "rtl": false } }
```
- Response: JSON adhering to exported Scene Schema; on invalid, returns friendly diffs.

## Local Model (browser)
- Library: `@mlc-ai/web-llm`.
- No server: runs in browser; fetched model artifacts cached.
- UI must surface download progress and size; allow cancel.

## Error States
- Rate limit: return 429-like and message.
- Invalid key: 401-like.
- Model not allowed: 400 with details.

## Logging
- Do not log `x-openai-key` or any Authorization headers.
- Log request IDs, timing, model, and totals only.
