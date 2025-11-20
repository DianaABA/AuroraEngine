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

## AI Prompt Examples

See `docs/ai-prompts.md` for ready-to-use prompts:
- “Write Scene” creates a small branching scene in AuroraEngine JSON.
- “Fix My Error” explains validation errors and returns corrected JSON.
- “Expand Branch” grows an existing scene and adds flags.

## Troubleshooting Scenes

- Use `npm run preview` to run the CLI preview of `scenes/example.json`.
- Turn on debug toasts and Debug HUD in the template Settings panel to see live flags, scene id, and auto-choice behavior.
- Strict validation helpers:
  - `validateSceneDefStrict` gives structured errors (path/code/message).
  - `validateSceneLinksStrict` reports missing `goto` targets across scenes.
