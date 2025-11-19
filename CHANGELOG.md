# Changelog

All notable changes to this project are documented here.

## v0.0.1 — 2025-11-19

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
