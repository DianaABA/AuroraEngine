import OpenAI from "openai";
import fs from "fs";
import path from "path";

const ALLOWED_MODELS = new Set<string>(["gpt-4.1-mini", "o4-mini", "gpt-4o-mini"]);
const MAX_MESSAGES = 24;
const MAX_CONTENT_CHARS = 8000;
const MAX_TOTAL_CHARS = 20000;
const TIMEOUT_MS = 20000;

type Provider = "openai";

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type AssistantRequest = {
  provider: Provider;
  model: string;
  messages: ChatMessage[];
  stream?: boolean;
  temperature?: number;
};

let DEFAULT_SYSTEM_PROMPT: string | null = null;
try {
  const p = path.resolve(__dirname, "../../assistant/prompts/system-prompt.txt");
  DEFAULT_SYSTEM_PROMPT = fs.readFileSync(p, "utf8");
} catch {
  DEFAULT_SYSTEM_PROMPT = null;
}

export const handler = async (event: any) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }
  let body: AssistantRequest;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return { statusCode: 400, body: JSON.stringify({ ok: false, error: "invalid_json" }) };
  }
  const key = event.headers["x-openai-key"] || process.env.OPENAI_API_KEY;
  if (!key) {
    return { statusCode: 401, body: JSON.stringify({ ok: false, error: "missing_api_key" }) };
  }
  if (body.provider !== "openai") {
    return { statusCode: 400, body: JSON.stringify({ ok: false, error: "unsupported_provider" }) };
  }
  if (!body || !Array.isArray(body.messages) || typeof body.model !== "string") {
    return { statusCode: 400, body: JSON.stringify({ ok: false, error: "invalid_request" }) };
  }
  if (!ALLOWED_MODELS.has(body.model)) {
    return { statusCode: 400, body: JSON.stringify({ ok: false, error: "model_not_allowed" }) };
  }
  if (body.messages.length === 0 || body.messages.length > MAX_MESSAGES) {
    return { statusCode: 400, body: JSON.stringify({ ok: false, error: "messages_out_of_bounds" }) };
  }
  let total = 0;
  for (const m of body.messages) {
    if (!m || (m.role !== "system" && m.role !== "user" && m.role !== "assistant")) {
      return { statusCode: 400, body: JSON.stringify({ ok: false, error: "invalid_message" }) };
    }
    if (typeof m.content !== "string" || m.content.length > MAX_CONTENT_CHARS) {
      return { statusCode: 413, body: JSON.stringify({ ok: false, error: "message_too_large" }) };
    }
    total += m.content.length;
    if (total > MAX_TOTAL_CHARS) {
      return { statusCode: 413, body: JSON.stringify({ ok: false, error: "payload_too_large" }) };
    }
  }
  // Prepend default system prompt if none provided
  if (!body.messages.some(m => m.role === "system") && DEFAULT_SYSTEM_PROMPT) {
    body.messages = [{ role: "system", content: DEFAULT_SYSTEM_PROMPT }, ...body.messages];
  }
  if (body.stream) {
    try {
      const key = event.headers["x-openai-key"] || process.env.OPENAI_API_KEY;
      const client = new OpenAI({ apiKey: String(key) });
      const ac = new AbortController();
      const timer = setTimeout(() => ac.abort(), TIMEOUT_MS);
      const temperature = Math.max(0, Math.min(1, typeof body.temperature === "number" ? body.temperature : 0.2));

      const rs = new ReadableStream<Uint8Array>({
        async start(controller) {
          try {
            const stream = await client.chat.completions.create(
              { model: body.model, messages: body.messages, temperature, stream: true },
              { signal: ac.signal }
            );
            const enc = new TextEncoder();
            for await (const part of stream) {
              const delta = part.choices?.[0]?.delta?.content || "";
              if (delta) controller.enqueue(enc.encode(JSON.stringify({ delta }) + "\n"));
            }
            controller.enqueue(new TextEncoder().encode(JSON.stringify({ done: true }) + "\n"));
            controller.close();
          } catch (err: any) {
            const enc = new TextEncoder();
            controller.enqueue(enc.encode(JSON.stringify({ error: String(err?.name === 'AbortError' ? 'timeout' : err?.message || err) }) + "\n"));
            controller.close();
          } finally {
            clearTimeout(timer);
          }
        }
      });

      return new Response(rs as any, {
        status: 200,
        headers: {
          "content-type": "application/x-ndjson",
          "cache-control": "no-cache",
          "connection": "keep-alive"
        }
      }) as any;
    } catch (err: any) {
      return {
        statusCode: typeof err?.status === 'number' ? err.status : 500,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ok: false, error: String(err?.name === "AbortError" ? "timeout" : err?.message || err) })
      };
    }
  }
  try {
    const client = new OpenAI({ apiKey: String(key) });
    const ac = new AbortController();
    const timer = setTimeout(() => ac.abort(), TIMEOUT_MS);
    const temperature = Math.max(0, Math.min(1, typeof body.temperature === "number" ? body.temperature : 0.2));
    const completion = await client.chat.completions.create(
      { model: body.model, messages: body.messages, temperature },
      { signal: ac.signal }
    );
    clearTimeout(timer);
    const content = completion.choices?.[0]?.message?.content ?? "";
    return {
      statusCode: 200,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ok: true, content }),
    };
  } catch (err: any) {
    return {
      statusCode: typeof err?.status === 'number' ? err.status : 500,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ok: false, error: String(err?.name === "AbortError" ? "timeout" : err?.message || err) }),
    };
  }
};
