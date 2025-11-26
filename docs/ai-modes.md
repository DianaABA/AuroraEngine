# AI Helper Modes (Planned)

Two lanes to keep AI accessible and sustainable.

## Mode 1 — Local AI (Free & Offline)
- Runs in-browser via WebLLM or Transformers.js with small quantized models (5–40MB).
- No API keys, no internet required, no data leaves the device.
- Helper functions (planned):
  - `localAI.convertScriptToJSON(scriptText): Scene[]`
  - `localAI.fixGrammar(text): string`
  - `localAI.detectSceneErrors(sceneJson): ValidationIssue[]`
- Ideal for: beginners, schools, lightweight edits, zero-cost usage.

## Mode 2 — BYOK (Bring Your Own API Key)
- Supports OpenAI, Anthropic, Groq, DeepSeek, and OpenAI-compatible APIs.
- User pastes key in settings; stored only in `localStorage`; sent directly to provider from the browser.
- Helper functions (planned):
  - `ai.generateScene(prompt): Scene[]`
  - `ai.extendDialogue(scene, prompt): Scene[]`
  - `ai.suggestBranches(scene): Scene[]`
  - `ai.generateAssets(prompt)` (future)
- Ideal for: premium output, large branching projects, pro writers.

## Why this split
- Free, instant path for newcomers; no infra cost.
- BYOK keeps Aurora keyless and offloads cost to providers.
- No sensitive keys stored server-side.

## Implementation notes (scaffolding)
- Add a settings panel in the template to choose mode and (optionally) store BYOK key in `localStorage`.
- Use a thin adapter interface (see `src/utils/aiModes.ts`) so the UI can call `convertScriptToJSON`/`generateScene` without knowing the backend.
- Local mode: load models lazily; show download/progress indicators; keep bundle size small by dynamic import.
- BYOK: simple fetch to provider endpoints; guardrails for rate limit errors; never log keys.
