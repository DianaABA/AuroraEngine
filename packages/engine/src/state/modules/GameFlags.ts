import type { GameState } from '../../utils/GameStateManager'

type GetState = () => GameState
type SetState = (next: GameState) => void

export class GameFlagsModule {
  constructor(private getState: GetState, private setState: SetState) {}

  addFlag(id: string): boolean {
    const key = String(id || '').trim()
    if (!key) return false
    const st = this.getState()
    if (st.flags.has(key)) return false
    const next = new Set(st.flags)
    next.add(key)
    this.setState({ ...st, flags: next })
    return true
  }

  removeFlag(id: string): boolean {
    const key = String(id || '').trim()
    if (!key) return false
    const st = this.getState()
    if (!st.flags.has(key)) return false
    const next = new Set(st.flags)
    next.delete(key)
    this.setState({ ...st, flags: next })
    return true
  }

  hasFlag(id: string): boolean {
    const key = String(id || '').trim()
    if (!key) return false
    return this.getState().flags.has(key)
  }
}

export default GameFlagsModule
