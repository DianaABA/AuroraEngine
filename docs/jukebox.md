# Jukebox

Control music playback decoupled from scene steps.

Usage:

```ts
import { Jukebox, onMusicTrackChange, onMusicPlay, onMusicPause } from 'aurora-engine'

onMusicTrackChange((e)=> console.log('Track:', e.id))
onMusicPlay((e)=> console.log('Play:', e.id))
onMusicPause((e)=> console.log('Pause:', e.id))

Jukebox.play('theme-1', 'Theme Song')
Jukebox.pause()
```

API:
- `Jukebox.play(id, title?)` — sets current track and emits `music:track-change` then `music:play`
- `Jukebox.pause()` — emits `music:pause` for current track
- `Jukebox.get()` — returns `{ id?, title?, isPlaying }`

Notes:
- Engine `music` steps also emit the same events; build UIs by listening once.
