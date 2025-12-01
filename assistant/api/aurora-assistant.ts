/*
  Aurora Assistant API (BYOK proxy skeleton)
  - Stateless: never stores keys or user data.
  - Expects an `x-openai-key` header for BYOK, or uses process.env.OPENAI_API_KEY if present.
  - Example contract only; wire into your serverless platform (Vercel/Netlify) as needed.
*/

import OpenAI from "openai";
import fs from "fs";
import path from "path";

const ALLOWED_PROVIDER: Provider = "openai";
const ALLOWED_MODELS = new Set<string>(["gpt-4.1-mini", "o4-mini", "gpt-4o-mini"]);
const MAX_MESSAGES = 24;
const MAX_CONTENT_CHARS = 8000;
const MAX_TOTAL_CHARS = 20000;
const TIMEOUT_MS = 20000;

export type Provider = "openai";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AssistantRequest {
  provider: Provider;
  model: string; // e.g., "gpt-4.1-mini"
  messages: ChatMessage[];
  stream?: boolean;
  temperature?: number;
}

export interface AssistantResponse {
  ok: boolean;
  content?: string;
  error?: string;
}

// Load default system prompt once (optional fallback)
let DEFAULT_SYSTEM_PROMPT: string | null = null;
try {
  const p = path.resolve(__dirname, "../prompts/system-prompt.txt");
  DEFAULT_SYSTEM_PROMPT = fs.readFileSync(p, "utf8");
} catch {
  DEFAULT_SYSTEM_PROMPT = null;
}

// Example handler signature (adapt to your framework)
export async function handleAuroraAssistant(req: any, res: any) {
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.end("Method Not Allowed");
    return;
  }

  let body: AssistantRequest;
  try {
    if (req.headers && typeof req.headers["content-type"] === "string") {
      const ct = String(req.headers["content-type"]).toLowerCase();
      if (!ct.includes("application/json")) {
        res.statusCode = 415;
        res.end(JSON.stringify({ ok: false, error: "unsupported_media_type" } satisfies AssistantResponse));
        return;
      }
    }
    body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  } catch (e) {
    res.statusCode = 400;
    res.end(JSON.stringify({ ok: false, error: "invalid_json" } satisfies AssistantResponse));
    return;
  }

  const key = req.headers["x-openai-key"] || process.env.OPENAI_API_KEY;
  if (!key) {
    res.statusCode = 401;
    res.end(JSON.stringify({ ok: false, error: "missing_api_key" } satisfies AssistantResponse));
    return;
  }

  if (body.provider !== ALLOWED_PROVIDER) {
    res.statusCode = 400;
    res.end(JSON.stringify({ ok: false, error: "unsupported_provider" } satisfies AssistantResponse));
    return;
  }

  // Guards
  if (!body || !Array.isArray(body.messages) || typeof body.model !== "string") {
    res.statusCode = 400;
    res.end(JSON.stringify({ ok: false, error: "invalid_request" } satisfies AssistantResponse));
    return;
  }
  if (!ALLOWED_MODELS.has(body.model)) {
    res.statusCode = 400;
    res.end(JSON.stringify({ ok: false, error: "model_not_allowed" } satisfies AssistantResponse));
    return;
  }
  if (body.messages.length === 0 || body.messages.length > MAX_MESSAGES) {
    res.statusCode = 400;
    res.end(JSON.stringify({ ok: false, error: "messages_out_of_bounds" } satisfies AssistantResponse));
    return;
  }
  let total = 0;
  for (const m of body.messages) {
    if (!m || (m.role !== "system" && m.role !== "user" && m.role !== "assistant")) {
      res.statusCode = 400;
      res.end(JSON.stringify({ ok: false, error: "invalid_message" } satisfies AssistantResponse));
      return;
    }
    if (typeof m.content !== "string" || m.content.length > MAX_CONTENT_CHARS) {
      res.statusCode = 413;
      res.end(JSON.stringify({ ok: false, error: "message_too_large" } satisfies AssistantResponse));
      return;
    }
    total += m.content.length;
    if (total > MAX_TOTAL_CHARS) {
      res.statusCode = 413;
      res.end(JSON.stringify({ ok: false, error: "payload_too_large" } satisfies AssistantResponse));
      return;
    }
  }

  // Ensure a system prompt exists unless client supplied one
  if (!body.messages.some(m => m.role === "system") && DEFAULT_SYSTEM_PROMPT) {
    body.messages.unshift({ role: "system", content: DEFAULT_SYSTEM_PROMPT });
  }

  if (body.stream) {
    try {
      const client = new OpenAI({ apiKey: String(key) });
      const ac = new AbortController();
      const timer = setTimeout(() => ac.abort(), TIMEOUT_MS);
      const temperature = Math.max(0, Math.min(1, typeof body.temperature === "number" ? body.temperature : 0.2));

      res.statusCode = 200;
      res.setHeader("content-type", "application/x-ndjson");
      res.setHeader("cache-control", "no-cache");
      res.setHeader("connection", "keep-alive");

      const stream = await client.chat.completions.create(
        { model: body.model, messages: body.messages, temperature, stream: true },
        { signal: ac.signal }
      );

      for await (const part of stream) {
        try {
          const delta = part.choices?.[0]?.delta?.content || "";
          if (delta) {
            res.write(JSON.stringify({ delta }) + "\n");
          }
        } catch {}
      }
      clearTimeout(timer);
      try { res.write(JSON.stringify({ done: true }) + "\n"); } catch {}
      res.end();
      return;
    } catch (err: any) {
      res.statusCode = 500;
      res.setHeader("content-type", "application/json");
      const msg = String(err?.name === "AbortError" ? "timeout" : err?.message || err);
      res.end(JSON.stringify({ ok: false, error: msg } satisfies AssistantResponse));
      return;
    }
  }

  try {
    const client = new OpenAI({ apiKey: String(key) });
    // Timeout via AbortController
    const ac = new AbortController();
    const timer = setTimeout(() => ac.abort(), TIMEOUT_MS);
    const temperature = Math.max(0, Math.min(1, typeof body.temperature === "number" ? body.temperature : 0.2));
    const completion = await client.chat.completions.create(
      {
        model: body.model,
        messages: body.messages,
        temperature,
      },
      { signal: ac.signal }
    );
    clearTimeout(timer);

    const content = completion.choices?.[0]?.message?.content ?? "";
    res.statusCode = 200;
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify({ ok: true, content } satisfies AssistantResponse));
  } catch (err: any) {
    const status = typeof err?.status === "number" ? err.status : 500;
    res.statusCode = status;
    res.setHeader("content-type", "application/json");
    // Redact details; do not echo secrets
    const msg = String(err?.name === "AbortError" ? "timeout" : err?.message || err);
    res.end(JSON.stringify({ ok: false, error: msg } satisfies AssistantResponse));
  }
}
