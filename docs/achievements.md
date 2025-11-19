# Achievements (Draft)

Purpose: Provide a lightweight badge/unlock system to reward player actions.

Status: Draft. Will evolve with save schema and UI integration.

## Concepts

## Data Shape (proposed)
```ts
interface AchievementDef {
  id: string
  title: string
  description?: string
  secret?: boolean
}

interface AchievementState {
  id: string
  unlocked: boolean
  dateUnlocked?: number
}
```

## Usage (high-level)

## UI Ideas

## Future
# Achievements

Simple, persistent achievements with unlock events.

Usage:

```ts
import Achievements from 'aurora-engine/dist/state/modules/Achievements'
import { on } from 'aurora-engine'

const achievements = new Achievements()
on('achievements:unlock', (e)=>{
  console.log('Unlocked:', e.id, e.title)
})

achievements.unlock('first-steps', { title: 'First Steps', meta:{ points:10 } })
```

API:
- `new Achievements(storageKey?)` — optional custom storage key
- `unlock(id, { title?, meta? })` — idempotent; emits `achievements:unlock`
- `has(id)` — check unlocked
- `list()` — ordered by `unlockedAt`
- `reset()` — clears local data

Events:
- `achievements:unlock` with `{ id, title?, meta?, unlockedAt }`

Persistence uses `localStorage` when available, otherwise keeps data in-memory for the session.
