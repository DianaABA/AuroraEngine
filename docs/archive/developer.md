## Developer Start Here (Engine/API)

Audience: developers embedding AuroraEngine or contributing to core.

### Public API surface (stable)
- `createEngine`, `VNEngine` (config: `autoEmit`, `autoAdvance`, `autoDecide`, `maxAutoSteps`)
- Scene loading: `loadScenes`, `loadScenesFromJsonStrict`, `loadScenesFromUrlStrict`, `validateSceneLinksStrict`, `remapRoles`
- Runtime: `engine.start(id)`, `engine.next()`, `engine.choose(idx)`, `engine.snapshot()/restore()`, `engine.getPublicState()`
- Auto controls: `engine.setAutoAdvance(on)`, `engine.setAutoDecide(on)`, `engine.isAutoAdvance()`, `engine.isAutoDecide()`
- Events: `vn:step`, `vn:auto-choice`, `vn:auto-choice-hint`, `vn:auto-loop-guard`, `vn:transition`, `music:*`
- State helpers: `Achievements`, `Gallery`, `Jukebox`
- UI kit (optional): `@aurora-engine/ui` vanilla renderer (`createVanillaRenderer`, `styles`)

### Scene schema
- JSON Schema: `docs/scene-schema.json` (strict loader alignment; yPct/moveTo/moves supported).
- Lint: `npm run build && node scripts/scene-lint.js --file <path/to/scene.json>` (structure + cross-scene goto/choice).

### Quick start for developers
- Read `docs/api-surface.md` for stable exports vs internals.
- Examples: see `docs/examples.md` and `templates/minimal/public/scenes/*`.
- Writer onboarding: `docs/writer-start.md` (pair with your dev help).
- Release checklist: `docs/release-checklist.md` for the build/test/lint/template steps before publishing.

### Build/test
<content unchanged for archive>
