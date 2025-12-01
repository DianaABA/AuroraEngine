# Engine Design & Standards

This document defines AuroraEngine’s core design principles and how they map to well‑known VN engine conventions (e.g., Ren'Py, Naninovel, TyranoScript). It guides contributors and plugin authors toward a professional, predictable experience.

## Principles
- Simplicity first: data‑driven scenes, minimal magic, clear types.
- Compatibility: accept common VN concepts (labels/jumps, ADV/NVL) via adapters or aliases without breaking current schema.
- Stability: semantic versioning of scene and save formats with explicit migration policy.
- Extensibility: hooks and modules for achievements, gallery, audio, and packs without engine forks.
- Transparency: strict validation with actionable errors and exported JSON Schema.

## Public Surface (stable)
- Scene authoring schema (exported JSON Schema in `docs/scene-schema.json`).
- VN runtime: `createEngine`, `runSteps`, scene loader/validator, preloader.
- State modules: Achievements, Gallery, Jukebox, Metrics (event‑driven).
- Persistence helpers: save/load snapshot helpers.
- UI kit (optional import) remains additive and decoupled.

## Conventions
- Steps are explicit and typed (`dialogue`, `choice`, `background`, `music`, `spriteShow/Hide/Swap`, `transition`, `flag`, `goto`).
- Dialogue supports `char` + `text` or `textId` for i18n (ADV by default). NVL‑style can be composed via UI kit.
- Choices support `auto` strategies and validation of `goto` targets.
- Transitions limited to a curated set for predictability: `fade|slide|zoom|shake|flash`.
- Events emitted via `eventBus` for observability and tooling.

## Versioning & Compatibility
- Scene Schema Version: tracked in docs and validated with Ajv; breaking changes bump major.
- Save Schema Version: `SAVE_SCHEMA_VERSION` exposed; snapshots include `saveVersion` for future migrations.
- Deprecations: new aliases may be introduced (e.g., `jump` → `goto`) with warnings before removal.

## Extensibility
- Packs: content and assets described by `packs.json`; loader API stable.
- Modules: plug external systems via events (unlock, metrics) and minimal interfaces.
- Assistant: BYOK/local adapters with strict limits and no key storage.

## Quality Bar
- Strict scene/link validation; structured error surfaces with path segments.
- Tests for branching, saves, expressions, packs, and loaders.
- Husky gates: typecheck, scene lint, packs manifest validation, tests.

## References
- Ren'Py Concepts: labels/jump, ADV/NVL, rollback, quicksave.
- Naninovel (Unity): commands, resource providers, localization.
- TyranoScript: macro/scene semantics and asset conventions.

Aurora aligns with these where it benefits creators, while keeping a small, approachable data model.
