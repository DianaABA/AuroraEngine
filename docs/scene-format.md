# Scene Format (Draft)

Purpose: Define a simple, creator-friendly JSON format for building VNs without touching React.

Status: Stable core with recent additions (spriteSwap, extra transitions).

## Goals
- Human-readable JSON
- Maps cleanly to AuroraEngine steps
- Easy to load, validate, and debug

## Example
```json
{
  "id": "intro",
  "bg": "lab.png",
  "music": "calm.mp3",
  "dialogue": [
    { "char": "Snowflake", "text": "Welcome." },
    { "choice": [
      { "label": "Hi", "goto": "friendly" },
      { "label": "Who are you?", "goto": "suspicious" }
    ]}
  ]
}
```

## Mapping to Internal Steps
The engine uses type-based steps. Common examples:
```ts
{ type: 'dialogue', char: 'Snowflake', text: 'Welcome.' }
{ type: 'choice', options: [ { label: 'Hi', goto: 'friendly' } ] }
{ type: 'transition', kind: 'fade', duration: 600 }
{ type: 'background', src: 'bg/lab.png' }
{ type: 'music', track: 'audio/calm.mp3' }
{ type: 'spriteShow', id: 'hero', src: 'img/hero_neutral.png' }
{ type: 'spriteSwap', id: 'hero', src: 'img/hero_happy.png' }
{ type: 'spriteHide', id: 'hero' }
{ type: 'flag', flag: 'met_hero', value: true }
{ type: 'sfx', track: 'audio/click.mp3' }
{ type: 'goto', scene: 'next-scene' }
```
A loader will transform the JSON scene into these internal steps.

## Fields
- `id` (string): unique scene identifier
- `bg` (string): background asset key/path
- `music` (string): music asset key/path
- `spriteDefaults` (object): per-scene default sprite placement like `{ "hero": { "pos":"center", "scale":1 } }`
- `steps` (array): sequence of typed steps (see Mapping). Core authoring notes:
  - Dialogue: `{ type:'dialogue', char?: string, text?: string, textId?: string }`
    - Exactly one of `text` or `textId` is required. Use `textId` for i18n; the template maps it via a locale table.
  - Choice: `{ type:'choice', options:[ { label?: string, textId?: string, goto?: string } ] }`
    - Exactly one of `label` or `textId` is required per option.

## Navigation
- `goto` should reference another scene `id`.
- `end`: a special `goto` value may signal the VN end or return to menu.

## Schema & Lint
- JSON Schema: `docs/scene-schema.json`
  - Dialogue supports `text` or `textId` (one required)
  - Choice options support `label` or `textId` (one required)
  - Scenes can include `spriteDefaults`
- Lint:
  - Template packs: `npm run build && node scripts/lint-all-packs.js`
  - Single file: `npm run build && node scripts/scene-lint.js --file <path/to/scene.json>`

## Transitions
- `type: 'transition'`
- `kind`: `fade | slide | zoom | shake | flash`
- `duration?`: milliseconds

The engine emits `vn:transition` when a transition step occurs and then pauses at the next dialogue. The minimal template visualizes these via CSS.

## Sprites and Expressions
- Show: `{ type:'spriteShow', id, src }`
- Swap (expression change): `{ type:'spriteSwap', id, src }`
- Hide: `{ type:'spriteHide', id }`
- Motion (per step):
  - `x`/`y` in percents, or `yPct` for clearer intent (e.g., `yPct: -10` lifts the sprite)
  - `moveTo` alias for a single hop: `{ moveTo: { x, yPct, ms, ease } }`
  - `moveMs` / `moveEase` set defaults; per-step `moves` array supports chained hops:
```jsonc
{ "type":"spriteShow", "id":"hero", "src":"hero.png", "x":50, "yPct":-4,
  "moveTo": { "x": 60, "yPct": -12, "ms": 400, "ease": "easeOutBack" },
  "moves": [
    { "x": 70, "yPct": -8, "ms": 280, "ease": "easeOutQuad" },
    { "x": 55, "yPct": -6, "ms": 220 }
  ]
}
```
  - Easing presets: `easeOutBack`, `easeInOutCubic`, `easeOutQuad`, `easeOutExpo`, `easeInOutSine` (or provide a custom CSS easing string).

Helper utilities can build these from a character-expression map:
```ts
const MAP = { hero: { neutral:'hero_neutral.png', happy:'hero_happy.png' } }
stepShowExpression('hero','neutral', MAP)
stepSwapExpression('hero','happy', MAP)
stepHideExpression('hero')
```

## Automation
- `autoAdvance` auto-steps through side-effects and pauses on dialogue after `goto/choice` and after `transition`.
- `autoDecide` can choose for `choice` steps; strategies include `highestWeight`.

## Loader Contract
```ts
loadScenesFromJson(json: string | object): { scenes: SceneDef[]; errors: string[] }
loadScenesFromUrl(url: string): Promise<{ scenes: SceneDef[]; errors: string[] }>
```
- Validates structure and references with clear, indexed errors
- Produces engine-ready steps and can build preload manifests

---
For questions or proposals, open an issue with examples and desired behavior.
