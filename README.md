
1. **Download or clone this repo** (green "Code" button above)
 
---

## Who Is This For?

- Writers, solo devs, educators, students, and anyone who wants to make a visual novel or interactive story—no experience needed!

---

## More for Developers

If you want to extend, customize, or automate:

- Modular state system (flags, metrics, progression, storage monitor)
- Event bus for custom UI and analytics
- Expression evaluator for conditional logic
- Scene runner and save schema versioning
- CLI tools for previewing and linting scenes

See the rest of this README and `/docs` for advanced usage.

---

## Full Documentation
See the `/docs` folder for:
- Scene format and scripting
- Achievements, gallery, jukebox
- AI prompt examples
- Error fixing and non-coder helpers
- Scene linting and validation
- Sprite motion timelines

---

## Docs
- Scene format: `docs/scene-format.md`
- Achievements (draft): `docs/achievements.md`
- Audio Jukebox (draft): `docs/jukebox.md`
- CG Gallery (draft): `docs/gallery.md`
- AI prompt examples: `docs/ai-prompts.md`
- Error fix guide: `docs/prompt-fix-errors.md`
- Non-coder helpers: `docs/non-coder-tools.md`
- Scene lint: `npm run scenes:lint -- --file scenes/example.json`
- Sprite motion timelines (draft): `docs/timelines.md`
- Lightweight Scene Editor (template): `docs/scene-editor.md`
- Packaging/Export: `docs/packaging-export.md`
- UI kit (prototype): `packages/ui/README.md`

- Changelog: `CHANGELOG.md`
 - Expressions: `docs/expressions.md`

---

## Template (Browser Demo)

Minimal Vite starter lives in `templates/minimal`.

Local run:

```powershell
cd templates/minimal
npm install
npm run dev
```

Example packs (try without editing JSON):
- Buttons: Start Example, Start Expressions, Start Achievements.
- Dropdown + Load Pack: choose `example`, `expressions`, or `achievements`.
- Shows branching, sprite expressions/CG unlocks, and achievements/gallery unlocks.

Scene Editor (template helper):
- Inline add/edit/delete/reorder steps, live preview, strict validation + link checks.
- Branch map panel shows scene nodes and goto/choice targets; unknown targets are flagged.
- Download/import scenes as JSON for a quick non-coder friendly edit loop.

Deploy to Netlify: create a new site from your fork and set publish dir to `templates/minimal/dist`.

---

## Codespaces
Open this repository in GitHub Codespaces and it will auto-install dependencies (via `.devcontainer/devcontainer.json`).
Then run:

```bash
npm run template:minimal:dev
```

This builds the engine and starts the minimal browser demo.

---

## 5-Minute Tutorial

Install and run a tiny scene in code:

```ts
import { createEngine } from 'aurora-engine'

// Define minimal scenes
const scenes = [
  { id:'intro', bg:'lab.png', music:'calm.mp3', steps:[
    { type:'dialogue', char:'Guide', text:'Welcome to Aurora\'s Engine.' },
    { type:'choice', options:[
      { label:'I\'m ready.', goto:'lesson_start' },
      { label:'Explain again.', goto:'intro_repeat' }
    ]}
  ]},
  { id:'lesson_start', steps:[ { type:'dialogue', text:'Great! Let\'s begin.' } ]},
  { id:'intro_repeat', steps:[ { type:'dialogue', text:'Scenes are JSON. Choices branch with goto.' } ]}
]

const engine = createEngine({ autoEmit:true })
engine.loadScenes(scenes)
engine.start('intro')

// Listen for engine steps
import { on } from 'aurora-engine/dist/utils/eventBus'
on('vn:step', ({ step, state }) => {
  if(step?.type==='dialogue') {
    console.log((step.char? step.char+': ' : '') + step.text)
  } else if(step?.type==='choice') {
    step.options.forEach((o,i)=> console.log(i+') '+o.label))
  }
})

// Choose programmatically:
// engine.choose(0)
```

Save / Load:

```ts
import { saveSnapshotLS, loadSnapshotLS } from 'aurora-engine/dist/vn/save'
// Save
saveSnapshotLS('vn_save_slot_1', engine.snapshot())
// Restore
const snap = loadSnapshotLS('vn_save_slot_1')
if(snap) engine.restore(snap)
```

Transitions:

```ts
{ type:'transition', kind:'fade', duration:600 }
```

---

## Try the Example (CLI)

Run a simulated scene log from `scenes/example.json`:

```powershell
npm run preview
```

This builds the library and prints a simple interpretation of the first scene.

---

## Philosophy
Aurora’s Engine is built on three values:

### Simplicity  
You shouldn’t need a computer science degree to tell a story.

### Creativity  
Use the engine your way: precise coding or AI-assisted writing.

### Accessibility  
Beginner-friendly, open-source, and structured so creators can learn gently, not drown.

---

## Example Scene (JSON)

```json
{
  "id": "intro",
  "bg": "lab.png",
  "music": "calm.mp3",
  "dialogue": [
    { "char": "Guide", "text": "Welcome to Aurora’s Engine." },
    { "char": "Guide", "text": "Let me show you how scenes work." },
    {
      "choice": [
        { "label": "I’m ready.", "goto": "lesson_start" },
        { "label": "Explain again.", "goto": "intro_repeat" }
      ]
    }
  ]
}
```

---

## Roadmap
See `ROADMAP.md` for planned features like:
- Achievements  
- Scene editor  
- Drag-and-drop timeline  
- Localization  
- Desktop export  

---

## License
MIT License — see `LICENSE`.  
You are free to build, modify, and commercialize projects made with this engine.

---

## Contributing
We welcome:
- beginners  
- students  
- writers  
- first-time open-source contributors  

See `CONTRIBUTING.md` for everything you need.

---

## Final Note
Aurora’s Engine exists to make creation joyful, accessible, and expressive.  
Use it to tell your story.  
Build something you’re proud of.  
Bring your world to life.


---

## FAQ & Troubleshooting

- Q: `npm run build:ui` or `npm start` fails — what should I do?
  - A: Try running the build/install steps inside the specific packages: `packages/ui` and `templates/minimal`. See full instructions in `docs/developer.md`.

- Q: Why are there committed `.js` and `.d.ts` files?
  - A: Some generated artifacts were committed for convenience. If you regenerate them locally, confirm they match before committing or opening a PR.

- Q: Windows/npm lockfile or permission errors?
  - A: Remove `node_modules`, ensure your Node/npm versions are compatible, and run `npm install` (or `npm ci` with a lockfile).

For step-by-step developer build instructions and troubleshooting, see `docs/developer.md`.


```powershell
cd templates/minimal
npm run dev
```

Troubleshooting:
- If `npm run build:ui` or `npm start` in the root fails, try running the install/build commands directly inside `packages/ui` and `templates/minimal` as shown above.
- Some generated `.js`/.d.ts files are committed for convenience; if you regenerate them locally, ensure they match before committing.

---


## Quick Start for Developers

See the 5-minute code sample below if you want to use Aurora’s Engine in your own TypeScript/JS project:

```ts
import { createEngine } from 'aurora-engine';

// Define minimal scenes
const scenes = [
  { id:'intro', bg:'lab.png', music:'calm.mp3', steps:[
    { type:'dialogue', char:'Snowflake', text:'Welcome.' },
    { type:'choice', options:[
      { label:'Hi', goto:'friendly' },
      { label:'Who are you?', goto:'suspicious' }
    ]}
  ]},
  { id:'friendly', steps:[ { type:'dialogue', text:'Nice to meet you!' } ]},
  { id:'suspicious', steps:[ { type:'dialogue', text:'I am... classified.' } ]}
];

const engine = createEngine({ autoEmit:true });
engine.loadScenes(scenes);
engine.start('intro');

// Listen for steps
import { on } from 'aurora-engine/dist/utils/eventBus';
on('vn:step', ({ step, state }) => {
  // Render background state.bg, sprites state.sprites
  if(step?.type==='dialogue') {
    console.log(step.char? step.char+': '+step.text: step.text);
  } else if(step?.type==='choice') {
    step.options.forEach((o,i)=> console.log(i+') '+o.label));
  }
});

// Choosing an option:
// engine.choose(0);
```

Save / Load:
```ts
import { saveSnapshotLS, loadSnapshotLS } from 'aurora-engine/dist/vn/save';
// Save
saveSnapshotLS('vn_save_slot_1', engine.snapshot());
// Restore
const snap = loadSnapshotLS('vn_save_slot_1');
if(snap) engine.restore(snap);
```

Animations (fade / slide): push a transition step:
```ts
{ type:'transition', kind:'fade', duration:600 }
```

## Included
A lightweight visual novel / story progression core. Excludes proprietary story scripts, audio assets, localization strings, and episode-specific data.

## Included
- Core state container (`GameStateManager`, `GameStateCore`, `GameHistory`).
- Modular state facets: flags, metrics, progression (stub), storage monitoring.
- Persistence helpers (localStorage wrappers + async Result-based API).
- Event bus utilities for decoupled in-app events.
- Expression evaluator (`expr`) for simple conditional logic.
- Step runner for applying VN steps.
- Basic VN config constants.

## Excluded
- Narrative scripts, scenes, dialogue tables.
- Audio and music assets.
- Episode manifests and routing.
- Localization / translation utilities.

## Install (local path example)
```bash
npm install ../aurora/engine
```

## Usage
```ts
import { GameStateManager, exprEval, runSteps } from 'aurora-engine'

const manager = new GameStateManager()
manager.init()

// Evaluate a simple flag expression
const canShowScene = exprEval('flag:hasKey && metric:affinity > 2', manager.getState())

if (canShowScene) {
  runSteps(manager, [ { kind: 'flag', key: 'enteredRoom', value: true } ])
}
```

## Providing Content
You are responsible for:
- Creating scene data / step arrays consumed by `runSteps`.
- Defining progression rules (extend `GameProgressionModule`).
- Supplying UI components (in a separate `aurora/ui` package) that bind to this engine.

## Extending Progression
`GameProgressionModule` is a stub. Replace with your own logic (e.g. chapter gating, branching graphs). Keep a consistent API surface (`tick(state)`, `advance(data)` etc).

## Events
Use the event bus (`on(event, handler)` and `emit(event, detail?)`) to wire UI overlays, persistence triggers, analytics, etc.

## Persistence
`persistence.v2.ts` exposes an async API with a Result style (`ok(value)` / `err(message)`). Wrap remote storage, encryption, or cloud sync behind this adapter.

## Versioned Save Schema
`saveSchema` helps track save data version. Increment when structural changes to saves occur and implement migration where needed.

## Roadmap
See the full phased plan in `ROADMAP.md`.

## Schema & tooling
- JSON Schema export: `aurora-engine/scene-schema.json` (strict loader-aligned; supports `yPct`/`moveTo`/`moves`).
- Lint scenes: `npm run build && node scripts/scene-lint.js --file <path/to/scene.json>` (schema + strict loader + cross-scene goto/choice checks).
- UI kit (optional): `@aurora-engine/ui` vanilla renderer (build with `npm run build:ui`).
- API surface: see `docs/api-surface.md` for stable exports vs internals.
- Writer start here: see `docs/writer-start.md` for the AI + lint + run flow.

## Packages and docs shipped
- Engine: `aurora-engine` (exports: engine core, schema at `./scene-schema.json`).
- UI kit: `@aurora-engine/ui` (vanilla renderer prototype).
- Docs: `docs/` includes schema, API surface, scene format, developer start-here.

## License
Inherit the root project license (see repository). Do not include copyrighted episode content here.
