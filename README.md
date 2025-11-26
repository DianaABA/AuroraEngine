
# Aurora’s Engine
[![CI](https://github.com/DianaABA/AuroraEngine/actions/workflows/ci.yml/badge.svg)](https://github.com/DianaABA/AuroraEngine/actions/workflows/ci.yml)

A lightweight, creator-friendly Visual Novel engine. No coding required to get started!

---

## 🎮 Live Demo

Want to see Aurora’s Engine in action? Try the browser demo included in this repo!

**How to run the demo locally:**

1. Open the `templates/minimal` folder in your terminal.
2. Run:
  ```powershell
  npm install
  npm run dev
  ```
3. Open the link shown in the terminal (usually http://localhost:5173) in your browser.

You can edit scenes and assets in `public/scenes` and `public/cgs` and see changes live.

---

## 🚀 Quick Start for Everyone

1. **Download or clone this repo** (green "Code" button above)
2. **Open the folder** on your computer
3. **Double-click the `templates/minimal` folder**
4. **Open a terminal in that folder** (right-click → "Open in Terminal" or use your code editor)
5. **Copy and paste these commands:**

   ```powershell
   npm install
   npm run dev
   ```

6. **Open the link shown in the terminal** (usually http://localhost:5173)
7. **Edit scenes and assets** in the `public/scenes` and `public/cgs` folders. Refresh the browser to see your changes!

**No coding required!**

---

## ✨ What Can Aurora’s Engine Do?

- Write stories with dialogue, choices, and branching paths
- Use your own backgrounds, sprites, and music
- Simple scene scripting with easy-to-edit JSON files
- Save and load progress, autosave, and multiple slots
- Achievements, CG gallery, and music jukebox
- Sprite motion, transitions, and effects (fade, slide, shake, etc.)
- Keyboard navigation and accessibility features
- Web deployment: share your game online with one click (Netlify, Vercel, GitHub Pages)
- Built-in scene validator and linting for error-free stories
- AI prompt helpers and non-coder tools (see `docs/non-coder-tools.md`)

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

## Recent updates

- Updated the UI package (`packages/ui`) with styling and renderer improvements.
- Added generated JavaScript and type declaration files for the `src/vn` and `src/utils` bundles (committed to the repo for convenience).
- Improved scene loading and types in `src/vn/sceneLoader.ts` and `src/vn/sceneTypes.ts`.
- Updated templates and minimal demo files under `templates/minimal`.
- Added/updated several tests related to sprite motion and scene loading.

If you pull the latest changes, please run the developer build steps below to regenerate or validate local artifacts.

---

## Developer build notes

Use these steps to set up and build the project locally. These are the commands that worked for the repository structure in this workspace.

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

## License
Inherit the root project license (see repository). Do not include copyrighted episode content here.
