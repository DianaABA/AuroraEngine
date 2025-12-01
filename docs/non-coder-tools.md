# Non-Coder Helpers (Draft)

This project ships a couple of "don’t touch code" helpers meant for writers and content folks.

## Drag & Drop Assets (Template)

Where: `templates/minimal` demo UI (middle of the page).

What it does:
- Drop images (PNG/JPG/WebP) or audio (MP3/OGG) into the box.
- Files stay in your browser (object URLs); nothing uploads to a server.
- Use buttons to preview as the current background or copy the object URL.

Tips:
- Use small assets while prototyping; large files can drain memory because object URLs stay in RAM.
- If you copy the object URL, it only works on this tab; for shipping, put assets into `public/` or a CDN and update your scene JSON to point there.

## Splash Background Preview

On the initial split splash screen, hovering category tiles (e.g., Writer vs Developer tracks) temporarily previews related background art without committing it. Moving the cursor away restores the original. This helps non-coders explore mood boards quickly:
- Hover: crossfades to preview image.
- Click start: locks selection and enters the editor/assistant flow.
- Memory tip: previews use transient object/state; no files are uploaded.

## Scene Lint (Strict Validation)

- Build once: `npm run build`
- Lint a JSON file: `npm run scenes:lint -- --file scenes/example.json`
- Lint all scenes at once: `npm run scenes:lint` (no `--file` needed; validates every JSON in `scenes/`).
- Use the single-file form when iterating quickly on one scene to keep output focused.
- Output shows structured codes/paths for quick fixes.

## Paste-and-Play in the Template

- In the browser demo (`templates/minimal`), use “Load Custom Scenes” to paste JSON or pick a file.
- Strict validation runs in-browser; errors list the path/code/message.
- If valid, it starts from your chosen start id (or defaults to the first scene).
- Authoring roles: you can set `roles` on scenes to map `role` to sprite ids (e.g., `"guide": "spr_guide"`), and `spriteShow/swap` can reference `role`.

### Roles & Sprite Mapping

Purpose: keep dialogue authoring readable ("guide" instead of internal sprite ids) and allow AI prompts to stay semantic.
Define once per scene file root:
```json
"roles": { "guide": "spr_guide", "rival": "spr_rival" }
```
Usage patterns:
- Dialogue step: `{ "id": "line1", "say": { "role": "guide", "text": "Welcome." } }`
- Sprite show: `{ "spriteShow": { "role": "rival" } }` resolves to `spr_rival`.
- Mixed usage (direct id + role) is allowed; avoid assigning two roles to the same sprite id for clarity.
- When expanding via Assistant, include the existing `roles` block so generated branches remain consistent.

## Lightweight Scene Editor (Template)

- In the template UI, use the “Lightweight Scene Editor” to add steps (dialogue, choice, background, spriteShow/swap, music, flag, transition).
- See a live JSON preview as you add steps; strict validation runs when you click “Build & Run.”
- Starts the engine with your authored scene immediately for quick testing.

## AI Prompt Examples

See `docs/ai-prompts.md` for ready-to-use prompts:
- “Write Scene” creates a small branching scene in AuroraEngine JSON.
- “Fix My Error” explains validation errors and returns corrected JSON.
- “Expand Branch” grows an existing scene and adds flags.

## Assistant & Automation

Use the “Ask Aurora” panel in the template to generate or fix scenes without touching code:
- Open it from the header (Assistant) or the splash actions.
- Enter your own API key (BYOK) for a supported provider; the panel streams responses.
- JSON replies are validated live; malformed JSON shows an inline fix prompt.
- Toggle automation in Settings: `Auto-Apply JSON` (writes directly into the editor preview) and `Auto-Run JSON` (starts engine immediately when valid).
- Provider and model badges show which backend you are using; base URL inference auto-detects custom hosts.
- Retry a response or cancel mid-stream; partial JSON will not auto-run until validation passes.

## Troubleshooting Scenes

- Use `npm run preview` to run the CLI preview of `scenes/example.json`.
- Turn on debug toasts and Debug HUD in the template Settings panel to see live flags, scene id, and auto-choice behavior.
- Strict validation helpers:
  - `validateSceneDefStrict` gives structured errors (path/code/message).
  - `validateSceneLinksStrict` reports missing `goto` targets across scenes.
 
Common quick fixes:
- Missing `goto` target: add the scene id or remove the branch; run `npm run scenes:lint` again.
- Duplicate step ids: ensure each `id` inside a scene is unique for branching clarity.
- Large asset memory spikes: replace huge background images with smaller placeholders while drafting.
- JSON paste errors in Assistant: remove trailing commas or repair unclosed braces; streamed partial JSON won’t auto-run until valid.
- Unexpected character name: confirm the role exists in `roles` mapping or switch to direct sprite id.
