import { describe, it, expect } from 'vitest'
import { Jukebox } from '../src/utils/jukebox'
import { onMusicTrackChange, onMusicPlay, onMusicPause } from '../src/utils/eventBus'

describe('Jukebox utility', () => {
  it('plays and pauses tracks while emitting events', () => {
    const track: any[] = []
    const play: any[] = []
    const pause: any[] = []
    const off1 = onMusicTrackChange((e)=> track.push(e))
    const off2 = onMusicPlay((e)=> play.push(e))
    const off3 = onMusicPause((e)=> pause.push(e))
    try {
      Jukebox.play('song-1', 'Nice Song')
      expect(Jukebox.get().id).toBe('song-1')
      expect(Jukebox.get().isPlaying).toBe(true)
      expect(track.length).toBe(1)
      expect(play.length).toBe(1)
      expect(track[0].id).toBe('song-1')
      Jukebox.pause()
      expect(Jukebox.get().isPlaying).toBe(false)
      expect(pause.length).toBe(1)
      expect(pause[0].id).toBe('song-1')
    } finally { off1(); off2(); off3() }
  })
})
