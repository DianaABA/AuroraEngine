# Packs Manifest

This document describes the pack manifest format and how the minimal template consumes it.

## Concepts
- Pack: a named bundle of scenes, addressed by `id`, whose scenes are provided via a single `scenesUrl`.
- Registry: a simple index to list packs and resolve by id.

## Types
```ts
export type PackId = string

export interface PackEntry {
  id: PackId
  name: string
  description?: string
  scenesUrl: string            // JSON array/object of scenes
  assetsBaseUrl?: string       // Optional asset root for previews/preload
  meta?: Record<string, any>   // Arbitrary UI metadata
}

export interface PackManifest { packs: PackEntry[] }
```

## Minimal Loader
```ts
import { createPackRegistry, loadPackByIdStrict } from 'aurora-engine'

const manifest = {
  packs: [
    { id: 'example', name: 'Example', scenesUrl: '/scenes/example.json' },
    { id: 'expressions', name: 'Expressions', scenesUrl: '/scenes/expressions.json' },
  ]
}

const registry = createPackRegistry(manifest)
const { scenes, errors } = await loadPackByIdStrict(registry, 'example')
```

- `loadPackByIdStrict` validates scenes strictly and returns structured issues.
- Use `assetsBaseUrl` to construct image/audio paths or preload manifests.

## Template Integration (packs.json)

- Location: `templates/minimal/public/packs.json`
- Shape:

```json
{
  "packs": [
    {
      "id": "example",
      "name": "Example",
      "description": "Branching basics",
      "scenesUrl": "/scenes/example.json",
      "assetsBaseUrl": "/",
      "meta": { "start": "intro" }
    }
  ]
}
```

- The template fetches `packs.json` at startup, builds a registry with `createPackRegistry`,
  and uses it to populate the pack selector, load packs, and show the JSON.
- If `packs.json` is missing/invalid, the template falls back to a built-in list.

## CI Validation

- Script: `scripts/validate-packs-manifest.js` verifies:
  - unique `id`s, file existence for `scenesUrl`
  - declared `meta.start` exists in the scenes array
  - optional `assetsBaseUrl` is a string
- CI runs this validator in both main build and the packs job.

## Next Steps (planned)
- Optional per-pack preload manifest (sprites/bg/music).
- UI affordances: preview thumbnails, difficulty/length, tags.
- CLI helper: `aurora packs add <id> <url>`.
