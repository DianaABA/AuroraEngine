# Scene Format (Draft)

Purpose: Define a simple, creator-friendly JSON format for building VNs without touching React.

Status: Draft. Subject to change as engine APIs stabilize.

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
The engine currently uses type-based steps, e.g.:
```ts
{ type: 'dialogue', char: 'Snowflake', text: 'Welcome.' }
{ type: 'choice', options: [ { label: 'Hi', goto: 'friendly' } ] }
{ type: 'transition', kind: 'fade', duration: 600 }
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

## Future Extensions
- Per-line expressions/conditions (show-if flags)
- Inline transitions (fade, slide)
- Sprite expressions (e.g., emotion states)
- Localization keys instead of raw text

## Loader Contract (planned)
```ts
loadScenes(jsonScenes: SceneJSON[]): EngineScene[]
```
- Validates structure and references
- Produces engine-ready steps
- Reports clear errors with scene/line context

---
For questions or proposals, open an issue with examples and desired behavior.
