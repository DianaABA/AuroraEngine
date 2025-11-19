# AuroraEngine Roadmap

This roadmap outlines phased goals to evolve AuroraEngine from a minimal VN engine into a creator-friendly platform.

## Status — v0.0.4 (2025-11-19)

- Engine:
  - Scene cross-link validation on `loadScenes` (fail fast on unknown `goto`)
  - Events: `vn:auto-choice`, `vn:auto-loop-guard` for auto/QA visibility
  - Transition kinds aligned (`fade|slide|zoom|shake|flash`)
  - `gameState:corrupt` now includes validation exception context
- Template (minimal):
  - Backlog, Settings (Skip Seen Text, Skip Transitions), Saves w/ thumbnails
  - Gallery, Achievements, Music controls, i18n (en/es)
  - Codex/Logbook with search, category filter, and entry detail view
  - Sprite positioning (pos/x/scale/z) with depth/opacity transitions
  - Smooth horizontal motion; per-step `moveMs`/`moveEase` hints
  - Debug toasts toggle; toasts for auto events in `#notifications`
- Docs/CI:
  - `docs/events.md` for engine events
  - Tests green (12 files / 27 tests); GitHub Actions enabled

## PHASE 1 — The Essentials

Goal: Create the minimum features to call it a VN engine.

Features:
- Dialogue system (who, what, how)
- Character sprites on/off
- Background switching
- Simple choices
- Music/sound playback
- Flags/variables
- Save/load
- Basic animations (fade, slide)

Docs:
- README.md with 5-minute tutorial
- CONTRIBUTING.md (newcomer-friendly)
- ISSUE_LABELS.md

## PHASE 2 — Script Language / JSON Scene Files

Goal: Let creators build a VN without touching React.

Create a scene format, like:

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

Engine loads scenes dynamically:
- Scene loader
- Interpreter
- Asset preloader

Docs:
- docs/scene-format.md

## PHASE 3 — Tools for Non-Coders

Goal: Make the engine usable by Udemy students, writers, yoga teachers, and the occasional confused accountant.

Tools:
- Drag-and-drop asset folder
- Template project
- “Write scene” AI prompt examples
- “Fix my error” AI prompt guide
- GitHub Codespaces or StackBlitz starter
- One-click Netlify deploy button

## PHASE 4 — Bonus Systems

Goal: Close the gap to Ren’Py-lite.

Add:
- Character expression switching
- CG gallery unlocks
- Achievement/badge system
- Audio jukebox
- Simple transitions (zoom, shake, flash)
- Auto-mode / skip
- Quick-save & quick-load
- Backlog panel and seen-line tracking
- Settings: Skip Seen Text, Skip Transitions
- Codex / Logbook with categories and search
- i18n for core UI (en/es)
- Sprite positioning (pos/x/scale/z) and depth/opacity transitions

Docs:
- docs/achievements.md
- docs/jukebox.md

## PHASE 5 — Branding + Public Launch

Goal: Make creators WANT to use it.

- Website landing page (bugqueenflow.com/engine)
- Example VN demo
- Video intro: “Your First VN in 15 Minutes”
- Udemy course integration
- ZTM-friendly contributor page
- “Be a Cow. Go For Your Dreams.” footer

## PHASE 6 — Expansions

Goal: Turn it from “nice” into “oh damn.”

Planned upgrades:
- Scene editor (lightweight)
- Drag-and-drop timeline
- Export to desktop (via Electron)
- Export to mobile (Capacitor)
- Community templates (romance, horror, comedy)
- Localization support
- Steam build template

## Near-Term Roadmap (Next Iteration)

1) Choice UX polish
- Keyboard navigation for options; visible default/auto indicator
- Emit/UI hint when auto-decide would pick an option

2) Saves UX
- Slot rename and delete with confirm; surface last scene/line meta

3) Sprite motion v2
- Add vertical `y%` and easing presets (e.g., `easeOutBack`)
- Optional per-step `moveTo: { x?, y?, ms?, ease? }` authoring alias

4) Validation strict mode
- Zod/schema option returning structured errors; author-friendly messages

5) Codex polish
- Favorites pinning and per-category counts; simple filter chips

6) Release/CI
- Automated release notes from CHANGELOG; basic canary tag

## TL;DR — Creator-Friendly Checklist

✔ Easy file structure
✔ Simple scene language
✔ Docs written like oxygen: required and calm
✔ Templates, starter kits, prompt packs
✔ One-click deploy
✔ Clear examples
✔ Teaching-first approach
✔ Branding tied to Aurora’s universe (cow, squirrel, vibes)
