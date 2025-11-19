// Core game state holder (facade target)
// TODO: Gradually migrate logic from GameStateManager into this module.
import type { GameState } from '../utils/GameStateManager'

export class GameStateCore {
  private static instance: GameStateCore
  private _state: GameState | null = null

  static getInstance() {
    if (!this.instance) this.instance = new GameStateCore()
    return this.instance
  }

  init(initial: GameState) {
    if (!this._state) this._state = initial
  }

  get snapshot(): GameState {
    if (!this._state) throw new Error('GameStateCore not initialized')
    return this._state
  }

  update(partial: Partial<GameState>) {
    if (!this._state) throw new Error('GameStateCore not initialized')
    this._state = { ...this._state, ...partial }
  }

  validate(): string[] {
    const issues: string[] = []
    if (!this._state) {
      issues.push('state_missing')
      return issues
    }
    if (!(this._state.flags instanceof Set)) issues.push('flags_not_set')
    for (const [k,v] of Object.entries(this._state.characterRelationships || {})) {
      if (typeof v !== 'number') issues.push(`rel_${k}_not_number`)
      else if (v < -100 || v > 100) issues.push(`rel_${k}_out_of_range`)
    }
    if (this._state.karma < 0 || this._state.karma > 100) issues.push('karma_out_of_range')
    if (this._state.romance < 0 || this._state.romance > 100) issues.push('romance_out_of_range')
    if (typeof this._state.currentEpisode === 'string' && !/^ep\d+/.test(this._state.currentEpisode)) issues.push('episode_id_format')
    return issues
  }
}

export default GameStateCore
