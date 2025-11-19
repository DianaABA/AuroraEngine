# Aurora Engine

Lean visual novel engine extracted from ChakraHearts, prepared for student creators.

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
