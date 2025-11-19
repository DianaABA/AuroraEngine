export interface GameState { currentEpisode:string; currentScene:string; currentLine:number; flags:Set<string>; variables:Record<string,any>; playTime:number; lastPlayTime:number; preferences:{ autoSaveEnabled:boolean; autoSaveInterval:number; rollbackEnabled:boolean; maxRollbackSteps:number } }
export class GameStateCore {
  private static instance: GameStateCore; private _state: GameState | null = null
  static getInstance(){ if(!this.instance) this.instance = new GameStateCore(); return this.instance }
  init(initial: GameState){ if(!this._state) this._state = initial }
  get snapshot(){ if(!this._state) throw new Error('GameStateCore not initialized'); return this._state }
  update(partial: Partial<GameState>){ if(!this._state) throw new Error('GameStateCore not initialized'); this._state = { ...this._state, ...partial } }
  validate(): string[]{ const issues:string[]=[]; if(!this._state) issues.push('state_missing'); if(this._state && !(this._state.flags instanceof Set)) issues.push('flags_not_set'); return issues }
}
export default GameStateCore
