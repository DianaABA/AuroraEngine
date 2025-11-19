# Engine Events

This engine emits DOM CustomEvents (and mirrors them via a Node-safe fallback) that templates can subscribe to using `on(name, handler)`.

## Core
- `vn:step`: Emitted after each step render (when `autoEmit` is enabled). Detail: `{ step, state }`.
- `vn:transition`: Emitted on transition steps. Detail: `{ kind, duration, state }`.

## Music
- `music:track-change`: When a new music track is set. Detail: `{ id, title }`.
- `music:play`: When music starts/resumes. Detail: `{ id, title }`.
- `music:pause`: When music pauses. Detail: `{ id, title }`.

## Auto / Debug
- `vn:auto-choice`: Emitted when auto-decision chooses an option.
  - Detail: `{ sceneId, index, chosenIndex, chosenLabel, strategy, options, validOptions, state }`
- `vn:auto-loop-guard`: Emitted if the auto-advance loop exceeds `maxAutoSteps`.
  - Detail: `{ steps, max, state }`

## State Health
- `gameState:corrupt`: Emitted if validation reports issues or throws.
  - Detail: `{ reason: string }`

## Usage
```ts
import { on } from 'aurora-engine'

on('vn:auto-choice', d => console.log('Auto chose', d))
on('vn:auto-loop-guard', d => console.warn('Auto loop guard tripped', d))
```

## Template Debugging
- Minimal template exposes a Settings toggle: `Debug Toasts`.
- When enabled, it surfaces small toasts for `vn:auto-choice` and `vn:auto-loop-guard` in the bottom-right `#notifications` area.
- Files:
  - Template wiring: `templates/minimal/src/main.ts` (listeners + toast rendering)
  - UI container: `templates/minimal/index.html` (`#notifications`)
  - Preference key: `aurora:minimal:prefs` → `showDebugToasts`
