# Audio Jukebox (Draft)

Purpose: Provide a simple in-engine UI to browse and play unlocked BGM tracks.

Status: Draft. Depends on audio subsystem and asset manifests.

## Concepts
- Track: id, title, artist (optional), src
- Unlock conditions: default unlocked or via gameplay
- Persistence: unlocked list saved with snapshot

## Data Shape (proposed)
```ts
interface TrackDef {
  id: string
  title: string
  artist?: string
  src: string // path or key
  unlockedByDefault?: boolean
}
```

## Minimal API (proposed)
```ts
jukebox.load(tracks: TrackDef[])
jukebox.list(): TrackDef[]
jukebox.play(id: string)
jukebox.stop()
```

## UI Behavior
- Show only unlocked tracks
- Indicate currently playing track
- Allow loop/stop

## Future
- Crossfade between tracks
- Per-track preview points
- Favorite/star system
