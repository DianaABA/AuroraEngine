# AuroraEngine Roadmap

This roadmap outlines phased goals to evolve AuroraEngine from a minimal VN engine into a creator-friendly platform.

## Status â€” v0.0.4 (2025-11-19)

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

## PHASE 1 â€” The Essentials

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

## PHASE 2 â€” Script Language / JSON Scene Files

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

## PHASE 3 â€” Tools for Non-Coders

Goal: Make the engine usable by Udemy students, writers, yoga teachers, and the occasional confused accountant.

Tools:
- Drag-and-drop asset folder (DONE in minimal template)
- Template project (DONE: minimal template)
- â€œWrite sceneâ€ AI prompt examples (DONE: docs/ai-prompts.md)
- â€œFix my errorâ€ AI prompt guide (DONE: docs/ai-prompts.md, docs/prompt-fix-errors.md)
- GitHub Codespaces or StackBlitz starter (DONE: StackBlitz link in template README)
- One-click Netlify deploy button (DONE in template README)

## PHASE 4 â€” Bonus Systems

Goal: Close the gap to Renâ€™Py-lite.

Add:
- Character expression switching (DONE via spriteSwap/expressions)
- CG gallery unlocks (DONE in minimal template)
- Achievement/badge system (DONE in minimal template)
- Audio jukebox (DONE via Jukebox utility)
- Simple transitions (zoom, shake, flash) (DONE)
- Auto-mode / skip (DONE: autoAdvance/autoDecide + Skip Seen Text)
- Quick-save & quick-load (DONE: quicksave + slots)
- Backlog panel and seen-line tracking (DONE)
- Settings: Skip Seen Text, Skip Transitions (DONE)
- Codex / Logbook with categories and search (DONE: codex with filters/pins/favs)
- i18n for core UI (en/es) (DONE)
- Sprite positioning (pos/x/scale/z) and depth/opacity transitions (DONE)

Docs:
- docs/achievements.md
- docs/jukebox.md

## PHASE 5 â€” Branding + Public Launch

Goal: Make creators WANT to use it.

- Website landing page (bugqueenflow.com/engine)
- Example VN demo
- Video intro: â€œYour First VN in 15 Minutesâ€
- Udemy course integration
- ZTM-friendly contributor page
- â€œBe a Cow. Go For Your Dreams.â€ footer

## PHASE 6 â€” Expansions

Goal: Turn it from â€œniceâ€ into â€œoh damn.â€

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
- DONE

2) Saves UX
- Slot rename and delete with confirm; surface last scene/line meta
- DONE

3) Sprite motion v2
- Add vertical `y%` and easing presets (e.g., `easeOutBack`)
- Optional per-step `moveTo: { x?, y?, ms?, ease? }` authoring alias
- DONE

4) Validation strict mode
- Zod/schema option returning structured errors; author-friendly messages
- DONE: strict validator now emits structured errors (path segments + sceneId) for tooling

5) Codex polish
- Favorites pinning and per-category counts; simple filter chips
- DONE

6) Release/CI
- Automated release notes from CHANGELOG; basic canary tag
- DONE: CI builds UI + template; release builds UI and generates notes/canary tag

## TL;DR â€” Creator-Friendly Checklist

âœ” Easy file structure
âœ” Simple scene language
âœ” Docs written like oxygen: required and calm
âœ” Templates, starter kits, prompt packs
âœ” One-click deploy
âœ” Clear examples
âœ” Teaching-first approach
âœ” Branding tied to Auroraâ€™s universe (cow, squirrel, vibes)

## Proposed Release Track (post-0.0.4)

Phase 0: Stabilize Core (v0.9 -> v1.0)
- Lock public API; mark internals; finalize scene schema v1 + JSON Schema + lint.
- Core tests on branching, save/restore, expressions; README + dev-start-here.
- Deliverable: 1.0.0 npm package; templates/minimal as starter.
- DONE: JSON Schema export + scene lint in CI; dev-start-here/API surface doc shipped.

Phase 1: Creator Comfort (v1.1)
- DONE: Error overlay in browser demo with friendly messages; example packs (branching/expressions/CG/achievements).
- DONE: Docs: writer vs developer start pages; non-coder flow (Docs -> JSON via AI -> lint -> run).
- DONE: Smooth polish pass on overlay copy/contrast and inline “Example pack” chooser description in template/README.

Phase 2: Scene Editor (v1.2) — DONE
- Minimal web editor (load/save JSON, reorder steps, inline edit, schema + lint).
- Timeline/branch map: list + SVG mini-graph with broken-link badge/hover tooltips.

Phase 3: Achievements/Gallery/Jukebox (v1.3) — DONE
- Data shapes finalized and demoed; query APIs/event hooks in place; data-driven unlocks (no hard-coded logic).

Phase 4: Localization & Theming (v1.4) — DONE
- String tables/textId maps with locale fallback; RTL support; theme toggle (Night/Sand) via CSS vars.

Phase 5: Packaging & Export (v1.5+)
- Guides for Netlify/Vercel/GitHub Pages; reference Electron/Tauri repo.
- Optional CLI to copy template, install deps, set project name.

## AI Helper Modes (Planned Rollout)
- 🟩 Mode 1 — Local AI (free/offline): browser inference (WebLLM/Transformers.js, tiny quantized models). Features: script→scene JSON, grammar/typo fix, missing-field detection. No keys, no data leaves device.
- 🟦 Mode 2 — BYOK (OpenAI/Anthropic/Groq/DeepSeek/compat): premium dialogue/branching/emotion tagging/scene polish; keys in localStorage only.
- Why: free path for beginners; zero infra cost; high-quality path for advanced users without storing keys server-side.

## New Roadmap (next iteration)
1) AI UX & Safety
   - DONE: Provider/model selector (local model configurable; BYOK supports OpenAI-compatible, Anthropic/Groq/DeepSeek presets).
   - DONE: Streamed JSON incremental validation + “Try Fix” flow (partial salvage of partial JSON).
   - TODO: Error UI for rate limits, model download size/progress; cancel option.
2) AI Coverage
   - Tests: AI prefs persistence, adapter selection (mocked), validation fallback for textId/RTL.
   - Docs: provider options, streaming behavior, model size/cache notes.
3) Content Examples
   - DONE: RTL/textId example pack + dropdown option.
   - TODO: Add BYOK demo scene with placeholders and guardrails.
4) Packaging & Starter
   - DONE (stubs): Expo starter (`starters/expo/App.js`), Electron starter (`starters/electron/main.js`) linked in docs.
   - TODO: Publish full starter repo (`aurora-engine-starter`) with CI/deploy buttons; optional CLI to copy template, set project name, install deps.
5) Release Hygiene
   - Keep `release:check` in CI; add AI adapter mock tests.
   - Quick pre-release run: textId/RTL/theme toggle sanity, AI generate to editor with mock adapter.

## Next Up (now)
1) Block-based editor thin slice
   - Drag to reorder steps; inline lint-as-you-type; keep schema/link checks.
2) Reference starters
   - Publish full Expo/Electron starter repos and link from docs; add deploy buttons where possible.
3) AI UX hardening
   - Rate-limit/error badges; download/progress indicator for local models; tidy cancel UX.
4) Demo story spotlight
   - Add “How it was built” blurb + link to chakrahearts.netlify.app in docs/template.
5) Release guardrails
   - CI dry-run for npm publish token presence; versioning rule notes in release checklist.
6) Player-first simplification
   - Add a “Play & Explore” doc (non-tech quickstart: launch demo, switch packs, controls, save/load).
   - Relabel UI for plain language (“Start Scene” vs Build, “Story File” vs JSON); hide dev-only controls behind an “Advanced” toggle/accordion.
   - Keep only core packs in default view; move experimental/debug packs to Advanced.
   - Default debug HUD/toasts off; error overlay uses action text (“Fix”/“Load new”).
   - Prune legacy/outdated docs/scripts that reference old scene formats.

## Long-Term — Aurora Assistant (built-in AI helper)
- Phase 0: Prep — add OPENAI_API_KEY to .env, create `/assistant` folder with `api/`, `components/`, `prompts/`, `config/`.
- Phase 1: System prompt — `/assistant/prompts/system-prompt.txt` (step-by-step, examples, Aurora-only focus).
- Phase 2: Backend API — `/assistant/api/aurora-assistant.ts` (OpenAI GPT-4.1 Mini, loads system prompt, answers questions).
- Phase 3: Minimal chat UI — `/assistant/components/ChatBox.tsx` (input, messages, ask button).
- Phase 4: Test common questions — choices, backgrounds, scene format, missing ID, React Native integration; refine prompt.
- Phase 5: Branding/UI polish — assistant.css (glass, neon teal/purple, BugQueen Flow branding, Midjourney BG).
- Phase 6: Deploy — Vercel/Netlify/docs hosting; keep cost low (€0.01–€0.50/mo).
- Phase 7: Enhancements — context injection (scene upload), page-aware questions, scene fixer, error explainer, AI-generated examples.
- Phase 8: Editor integration — “Ask Aurora” button in the editor that calls the same API.


