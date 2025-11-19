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
- `dialogue` (array): sequence of dialogue or choice entries
  - Dialogue: `{ "char"?: string, "text": string }`
  - Choice: `{ "choice": [ { "label": string, "goto": string } ] }`

## Navigation
- `goto` should reference another scene `id`.
- `end`: a special `goto` value may signal the VN end or return to menu.

## Transitions
- `type: 'transition'`
- `kind`: `fade | slide | zoom | shake | flash`
- `duration?`: milliseconds

The engine emits `vn:transition` when a transition step occurs and then pauses at the next dialogue. The minimal template visualizes these via CSS.

## Sprites and Expressions
- Show: `{ type:'spriteShow', id, src }`
- Swap (expression change): `{ type:'spriteSwap', id, src }`
- Hide: `{ type:'spriteHide', id }`

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
