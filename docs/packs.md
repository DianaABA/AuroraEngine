# Packs Manifest (Foundation)

This document describes a minimal manifest for listing scene packs the template/UI can load.

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

## Next Steps (planned)
- Pack manifest JSON file format (`packs.json`) with versioning.
- Optional per-pack preload manifest (sprites/bg/music).
- UI affordances: preview thumbnails, difficulty/length, tags.
- CLI helper: `aurora packs add <id> <url>`.
