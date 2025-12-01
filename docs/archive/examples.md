# Example Packs (Minimal Template)

Use these JSON packs with the minimal template (`templates/minimal`). Drop into `public/scenes` and adjust the start buttons if needed.

## Branching + Flags (example.json)
- 3 scenes: intro → lesson_start | intro_repeat.
- Demonstrates `choice` branching and simple `flag` set.
- Default start in template.

## Expressions + CG/Achievement (expressions.json)
- Shows `spriteShow`/`spriteSwap` for expressions.
- Sets flags `cg_intro`, `codex_hero` (unlocks CG, Codex).
- Choices loop between happy/angry/neutral.

## Achievements + CG + Gallery (achievements.json)
- Unlocks an achievement and CG via flags.
- Uses `Gallery` and `Achievements` modules.

### achievements.json
```json
[
  {
    "id": "ach_intro",
    "bg": "room.svg",
    "steps": [
      { "type": "dialogue", "char": "Guide", "text": "Achievements demo." },
      { "type": "flag", "flag": "cg_intro" },
      { "type": "flag", "flag": "ach_first_cg" },
      { "type": "dialogue", "char": "Guide", "text": "CG and achievement unlocked." }
    ]
  }
]
```

## How to switch packs
- In `templates/minimal/src/main.ts`, the demo starts with `boot('/scenes/example.json', 'intro')` and has a button for `/scenes/expressions.json`.
- Add a new button (or reuse) pointing to `/scenes/achievements.json` for the achievements pack.

## Lint before running
```bash
npm run build
node scripts/scene-lint.js --file templates/minimal/public/scenes/example.json
```

## Non-coder flow (writer-friendly)
1) Draft your scene in Google Docs or similar (dialogue + choices).
2) Use `docs/ai-prompts.md` (Write Scene or Expand Branch) with your draft to get JSON.
3) Save JSON to `templates/minimal/public/scenes/<yours>.json`.
4) Lint: `npm run build && node scripts/scene-lint.js --file templates/minimal/public/scenes/<yours>.json`.
5) Run template: `cd templates/minimal && npm run dev` and point the start button to your file.
