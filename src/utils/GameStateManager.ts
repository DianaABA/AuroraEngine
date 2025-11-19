import { safeDeepClone } from './saveSchema'
import GameStateCore from '../state/GameStateCore'
import GameHistory from '../state/GameHistory'
import GameFlagsModule from '../state/modules/GameFlags'
import GameProgressionModule from '../state/modules/GameProgression'
import GameMetricsModule from '../state/modules/GameMetrics'
import { emitGameStateCorrupt } from './eventBus'

export interface GameStatePreferences { autoSaveEnabled:boolean; autoSaveInterval:number; rollbackEnabled:boolean; maxRollbackSteps:number }
export interface GameState {
  currentEpisode:string; currentScene:string; currentLine:number; variables:Record<string,any>; flags:Set<string>;
  playTime:number; lastPlayTime:number; preferences: GameStatePreferences
}

const DEFAULT_STATE: GameState = {
  currentEpisode:'ep01-root-denial', currentScene:'PROLOGUE', currentLine:0, variables:{}, flags:new Set(), playTime:0, lastPlayTime: Date.now(),
  preferences:{ autoSaveEnabled:true, autoSaveInterval:5, rollbackEnabled:true, maxRollbackSteps:50 }
}

class GameStateManager {
  private static instance: GameStateManager
  private state: GameState = safeDeepClone(DEFAULT_STATE)
  private flags: GameFlagsModule
  private progression: GameProgressionModule
  private metrics: GameMetricsModule
  private listeners = new Map<string, Set<(p:any)=>void>>()
  private constructor(){
    GameStateCore.getInstance().init(this.state)
    GameHistory.getInstance().configure(this.state.preferences.maxRollbackSteps)
    const get = ()=> this.state
    const set = (next: GameState)=> { this.state = next; this.emit('stateUpdate', safeDeepClone(this.state)); this.validate() }
    this.flags = new GameFlagsModule(get,set)
    this.progression = new GameProgressionModule(get,set)
    this.metrics = new GameMetricsModule(get,set)
    // touch progression & metrics to avoid unused warnings
    this.progression.debugSnapshot()
    this.metrics.getMetric('playTime')
  }
  static getInstance(){ if(!this.instance) this.instance = new GameStateManager(); return this.instance }
  getCurrentState(){ return safeDeepClone(this.state) }
  updateState(partial: Partial<GameState>){ const now=Date.now(); const prev=this.state.lastPlayTime||now; const session=Math.max(0, now-prev); this.state = { ...this.state, ...partial, playTime: this.state.playTime + session, lastPlayTime: now }; this.emit('stateUpdate', safeDeepClone(this.state)); this.validate() }
  private validate(){
    try {
      const issues = GameStateCore.getInstance().validate();
      if(issues.length) emitGameStateCorrupt({reason: issues.join(',')})
    } catch (e:any) {
      const msg = (e && (e.message||e.toString && e.toString())) || 'unknown'
      emitGameStateCorrupt({ reason: 'exception:'+ String(msg) })
    }
  }
  on(ev:string, fn:(p:any)=>void){ const set = this.listeners.get(ev)|| new Set(); set.add(fn); this.listeners.set(ev,set); return ()=>{ set.delete(fn) } }
  private emit(ev:string,p?:any){ const set=this.listeners.get(ev); if(!set) return; for(const fn of set){ try { fn(p) } catch {} } }
  addFlag(id:string){ return this.flags.addFlag(id) }
  removeFlag(id:string){ return this.flags.removeFlag(id) }
  hasFlag(id:string){ return this.flags.hasFlag(id) }
}
export default GameStateManager
