# Achievements (Draft)

Purpose: Provide a lightweight badge/unlock system to reward player actions.

Status: Draft. Will evolve with save schema and UI integration.

## Concepts
- Achievement: id, title, description, unlocked (bool), dateUnlocked
- Triggers: engine events or evaluated expressions
- Persistence: stored in save snapshot, with versioned schema

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
- Define `AchievementDef[]` in content layer.
- Subscribe to engine events (`on('vn:step', ...)`) and call `unlock('achv_id')`.
- Persist via existing save helpers.

## UI Ideas
- Minimal overlay toast on unlock
- Gallery/list page with filtering (all/locked/unlocked)
- Secret achievements reveal on unlock

## Future
- Hooks for analytics
- Export/import achievement progress
- Localization of titles/descriptions
