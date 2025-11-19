# CG Gallery

Unlock and list CG images (or any artwork) with persistence and events.

## Usage
```ts
import { Gallery } from 'aurora-engine'

const gallery = new Gallery()

// Unlock a CG by id (and src path)
gallery.unlock('cg_intro', 'cgs/intro.png', { title: 'Prologue', meta:{ chapter:1 } })

// Check status
if (gallery.has('cg_intro')) {
  const item = gallery.get('cg_intro')
  console.log(item?.src)
}

// List unlocked items in chronological order
const items = gallery.list()

// Reset (e.g., from settings)
gallery.reset()
```

## Events
- `gallery:unlock`: fired with `{ id, src, title?, meta?, unlockedAt }` when a new item is unlocked.

## Storage
- Stored under `localStorage` key `aurora:gallery` by default. Pass a custom key to the constructor for testing or multiple profiles.

## Tips
- Keep `id` stable; use `src` to point to an image in your public assets.
- Use Achievements alongside Gallery for badges or milestones.
