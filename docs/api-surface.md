# Public API Surface (AuroraEngine)

Audience: developers embedding AuroraEngine or building on top of it. These exports are intended to remain stable within the same major version.

## Stable exports (`aurora-engine`)
- Engine: `createEngine`, `VNEngine` (config: `autoEmit`, `autoAdvance`, `autoDecide`, `maxAutoSteps`)
- Scene loading/validation: `loadScenesFromJsonStrict`, `loadScenesFromUrlStrict`, `validateSceneLinksStrict`, `remapRoles`
- Runtime controls: `start`, `next`, `choose`, `snapshot`/`restore`, `getPublicState`, `setAutoAdvance`/`setAutoDecide`
- State modules: `Achievements`, `Gallery`, `Jukebox`
- Events: `vn:step`, `vn:auto-choice`, `vn:auto-choice-hint`, `vn:auto-loop-guard`, `vn:transition`, `music:*`
- Schema: `scene-schema.json` (exported at `aurora-engine/scene-schema.json`, aligned with strict loader)

## Optional UI kit
- Package: `@aurora-engine/ui` (vanilla renderer prototype)
- Exports: `createVanillaRenderer`, `styles`
- Build locally with `npm run build:ui`

## Internal / not guaranteed stable
- Anything outside the `exports` map in `package.json` (including deep paths under `dist/src`).
- Template code (`templates/minimal`) is a reference, not a locked API.

## Compatibility promise
- Patch/minor bumps will not break the stable API surface above.
- Major bumps may rename/remove internals; stable surface changes will be called out in CHANGELOG.
