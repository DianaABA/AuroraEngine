# Changelog

All notable changes to this project are documented here.

## v0.0.4 — 2025-11-19

- Engine: scene cross-link validation on `loadScenes` (invalid `goto`/choice `goto` now fail fast with detailed errors)
- Engine: emit `vn:auto-choice` with decision details (strategy, index, labels)
- Engine: emit `vn:auto-loop-guard` when `maxAutoSteps` safety trips
- Loader: broaden `transition.kind` validation to include `zoom|shake|flash`
- State: bubble `GameStateManager.validate` exceptions via `gameState:corrupt` with error context
- Docs: Risks addressed with validation/events to aid author debugging

## v0.0.3 — 2025-11-19

- Utils: new `Gallery` module for CG unlocks with persistence and `gallery:unlock` events
- Engine: runtime toggles `setAutoAdvance`/`setAutoDecide` + `is*` helpers
- Template: Gallery panel UI with grid; Auto and Auto-Choose buttons
- Template: Expressions demo unlocks a CG via `flag: cg_intro`
- Docs: `docs/gallery.md`; template README updated with Start buttons, Gallery, and Auto controls

## v0.0.1 — 2025-11-19
## v0.0.2 — 2025-11-19

- VN: `spriteSwap` step for expression changes; transitions extended with `zoom/shake/flash`
- Template: Continue button with autosave detection; autosave each step; three save slots with timestamps
- Template: visual transition effects driven by `vn:transition`
- Utils: `expressions` helper to map character expressions to sprite sources
- Docs: scene-format updated; expressions guide added
- Tests: coverage for sprite swap, transition kinds, expressions helper

- Engine: deterministic auto-advance semantics
  - Pause at first dialogue after `goto` or choice scene change
  - Pause at first dialogue after `transition` (even with side-effects in between)
  - Guarded auto-loop to prevent recursion/stack overflow
- Events:
  - Emit `vn:transition` on transition steps
  - Music events on `music` step (`music:track-change`, `music:play`)
  - Node-safe event bus fallback so tests and non-DOM hosts receive events
- Loading & Preload:
  - Load scenes from JSON/URL with detailed validation errors
  - `preloadAssets(manifest, cb)` with progress callback
- Templates & Examples:
  - Minimal Vite browser template with preloader UI
  - CLI preview example
- Docs:
  - ROADMAP, scene format, AI prompts, troubleshooting guide
- CI & Dev Experience:
  - GitHub Actions for build/typecheck/test (Windows + Ubuntu)
  - Devcontainer for Codespaces
- Tests:
  - Coverage for loader validation, auto-advance, transitions
  - Effects tests for music/background/sprites/sfx

## v0.0.5 — 2025-11-26

- Docs: Consolidated and cleaned `README.md` (shorter Quick Start, moved developer notes to `docs/developer.md`, added FAQ & troubleshooting).
- Docs: added `docs/developer.md` with build instructions and troubleshooting; added `docs/scene-schema.json` for scene validation.
- Build: updated root `tsconfig.json` to add `paths` mapping for `aurora-engine` and excluded `templates/minimal/src` from the root project to avoid strict-mode template errors.
- Template: minor fixes to `templates/minimal` and committed helper/generated artifacts for convenience (JS / `.d.ts` files) to make the demo easier to run out-of-the-box.
- CI: updated workflow and minor fixes to `scripts/scene-lint.js`.
- Package: updated `package.json`/`package-lock.json` to reflect toolchain and package changes.

## v6 — 2025-11-27

- Release: tag `v6` created; repository roadmap advanced through Phases 1–4.
- Roadmap: Phase 1 (Essentials), Phase 2 (Scene Editor v1.2), Phase 3 (Achievements/Gallery/Jukebox v1.3), and Phase 4 (Localization & Theming v1.4) are marked DONE in `ROADMAP.md` and `README.md`.
- Docs: added `docs/packaging-export.md`, `docs/scene-editor.md` updates and release checklist items; new tests for `textId` helpers.
- Housekeeping: refreshed lockfiles and formatting; removed tracked `node_modules` from the index.


