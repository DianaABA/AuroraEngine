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
Use these steps to set up and build locally (matches CI):

1. Install root dependencies (optional but recommended):

```powershell
npm install
```

2. Build the UI package (from the repository root):

```powershell
cd packages/ui
npm install
npm run build
cd ../..
```

3. Build the minimal template (local demo):

```powershell
cd templates/minimal
npm install
npm run build
cd ../..
```

4. Run the minimal demo locally for development (hot reload):

```powershell
cd templates/minimal
npm run dev
```

Troubleshooting notes
- If `npm run build:ui` or `npm start` in the root fails, try running the install/build commands directly inside `packages/ui` and `templates/minimal` as shown above.
- Some generated `.js`/.d.ts files are committed for convenience; if you regenerate them locally, ensure they match before committing.
- If you encounter permission or lockfile issues on Windows, remove `node_modules` and re-run `npm install`, or try `npm ci` if you have a lockfile and want a clean install.

Optional: regenerate type declarations
- If you need to regenerate `.d.ts` files, run the build for the package that produces them (often the TypeScript build step inside each package). Confirm output matches the committed files before committing.


### Exports / Packages
- Engine core: `aurora-engine` (npm). Public exports: see `exports` in package.json; schema at `aurora-engine/scene-schema.json`.
- UI kit: `@aurora-engine/ui` (prototype; builds via `npm run build:ui`).
- API surface (stable vs internal): see `docs/api-surface.md`.
