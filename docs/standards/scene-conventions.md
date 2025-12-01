# Scene Schema Conventions

This guide maps Aurora’s scene fields to common VN terminology and sets expectations for professional projects.

## Aurora → Common VN Terms
- `id` (scene): equivalent to a label or scene identifier.
- `steps[]`: ordered commands/lines.
- `dialogue` step: `char` + `text` (aka say), supports `textId` for i18n.
- `choice` step: options with `label` (aka menu), optional `goto` per option.
- `goto` step: jump to another scene by `scene` id (alias: “jump/label” in other engines).
- `background` step: set background `src` (alias in other tools: `scene`/`image bg`).
- `spriteShow/Hide/Swap`: character on/off/expression; supports placement & motion.
- `music` / `sfx`: play track by id/path.
- `transition`: `fade|slide|zoom|shake|flash` with optional duration.

## Authoring Guidelines
- Prefer `textId` for localizable dialogue and choices; keep raw `text` for drafts.
- Keep scene ids slug‑style and stable; avoid spaces.
- Validate with strict mode before committing; fix unknown `goto` targets early.
- Use `roles` mapping to decouple author roles from concrete sprite ids.
- Keep transitions short and purposeful; avoid mixing multiple heavy effects per step.

## Compatibility Aliases (Implemented)
To ease migration from other VN engines, Aurora accepts the following non-breaking aliases:
- `jump` (alias for `goto`), with `scene` or `target` or `label` → normalized to `scene`.
- `show` / `hide` → normalized to `spriteShow` / `spriteHide`.
- `bg` → normalized to `background` step.

Aliases are normalized during validation; unknown fields still trigger clear validation messages.

## JSON Schema
- The canonical schema lives at `docs/scene-schema.json` and is exported for tooling.
- Strict validator returns structured issues with `path`, `code`, and `segments` to power editor UIs.

Stick to this guide for a professional, consistent authoring experience across teams.
