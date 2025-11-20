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

## Scene Lint (Strict Validation)

- Build once: `npm run build`
- Lint a JSON file: `npm run scenes:lint -- --file scenes/example.json`
- Output shows structured codes/paths for quick fixes.

## Paste-and-Play in the Template

- In the browser demo (`templates/minimal`), use “Load Custom Scenes” to paste JSON or pick a file.
- Strict validation runs in-browser; errors list the path/code/message.
- If valid, it starts from your chosen start id (or defaults to the first scene).
- Authoring roles: you can set `roles` on scenes to map `role` to sprite ids (e.g., `"guide": "spr_guide"`), and `spriteShow/swap` can reference `role`.

## Lightweight Scene Editor (Template)

- In the template UI, use the “Lightweight Scene Editor” to add steps (dialogue, choice, background, spriteShow/swap, music, flag, transition).
- See a live JSON preview as you add steps; strict validation runs when you click “Build & Run.”
- Starts the engine with your authored scene immediately for quick testing.

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
