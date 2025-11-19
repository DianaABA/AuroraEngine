import GameStateManager from '../utils/GameStateManager'
export interface Step { type:string; line?:number; flagsAdd?:string[] }
export function runSteps(steps:Step[], gsm = GameStateManager.getInstance()){
  for(const s of steps){ if(s.flagsAdd){ for(const f of s.flagsAdd) gsm.addFlag(f) } if(typeof s.line==='number'){ gsm.updateState({ currentLine: s.line }) } }
}
