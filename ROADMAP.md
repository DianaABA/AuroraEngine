# AuroraEngine Roadmap

This roadmap outlines phased goals to evolve AuroraEngine from a minimal VN engine into a creator-friendly platform.

## Next Release — v0.0.5 (December 2025)

Focus: stability, DX polish, and packs baseline.

- P0: Dev UX stability
   - Fix `npm run build:ui` pipeline (tsconfig/tsup alignment, exports). DONE
   - Ensure `templates/minimal` `npm start` is reliable after root build. DONE
   - Cross-platform release notes generation (Windows/macOS/Linux). DONE
- P0: Minimal template hardening
   - Verify fresh-clone flow: `npm install` → `npm run build` → `cd templates/minimal && npm install && npm start`. DONE
   - Document the minimal template start/preview/build flows in README. DONE
- P1: Packs system (foundation)
   - Define pack manifest shape + loader API. DONE
   - Add packs.json to template + registry wiring (selector, load/view). DONE
   - Tests for basic pack resolution and switching (`tests/packs.spec.ts`, `tests/packs.switch.spec.ts`, `tests/packs.manifest.spec.ts`). DONE
   - CI: packs manifest validator (`scripts/validate-packs-manifest.js`). DONE
- P1: Docs & onboarding
   - “Play & Explore” quickstart for non-coders. DONE (template README: non-coder path)
   - Document packs.json usage + CI validation. DONE (template README; CI validator script)
   - Add short video/gif loop showing Start → Save → Gallery. TODO (Upload to YouTube: https://www.youtube.com/@BugQueenFlow)
- P2: Observability
   - Light event inspector overlay (subscribe to `eventBus`, filter by prefix). TODO
   - Hook basic counters to `metrics` for choices/steps/music changes. TODO

- P2: Packaging & hooks
   - Trim npm package contents (ship `dist` + UI `dist` + schema; exclude `src`). DONE
   - Adopt Husky v9 best practices (`prepare: husky`, pre-commit/pre-push hooks). DONE
   - `npm publish --dry-run` passes; actual publish deferred pending auth. TODO

Deliverable: v0.0.5 tag, changelog entry, green CI, template verified end-to-end.

## Status — v0.0.5 (2025-12-01)

- Engine
   - Strict scene loader supports `dialogue.textId` and choice `textId`; JSON Schema updated and exported.
   - Packs linter made Windows-safe; cross-platform import via file URL.
   - Packs manifest validator added to CI; scenes lint strictly via schema + link checks.
   - Tests expanded and green (26 files / 58 tests locally).
- Template (minimal)
   - Split welcome (Storytellers vs Developers) with Mode reopen and fail-safes.
   - Lightweight scene editor slice (inline edit, reorder, strict lint, branch map) available in template.
   - Deterministic installs (template lockfile) and esbuild mismatch resolved in CI.
- CI/Release
   - Release upsert (avoid duplicate tag failures); Windows-safe build/lint steps.
   - Template build validated in CI; artifacts verified.
   - Package trimmed for publish (removed `src` from files; included `LICENSE`).
   - Husky v9 enabled with `pre-commit` (typecheck + packs lint + manifest validate) and `pre-push` (tests).
   - Publish readiness: tarball validated; publish deferred (npm login/token pending).
- Docs
   - `docs/scene-format.md` updated (text vs textId; spriteDefaults).
   - Template README expanded (packs manifest, editor walkthrough, deploy buttons).
   - Pending: short video/gif for Start → Save → Gallery.

## Milestone — v0.1.0 (Q1 2026)

Focus: creator-first workflow and ecosystem starters.

- Scene editor thin slice
   - Reorder steps, inline edit, schema+link checks, simple errors. TODO
- Starters
   - Publish Expo/Electron starter repos with deploy buttons + CI. TODO
   - Optional CLI to scaffold a new VN from template (name, id). TODO
- Internationalization
   - String table pipeline guidance; RTL sanity checks in template. TODO
- Observability & quality
   - Event/metrics viewer page for debugging author flows. TODO
   - Release guardrails: `release:check` gating, canary notes. TODO

Success criteria: template + editor + packs provide a smooth “create → play → share” loop.

## Milestone — v0.1.1 (Q2 2026)

Focus: AI Assistant GA, observability, and starter distribution.

- Aurora Assistant GA
   - BYOK proxy hardened: retry/backoff, rate-limit banners, model allowlist stored in repo.
   - Local model UX: download progress, size warnings, cache controls, fallback heuristics.
   - Editor integration: “Ask Aurora” pane with JSON-auto-validate and auto-apply toggles.
   - Safety: max tokens/stream guards; schema-guided generation modes; redaction of API headers in logs.
- Observability v1
   - Event inspector overlay with pause/play, filter (prefix), and quick-export.
   - Metrics counters page (choices taken, scenes visited, autos triggered, time-in-scene).
- Starters publish
   - Publish Expo and Electron starters to separate repos with CI and deploy buttons.
   - Add CLI `aurora create` to scaffold from template with name/id.
- Docs & Media
   - Short demo video (Start → Save → Gallery), assistant help flows, BYOK instructions.
   - Troubleshooting: local model cache issues, provider errors.

Success criteria: Assistant usable end-to-end with clear guardrails; starters install and run via documented commands.

## Work Streams — 6–8 Weeks

- AI UX polish: streaming resilience, cancel, error fallbacks; JSON salvage flow.
- Editor improvements: branch map mini-graph, inline tooltips, reorder UX refinements.
- Packs ecosystem: sample packs curation, manifest best practices, validator evolution.
- Release hygiene: publishConfig.registry, `release:check` CI gate, dry-run with token.
- Marketing: concise homepage section, README badges, GIF loops, tutorial index.

## Implementation Checklist (Next Sprint)

- Assistant
   - Ship `/assistant/api` proxy (stateless), guards, unit tests.
   - UI streaming component with cancel/retry, provider/model badges.
   - JSON schema-driven generation modes, strict validation with friendly diffs.
- Observability
   - Event overlay (subscribe to `eventBus`), filter controls, pause/resume.
   - Metrics counters wired to `metrics` module; simple export.
- Starters
   - Publish Expo/Electron repos; add deploy buttons; CI builds.
   - CLI scaffolder in `scripts/` with name/id prompts.
- Docs
   - Update quickstart paths (non-coder vs dev), Assistant guide, BYOK/local setup.
   - Record demo and add `templates/minimal/public/media/demo.gif`.
- Creator tooling & persistence
   - Ship the `aurora convert` / script loader CLI (and template wiring) so the README script workflow is viable, with tests + docs picker.
   - Expand the remote AI adapter/UI to expose the advertised behavior modeling and story structure coaching helpers (new prompts, schema guidance, UI controls for those flows).
   - Finish the save/load persistence path (engine snapshot ↔ localStorage UI buttons/docs) so snapshots advertised in the feature list can be created, listed, and restored end-to-end.

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
- Drag-and-drop asset folder (DONE in minimal template)
- Template project (DONE: minimal template)
- “Write scene” AI prompt examples (DONE: docs/ai-prompts.md)
- “Fix my error” AI prompt guide (DONE: docs/ai-prompts.md, docs/prompt-fix-errors.md)
- GitHub Codespaces or StackBlitz starter (DONE: StackBlitz link in template README)
- One-click Netlify deploy button (DONE in template README)

## PHASE 4 — Bonus Systems

Goal: Close the gap to Ren’Py-lite.

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

## TL;DR — Creator-Friendly Checklist

✔ Easy file structure
✔ Simple scene language
✔ Docs written like oxygen: required and calm
✔ Templates, starter kits, prompt packs
✔ One-click deploy
✔ Clear examples
✔ Teaching-first approach
✔ Branding tied to Aurora’s universe (cow, squirrel, vibes)

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
   - DONE: Assets demo pack (shows assetsBaseUrl usage).
   - TODO: Add BYOK demo scene with placeholders and guardrails.
4) Packaging & Starter
   - DONE (stubs): Expo starter (`starters/expo/App.js`), Electron starter (`starters/electron/main.js`) linked in docs.
   - TODO: Publish full starter repo (`aurora-engine-starter`) with CI/deploy buttons; optional CLI to copy template, set project name, install deps.
5) Release Hygiene
   - Keep `release:check` in CI; add AI adapter mock tests.
   - Quick pre-release run: textId/RTL/theme toggle sanity, AI generate to editor with mock adapter.

## Next Up (December 2025)
1) Split welcome polish
   - DONE: Hover states/animations and Docs link on Developer side.
   - TODO: Optional background imagery for each side.
2) Editor usability
   - DONE: Inline validation tooltips, field highlights, reorder hint, and “Lint & Run” button.
3) AI UX hardening
   - DONE: Rate-limit/error badges and cancel UX; indeterminate progress bar.
   - DONE: Automated decisions — auto-switch BYOK when key present; infer provider from `aiBaseUrl`; optional auto-apply or auto-run JSON replies (prefs).
   - TODO: Local model download/progress indicator.
4) Reference starters
   - Publish full Expo/Electron starter repos and link from docs; add deploy buttons where possible.
5) Release guardrails
   - DONE: Package size hygiene; Husky v9 hooks.
   - TODO: Add `publishConfig.registry` to `package.json` and CI check for `NPM_TOKEN` with `npm publish --dry-run`.
6) Docs & media
   - DONE: README wired for demo GIF; PowerShell `scripts/make-demo-gif.ps1` added; media folder scaffolded.
   - TODO: Record short MP4 and generate `templates/minimal/public/media/demo.gif`.

7) Professional Standards
   - DONE: Docs — `docs/standards/engine-design.md`, `docs/standards/scene-conventions.md`, `docs/standards/save-format.md`; ADR `docs/adr/0001-scene-schema-versioning.md`.
   - DONE: Code — optional save metadata helper `withSaveMetadata` and snapshot `saveVersion` support; alias normalization (`jump/show/hide/bg`).

## Long-Term — Aurora Assistant (built-in AI helper)

MVP goals: answer authoring questions, explain errors, and suggest scene JSON with safety and privacy by default (no server-side key storage).

- Phase 0: Prep & Structure
   - Create `/assistant/{api,components,prompts,config}` (kept out of npm package).
   - Decide transport: BYOK over a stateless proxy (no key storage) + Local model fallback via `@mlc-ai/web-llm`.
   - Non-goals: storing keys server-side; retaining user data/logs.

- Phase 1: System Prompt
   - `/assistant/prompts/system-prompt.txt` with style, scope, safety rails, examples specific to Aurora (scene schema, packs, textId/RTL).
   - Include JSON-only answer modes for “generate scene” tasks with schema hints.

- Phase 2: API Proxy (BYOK)
   - `/assistant/api/aurora-assistant.ts`: Node 20 serverless handler; accepts `x-openai-key` header, forwards to provider, streams back; no persistence.
   - Rate/size guards: token caps, timeouts, model allowlist, redact headers in logs.
   - Config: `publishConfig.registry` unchanged; assistant code excluded from package `files`.
   - Dev: Vite proxy for `/api/*` to Vercel dev via `ASSISTANT_API_TARGET`.

- Phase 3: Minimal Chat UI
   - `/assistant/components/ChatBox.tsx`: message list, input, send, stop; streaming UI; copy button; error state.
   - Cost cues: token counter approximation; model selector (local/BYOK presets).

- Phase 4: Test & Triage Pack
   - Golden Q&A: choices, backgrounds, scene format, missing IDs, RN integration.
   - JSON validation: responses parsed against the exported schema; friendly diffs on failure.

- Phase 5: Branding & Polish
   - `assistant.css`: glass, neon teal/purple, BugQueen Flow styling; light/dark.

- Phase 6: Deploy
   - Vercel/Netlify serverless; BYOK only; costs ≈ €0.01–€0.50/mo at low usage.
   - Docs include “no key stored” and troubleshooting.

- Phase 7: Enhancements
   - Context injection (scene upload), page-aware help, scene fixer, error explainer, AI-generated examples.

- Phase 8: Editor Integration
   - “Ask Aurora” button in the template editor reusing the same API surface.

MVP acceptance criteria:
- BYOK requests proxied without storing keys; local model fallback works.
- Can answer top-10 author questions and produce schema-valid scene JSON for samples.
- Streaming UI with cancel/stop; errors are actionable.

---

# 🚀 Strategic Elevation Plan — Solo Developer Path

This section outlines strategic priorities and tactical execution for accelerating AuroraEngine's market position as a solo developer. Focus: **60% AI Platform, 20% Distribution, 10% Polish, 10% Marketing**.

## 🎯 Competitive Analysis

### Current State
- **Phase 1-4**: 80% complete ✅
- **Test Coverage**: 58 tests, CI/CD operational
- **Architecture**: Solid foundations, professional standards
- **Differentiator**: AI-powered creation (partially implemented)

### Market Position vs. Competitors

| Feature | Aurora | Ren'Py | Naninovel | TyranoScript | Ink |
|---------|--------|--------|-----------|--------------|-----|
| Web-Native | ✅ | Export only | Export only | ✅ | Partial |
| React/RN Ready | ✅ | ❌ | ❌ | ❌ | Partial |
| AI Assistant | 🟡 In Progress | ❌ | ❌ | ❌ | ❌ |
| No-Code Path | ✅ | DSL required | Unity required | ✅ | DSL required |
| Open Source | ✅ MIT | ✅ | ❌ Paid | ✅ | ✅ |
| Mobile Native | ✅ RN | ❌ | Unity | ❌ | Partial |
| Maturity | 🟡 v0.0.5 | ✅ Mature | ✅ | ✅ | ✅ |

**Unique Value Proposition**: Only modern web-native VN engine with AI-powered creation and React Native support.

---

## 📅 Elevation Timeline — Solo Developer Focus

### Q4 2025 (December) — v0.0.5 ✅ Stabilization Phase
**Status**: ON TRACK (stabilization + packs baseline)

Priorities:
- ✅ Core stability (DX polish, cross-platform)
- ✅ Packs system foundation
- ✅ Scene editor lightweight slice
- ⏳ Demo video/GIF recording
- ⏳ npm publish execution (token setup)

---

### Q1 2026 (Jan-Mar) — v0.1.0 → v0.2.0 🎯 AI PLATFORM COMPLETION
**Focus**: 60% effort — Complete Aurora Assistant MVP (our moat)

#### Priority 1: Aurora Assistant Deployment (Weeks 1-4)
**Impact**: CRITICAL — Primary differentiator from all competitors

Tasks:
1. **Week 1-2: Serverless API Deployment**
   - Deploy `/assistant/api/aurora-assistant.ts` to Netlify/Vercel
   - Configure BYOK stateless proxy (no key storage)
   - Add rate limiting + token caps + model allowlist
   - Test with OpenAI/Anthropic/Groq/DeepSeek endpoints
   - Deliverable: Live API endpoint accepting `x-openai-key` header

2. **Week 2-3: Local AI Integration**
   - Complete WebLLM model download UI with progress indicator
   - Add model size/cache warnings
   - Test offline mode with quantized models
   - Fallback behavior when local model unavailable
   - Deliverable: Fully functional local AI mode (no keys required)

3. **Week 3-4: Chat UI Polish**
   - Integrate ChatBox component into template
   - Add streaming JSON validation UI
   - "Try Fix" flow for partial JSON
   - Cost estimation display (token counter)
   - Cancel/stop controls
   - Deliverable: Polished in-editor assistant experience

4. **Week 4: AI Feature Suite**
   - Scene Generator: Natural language → validated JSON
   - Dialogue Enhancer: Tone/emotion/pacing polish
   - Error Explainer: User-friendly validation messages
   - Test with 10 common creator scenarios
   - Deliverable: 3 core AI features production-ready

**Success Metrics**:
- ✅ BYOK mode works with 4+ providers
- ✅ Local AI generates valid scene JSON offline
- ✅ Streaming UI handles errors gracefully
- ✅ 80%+ success rate on scene generation prompts

#### Priority 2: Distribution Foundations (Weeks 5-8)
**Focus**: 20% effort — Get into creators' hands

Tasks:
1. **Week 5: npm Publish**
   - Add `NPM_TOKEN` to CI
   - Run `npm publish --dry-run` validation
   - Publish v0.1.0 to npm registry
   - Update install docs with npm path
   - Deliverable: `npm install aurora-engine` works globally

2. **Week 6: Expo Starter Completion**
   - Flesh out `starters/expo/` from stub to full example
   - Add scene loading, save/load, basic UI
   - Deploy buttons for Expo Go + EAS
   - Test on iOS/Android devices
   - Deliverable: Published `aurora-engine-expo-starter` repo

3. **Week 7: Electron Starter Completion**
   - Complete `starters/electron/` with build scripts
   - Add Steam integration notes (achievements API)
   - Package for Windows/macOS/Linux
   - Deliverable: Published `aurora-engine-electron-starter` repo

4. **Week 8: Demo Video Production**
   - Execute `scripts/make-demo-gif.ps1`
   - Record "Your First VN in 5 Minutes" walkthrough
   - Show: Start → AI Generate → Edit → Play → Deploy
   - Upload to YouTube (channel: https://www.youtube.com/@BugQueenFlow) + embed in README
   - Generate demo.gif for template
   - Deliverable: High-quality demo video + GIF

**Success Metrics**:
- ✅ Package on npm with 50+ weekly downloads
- ✅ Expo starter works on real devices
- ✅ Electron builds for 3 platforms
- ✅ Demo video gets 500+ views in first month

#### Priority 3: Marketing Foundation (Weeks 9-12)
**Focus**: 10% effort — Build awareness

Tasks:
1. **Week 9-10: Landing Page v1**
   - Domain: bugqueenflow.com/aurora-engine (or auroraengine.dev)
   - Sections: Hero (demo video), Features, Use Cases, Quick Start, Showcase
   - Deploy to Netlify/Vercel
   - Add Deploy to Netlify button
   - Deliverable: Live landing page with demo embedded

2. **Week 11: Community Setup**
   - Create GitHub Discussions (enable on repo)
   - Set up Discord server (optional, low priority)
   - Reddit posts: r/visualnovels, r/gamedev, r/reactnative
   - Twitter/X account: @AuroraEngine_VN
   - Deliverable: Active community channels

3. **Week 12: Beta Tester Outreach**
   - Identify 10-15 target users (writers, educators, indie devs)
   - Personalized outreach with free access + support
   - Collect feedback on AI features specifically
   - Iterate based on feedback
   - Deliverable: 5+ creator testimonials

**Success Metrics**:
- ✅ Landing page live with 100+ unique visitors/week
- ✅ 3 community channels active
- ✅ 5+ beta testimonials collected

#### Priority 4: Polish (Ongoing)
**Focus**: 10% effort — Fix critical issues only

- Inline validation error improvements
- AI streaming performance optimization
- Template load time optimization
- Mobile responsive fixes
- Accessibility (keyboard navigation, ARIA labels)

**Principle**: No new features. Fix blockers only.

---

### Q2 2026 (Apr-Jun) — v0.3.0 → v0.4.0 🎯 ECOSYSTEM EXPANSION
**Focus**: Distribution + Creator UX

#### Month 1 (April): Premium Templates
1. **Romance VN Template** ($15-30 one-time)
   - Pre-built character sprites (Midjourney generated)
   - 5 sample scenes with branching
   - Custom UI theme (pink/purple palette)
   - Music pack (3-5 Suno tracks)
   - Gumroad/itch.io listing

2. **Educational Template** (Free/donation)
   - Quiz-based branching
   - Progress tracking
   - Certificate generation
   - Ideal for teachers/trainers

**Deliverable**: 2 templates available for purchase/download

#### Month 2 (May): Asset Packs
1. **Character Sprite Pack #1** ($10-20)
   - 3 characters × 5 expressions each
   - Midjourney prompts included
   - PSD source files
   - Commercial license

2. **Background Pack #1** ($10-20)
   - 10 locations (school, cafe, park, etc.)
   - Day/night variants
   - High-res (1920x1080)

**Deliverable**: 2 asset packs on Gumroad/itch.io

#### Month 3 (June): CLI Tool + Advanced Features
1. **CLI Scaffolding Tool**
   - `npx create-aurora-vn my-story`
   - Interactive prompts (project name, template choice)
   - Auto-install dependencies
   - Git init + first commit
   - Deliverable: Published `create-aurora-vn` on npm

2. **Itch.io Integration**
   - Build script for itch.io HTML5 export
   - Branding customization
   - Upload guide
   - Deliverable: Itch.io export guide in docs

3. **Performance Optimization**
   - Asset lazy loading (images/audio)
   - Scene streaming (on-demand loading)
   - Bundle splitting (template optimization)
   - Deliverable: 30%+ faster load times

**Success Metrics**:
- ✅ $200+ revenue from templates/assets
- ✅ CLI installed 100+ times
- ✅ 5+ games published on itch.io using Aurora

---

### Q3 2026 (Jul-Sep) — v0.5.0+ 🎯 SCALE & ENTERPRISE
**Focus**: Enterprise features + Large-scale projects

#### Month 1 (July): Observability Dashboard
1. **Event Inspector**
   - Real-time event stream viewer
   - Filter by prefix (vn:*, music:*, gallery:*)
   - Export logs for debugging
   - Deliverable: Inspector panel in template

2. **Metrics Dashboard**
   - Player analytics: playtime, choices, popular paths
   - Creator insights: completion rate, drop-off points
   - A/B testing support (choice weights)
   - Deliverable: Metrics viewer page

#### Month 2 (August): Cloud Features
1. **Cloud Saves (Optional)**
   - Firebase/Supabase integration guide
   - Cross-device sync
   - Optional feature (local-first by default)
   - Deliverable: Cloud saves integration docs

2. **Multiplayer Prep**
   - Collaborative editing research
   - Shared story viewing
   - Comment system on scenes
   - Deliverable: Architecture plan (no implementation yet)

#### Month 3 (September): Large Story Support
1. **Optimization for 100+ Scenes**
   - Scene pagination
   - Lazy scene loading
   - Save compression (LZ-string)
   - Memory profiling
   - Deliverable: Support for 500+ scene projects

2. **Enterprise Features**
   - Team workspace (multi-creator)
   - Version control integration (git-based)
   - White-label branding options
   - Export to SCORM (LMS compatibility)
   - Deliverable: Enterprise feature set documented

**Success Metrics**:
- ✅ Supports 500+ scene projects without performance issues
- ✅ 2+ enterprise inquiries (B2B training/education)
- ✅ Cloud saves tested with 1000+ users

---

### Q4 2026 (Oct-Dec) — v1.0.0 🎯 PUBLIC LAUNCH
**Focus**: Marketing campaign + Educational partnerships

#### Month 1 (October): Content Marketing
1. **Udemy Course**: "Build Visual Novels with AI"
   - 10-hour course covering Aurora + AI tools
   - Midjourney for art, Suno for music
   - Pricing: $49.99 (frequent sales)
   - Deliverable: Published course on Udemy

2. **YouTube Series**: "Aurora Engine Tutorials" (publish on https://www.youtube.com/@BugQueenFlow)
   - 10 videos (5-10 min each)
   - Beginner to advanced
   - Deliverable: 10 tutorial videos published

#### Month 2 (November): Launch Campaign
1. **ProductHunt Launch**
   - Prepare assets (logo, screenshots, demo)
   - Schedule launch day
   - Coordinate with beta testers for upvotes
   - Target: Top 5 Product of the Day

2. **Press Outreach**
   - GameDev blogs (Gamasutra, IndieDB)
   - React/web dev blogs (Dev.to, CSS-Tricks)
   - AI tool roundups (Product Hunt, Indie Hackers)
   - Deliverable: 5+ press mentions

#### Month 3 (December): v1.0 Release
1. **Stable API Lock**
   - Semantic versioning commitment
   - Deprecation policy
   - Migration guides
   - Deliverable: v1.0.0 release notes

2. **Showcase Gallery**
   - 20+ community VNs featured
   - Creator spotlights
   - Monthly showcase newsletter
   - Deliverable: Live showcase page

**Success Metrics**:
- ✅ 1000+ GitHub stars
- ✅ 5000+ npm downloads
- ✅ 100+ community-created VNs
- ✅ $1000+/month revenue (templates/courses)

---

## 🎯 Target Personas & Marketing Angles

### Primary Personas

1. **"The Aspiring Writer"** (40% of users)
   - Story ideas but no coding skills
   - Willing to learn simple tools
   - Marketing angle: "Turn your story into an interactive experience — no coding required"

2. **"The Educator"** (30% of users, high-value)
   - Teachers, trainers, course creators
   - Need engaging content delivery
   - Marketing angle: "Transform lessons into interactive learning experiences"

3. **"The Indie Dev"** (20% of users, technical)
   - React/RN developers
   - Want VN features without building from scratch
   - Marketing angle: "Drop-in VN engine for your React app"

4. **"The Corporate Trainer"** (10% of users, B2B potential)
   - HR, onboarding, compliance teams
   - Need scenario-based training
   - Marketing angle: "Build interactive training simulations in hours, not weeks"

### Marketing Positioning

1. **"The Midjourney of Visual Novels"**
   - AI-first creation workflow
   - Natural language → playable game
   - Democratizes VN creation

2. **"React Native for Stories"**
   - Modern web tech stack
   - Deploy everywhere (web, iOS, Android, desktop)
   - Developer-friendly API

3. **"Your Story, Alive"**
   - Emotional branding tied to Aurora universe
   - Creator empowerment
   - Community-driven

---

## 💰 Monetization Strategy (18-24 Month Horizon)

### Revenue Streams

1. **Templates & Asset Packs** (Months 6-12)
   - Premium templates: $15-30 each
   - Asset packs: $10-20 each
   - Target: $500-1000/month by Month 12

2. **Udemy Course** (Month 12+)
   - Price: $49.99 (avg. sale $12-15)
   - Target: 500 enrollments in Year 1 = $6000-7500

3. **Managed Hosting** (Future - Month 18+)
   - White-label platform for educators/enterprises
   - Pricing: $15-50/month per workspace
   - Target: 20 customers = $300-1000/month

4. **Enterprise Support** (Future - Month 18+)
   - Custom development, priority support
   - Pricing: $2000-5000 per engagement
   - Target: 2-3 deals/year = $4000-15000

**Total Revenue Projection (Year 2)**:
- Templates/Assets: $12,000
- Courses: $7,500
- Hosting: $6,000
- Enterprise: $10,000
- **Total**: ~$35,000/year (solo developer, sustainable)

### Costs
- Domain/hosting: $100/year
- Tools (Figma, analytics): $300/year
- Marketing (ads, occasional): $500/year
- **Total**: ~$1000/year

**Net Profit**: ~$34,000/year while keeping core product free & open source.

---

## ⚡ 30-Day Quick Wins (Immediate Actions)

### Week 1: Foundation
- ✅ Complete npm publish (add `NPM_TOKEN` to CI, publish v0.0.5)
- ✅ Record demo video using `scripts/make-demo-gif.ps1`
- ✅ Deploy Aurora Assistant API to Netlify/Vercel (stateless BYOK proxy)

### Week 2: Distribution
- ✅ Publish Expo starter repo with full example
- ✅ Publish Electron starter repo with build scripts
- ✅ Create landing page v1 (single page, demo video embedded)

### Week 3: Marketing
- ✅ Set up GitHub Discussions
- ✅ Reddit posts (r/visualnovels, r/gamedev)
- ✅ Twitter/X account creation
- ✅ Reach out to 5 beta testers

### Week 4: Premium Content
- ✅ Create Romance VN template (first premium product)
- ✅ Set up Gumroad account for sales
- ✅ Document template creation workflow for future

**Deliverables After 30 Days**:
- Live npm package
- Demo video on YouTube
- AI Assistant API deployed
- 2 starter repos published
- Landing page live
- 1 premium template for sale
- 5 beta testers engaged

---

## 📊 Success Metrics by Quarter

### Q1 2026 (AI Platform)
- ✅ AI Assistant deployed and functional
- ✅ 100+ npm weekly downloads
- ✅ 10+ beta testimonials
- ✅ Demo video 500+ views

### Q2 2026 (Ecosystem)
- ✅ $200+ revenue from templates/assets
- ✅ CLI tool installed 100+ times
- ✅ 5+ games published on itch.io
- ✅ 500+ GitHub stars

### Q3 2026 (Scale)
- ✅ Support for 500+ scene projects
- ✅ 2+ enterprise inquiries
- ✅ 1000+ npm weekly downloads
- ✅ 20+ community VNs showcased

### Q4 2026 (Launch)
- ✅ 1000+ GitHub stars
- ✅ 5000+ total npm downloads
- ✅ 100+ community-created VNs
- ✅ $1000+/month sustainable revenue
- ✅ v1.0.0 stable release

---

## 🎓 Strategic Principles (Solo Developer Mode)

### Do More Of ✅
- **AI integration** — Your killer feature, unique in market
- **Creator-first docs** — Already excellent, maintain quality
- **Professional standards** — Sets you apart from hobby projects
- **Cross-platform focus** — React Native is a major advantage

### Do Strategically 🎯
- **Feature additions** — Only if they strengthen AI/creator workflow
- **Community building** — Focus on quality over quantity (10 active users > 100 lurkers)
- **Marketing** — Content marketing (tutorials, showcases) over paid ads

### Avoid ⚠️
- **Feature creep** — Stay focused on AI differentiation
- **Perfectionism** — Ship AI MVP even if rough, iterate based on feedback
- **Building everything** — Use 3rd-party integrations (Firebase for cloud, Gumroad for sales, etc.)
- **Competing on features** — Ren'Py has 20 years of features; compete on AI + modern tech

### Time Allocation (Weekly)
- **60% AI Platform** (24 hours) — Assistant, scene generation, dialogue polish
- **20% Distribution** (8 hours) — Starters, templates, docs, npm/itch.io
- **10% Polish** (4 hours) — Critical bug fixes, UX blockers
- **10% Marketing** (4 hours) — Content creation, community engagement, outreach

---

## 🔮 18-24 Month Vision: "The Canva of Visual Novels"

### Platform Evolution
- AI-first creation workflow
- Template marketplace (community-driven)
- One-click publishing to web/mobile/desktop
- Community showcase gallery
- Revenue sharing for premium creators
- Mobile app builder (low-code editor)

### Business Model
- Freemium SaaS platform (core free, advanced features paid)
- Template/asset marketplace (20% platform fee)
- Managed hosting for educators/enterprises
- White-label licensing for corporations
- Educational institution site licenses

### Market Opportunity
- **Indie VN Creators**: 50K-100K (growing with AI democratization)
- **Educators**: 500K+ (demand for interactive content)
- **Corporate Training**: $300B+ market globally
- **React Developers**: 15M+ (potential VN integration users)

### Exit Strategy (Optional)
- Acquisition targets: Adobe (Creative Cloud), Canva, Unity, Epic Games
- Valuation potential: $5-10M at scale (10K+ active creators, sustainable revenue)
- Alternative: Sustainable lifestyle business ($50-100K/year profit solo)

---

## 🚀 Why Aurora Will Win

### Competitive Advantages
1. **AI-First Creation** — 2-3 years ahead of competitors
2. **Modern Web Stack** — React/RN native, not a legacy Python app
3. **No-Code + Pro-Code** — Serves both creators and developers
4. **Cross-Platform Native** — Web, iOS, Android, desktop from one codebase
5. **Open Source Core** — Community trust, educational appeal, viral growth potential
6. **Privacy-First AI** — Local mode free, BYOK (no subscription lock-in)

### Market Timing
- **AI tools democratizing creation** — Midjourney, Suno, ChatGPT make asset creation accessible
- **React Native maturity** — 15M+ developers, proven at scale (Instagram, Discord, etc.)
- **Interactive content demand** — Education, training, marketing all need engagement
- **Creator economy boom** — People want to build, share, monetize their stories

**Bottom Line**: AuroraEngine is positioned to become the **standard tool for AI-powered interactive storytelling** — if we execute on the AI platform (Q1 2026) and distribution (Q2 2026).

The engine is 80% complete. The next 6 months determine market leadership.

