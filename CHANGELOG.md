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
