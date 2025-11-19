import type { GameState } from '../../utils/GameStateManager'

type GetState = () => GameState
type SetState = (next: GameState) => void

export class GameMetricsModule {
  constructor(private getState: GetState, private setState: SetState) {}

  private rafId: number | null = null
  private schedule(update: (st: GameState) => GameState) {
    let ran = false
    const run = () => {
      if (ran) return
      ran = true
      try {
        const st = this.getState()
        this.setState(update(st))
      } catch {}
      this.rafId = null
    }
    let fallbackId: any = null
    const scheduleFallback = () => { fallbackId = setTimeout(run, 0) }
    try {
      if (typeof requestAnimationFrame === 'function') {
        if (this.rafId != null) cancelAnimationFrame(this.rafId as unknown as number)
        this.rafId = requestAnimationFrame(() => {
          run()
          if (fallbackId != null) { try { clearTimeout(fallbackId) } catch {} ; fallbackId = null }
        }) as unknown as number
        scheduleFallback()
      } else {
        scheduleFallback()
      }
    } catch {
      run()
    }
  }

  adjustRelationship(name: string, delta: number) {
    this.schedule((st) => {
      const rel = { ...st.characterRelationships }
      rel[name] = (rel[name] ?? 0) + delta
      return { ...st, characterRelationships: rel }
    })
  }

  setKarma(v: number) { this.schedule((st) => ({ ...st, karma: Math.max(0, Math.min(100, v)) })) }
  adjustKarma(delta: number) { this.schedule((st) => ({ ...st, karma: Math.max(0, Math.min(100, st.karma + delta)) })) }
  setRomance(v: number) { this.schedule((st) => ({ ...st, romance: Math.max(0, Math.min(100, v)) })) }
  adjustRomance(delta: number) { this.schedule((st) => ({ ...st, romance: Math.max(0, Math.min(100, st.romance + delta)) })) }
  lockRomance(id: string) {
    if (!id) return
    const st = this.getState()
    if (st.romanceLock) return
    this.setState({ ...st, romanceLock: id })
    try { localStorage.setItem('chakrahearts_romanceLock', id) } catch {}
  }

  resetPlayTime() { this.schedule((st) => ({ ...st, playTime: 0, lastPlayTime: Date.now() })) }
  accruePlayTime() {
    this.schedule((st) => {
      const now = Date.now()
      const prev = st.lastPlayTime || now
      const session = Math.max(0, now - prev)
      return { ...st, playTime: (st.playTime || 0) + session, lastPlayTime: now }
    })
  }

  formattedPlayTime(): string {
    const st = this.getState()
    const hours = Math.floor(st.playTime / (1000 * 60 * 60))
    const minutes = Math.floor((st.playTime % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}:${minutes.toString().padStart(2, '0')}`
  }
}

export default GameMetricsModule
