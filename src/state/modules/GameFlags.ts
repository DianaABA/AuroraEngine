import type { GameState } from '../GameStateCore'
export class GameFlagsModule { constructor(private get:()=>GameState, private set:(s:GameState)=>void){}
  addFlag(id:string){ const f=id.trim(); if(!f) return false; const st=this.get(); if(st.flags.has(f)) return false; const next=new Set(st.flags); next.add(f); this.set({...st, flags: next}); return true }
  removeFlag(id:string){ const f=id.trim(); if(!f) return false; const st=this.get(); if(!st.flags.has(f)) return false; const next=new Set(st.flags); next.delete(f); this.set({...st, flags: next}); return true }
  hasFlag(id:string){ return this.get().flags.has(id.trim()) }
}
export default GameFlagsModule
