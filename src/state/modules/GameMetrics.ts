import type { GameState } from '../GameStateCore'
export class GameMetricsModule { constructor(private readonly _get:()=>GameState, private readonly _set:(s:GameState)=>void){}
  setPlayTime(ms:number){ const st=this._get(); this._set({...st, playTime: Math.max(0, ms)}) }
  accrue(){ const st=this._get(); const now=Date.now(); const prev=st.lastPlayTime||now; const add=Math.max(0, now-prev); this._set({...st, playTime: st.playTime+add, lastPlayTime: now}) }
  getMetric(key:string){ const st=this._get(); return (st as any)[key] }
}
export default GameMetricsModule
