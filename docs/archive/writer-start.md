# Start Here (Writers / Non-Coders)

Goal: ship your first scene without coding.

## Quick path
1) Draft in plain text (Google Docs/Notion/Word). Write dialogue and choices.
2) Convert to JSON with AI:
   - Use `docs/ai-prompts.md` → “Write Scene” or “Expand Branch”.
   - Tell it your assets (background/music/sprites) and keep scene ids consistent.
3) Save the JSON to `templates/minimal/public/scenes/<yours>.json`.
4) Lint: `npm run build && node scripts/scene-lint.js --file templates/minimal/public/scenes/<yours>.json`
5) Run template: `cd templates/minimal && npm run dev`
6) Point the start button in the template to your file (e.g., update `boot('/scenes/<yours>.json', 'intro')` in `src/main.ts`).

## Assets
- Put backgrounds/music/sprites under `templates/minimal/public/`.
- Refer to them as relative paths (e.g., `bg: "bg/lab.png"`).

## Common schema tips
- Scene array: `[ { id, bg?, music?, steps: [...] } ]`
- Dialogue: `{ "type":"dialogue", "char":"Name", "text":"Hi" }`
- Choice: `{ "type":"choice", "options":[ { "label":"Yes", "goto":"next" } ] }`
- Sprite show/swap: `{ "type":"spriteShow", "id":"hero", "src":"hero_neutral.png" }`
- Goto: `{ "type":"goto", "scene":"next-scene-id" }`
- Full schema: `docs/scene-schema.json`

## Debugging
- If the template shows an error overlay, read the codes/paths.
- You can also run the lint command above to see structured errors.
- Fix the fields mentioned (often missing `id`, `text`, `options`, or unknown `goto`).

## Examples
- `templates/minimal/public/scenes/example.json` (branching)
- `templates/minimal/public/scenes/expressions.json` (expressions/CG)
- `templates/minimal/public/scenes/achievements.json` (achievements/CG)
- See `docs/examples.md` for details.
