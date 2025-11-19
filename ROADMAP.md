# AuroraEngine Roadmap

This roadmap outlines phased goals to evolve AuroraEngine from a minimal VN engine into a creator-friendly platform.

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

## TL;DR — Creator-Friendly Checklist

✔ Easy file structure
✔ Simple scene language
✔ Docs written like oxygen: required and calm
✔ Templates, starter kits, prompt packs
✔ One-click deploy
✔ Clear examples
✔ Teaching-first approach
✔ Branding tied to Aurora’s universe (cow, squirrel, vibes)
