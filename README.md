# Aurora’s Engine
A lightweight, creator-friendly Visual Novel engine built with modern web technologies.  
Designed to help writers, solo devs, educators, and storytellers build narrative experiences without starting from scratch.

Aurora’s Engine supports:
- Dialogue and character interaction  
- Branching choices and conditional paths  
- Simple scene scripting with JSON  
- Background and sprite switching  
- Music, sound effects, and emotional cues  
- State, flags, and persistent memory  
- Basic transitions and animations  
- Quick deployment to the web (Netlify, Vercel)

It is intentionally simple:  
easy to learn, easy to build with, easy to share.

---

## Why Aurora’s Engine Exists
Many beginner creators want to tell stories but feel blocked by:
- complex tools  
- confusing file structures  
- frameworks requiring advanced coding

Aurora’s Engine removes those barriers.

It was originally developed alongside the visual novel Chakra Hearts, then rebuilt into a clean framework so others can:
- write in plain text  
- organize assets easily  
- build interactive scenes with simple JSON  
- publish projects quickly  
- learn through AI-assisted workflows or traditional coding

Whether you prefer Snowflake’s structured path (clean code, clarity) or Necromancer’s creative path (AI-assisted writing, rapid prototyping), the engine supports both styles.

---

## Key Features
- Scene Scripting System  
  Create scenes using a simple JSON format. No complex logic required.

- Dialogue Engine  
  Define who speaks, what they say, and how emotions shift.

- Choice System  
  Branch stories using clear `choices` and `goto` fields.

- State & Memory  
  Flags, variables, emotional tracking, romance points, achievements.

- Asset Management  
  Drop in PNGs, backgrounds, and music. The engine handles loading.

- Transitions & FX  
  Fade, slide, shake, glitch burst, harmonic light, etc.

- Web Deployment  
  Designed to run anywhere: Netlify, GitHub Pages, Vercel, or as a desktop build.

---

## Who It’s For
- Writers who want to publish a story quickly  
- Students learning React or web fundamentals  
- Educators wanting to gamify lessons  
- Content creators who want to bundle narrative experiences  
- Udemy learners following the “Build Your First Visual Novel” course  
- Anyone who says:  
  “I want to make a VN, but I don’t want to code everything myself.”

---

## Quick Start
1. Clone or download the repository  
2. Place your assets into `assets/`  
3. Write scenes in `scenes/` using the provided JSON format  
4. Add your entry scene to `main.json`  
5. Run the project  
6. Publish with one click (Netlify button included)

Full documentation is in `/docs`.

---

## Docs
- Scene format: `docs/scene-format.md`
- Achievements (draft): `docs/achievements.md`
- Audio Jukebox (draft): `docs/jukebox.md`

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
MIT License.  
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

## Quick Start (5 Minutes)
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
