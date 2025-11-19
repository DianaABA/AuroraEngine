import { emit } from '../utils/eventBus'
import { emitMusicTrackChange, emitMusicPlay } from '../utils/eventBus'
import type { SceneDef, SceneStep, ChoiceStep, SnapshotData, ChoiceOption } from './sceneTypes'
import { evaluateCondition } from './expression'

export interface VNEngineConfig { autoEmit?: boolean; autoDecide?: boolean; autoAdvance?: boolean; maxAutoSteps?: number }

export class VNEngine {
  private scenes = new Map<string, SceneDef>()
  private currentSceneId: string | null = null
  private index = 0
  private flags = new Set<string>()
  private vars: Record<string,any> = {}
  private sprites: Record<string,string> = {}
  private bg?: string
  private music?: string
  private config: VNEngineConfig
  private inAutoLoop = false
  private pauseOnNextDialogue = false
  private pauseAfterTransition = false
  constructor(cfg: VNEngineConfig = {}){ this.config = { maxAutoSteps: 1000, ...cfg } }
  loadScenes(defs: SceneDef[]){ for(const s of defs){ this.scenes.set(s.id, s) } }
  start(id: string){
    if(!this.scenes.has(id)) throw new Error('scene_not_found:'+id)
    const scene = this.scenes.get(id)!
    this.currentSceneId = id
    this.index = 0
    if(scene.bg) this.bg = scene.bg
    if(scene.music) this.music = scene.music
    this.emitStep()
    if(this.config.autoAdvance && !this.inAutoLoop) this.runAutoLoop()
  }
  getCurrentScene(){ return this.currentSceneId ? this.scenes.get(this.currentSceneId)! : null }
  getCurrentStep(): SceneStep | null { const scene = this.getCurrentScene(); if(!scene) return null; return scene.steps[this.index]|| null }
  next(){
    const scene = this.getCurrentScene(); if(!scene) return
    const step = this.getCurrentStep(); if(!step) return
    if(step.type === 'choice'){ if(this.maybeAutoDecide()) return; return }
    if(step.type === 'goto'){ this.pauseOnNextDialogue = true; this.start(step.scene); return }
    this.applySideEffects(step)
    this.index++
    if(this.maybeAutoDecide()) return
    this.emitStep()
  }
  choose(optionIndex: number){
    const step = this.getCurrentStep(); if(!step || step.type!=='choice') return
    const choice = (step as ChoiceStep).options[optionIndex]; if(!choice) return
    if(choice.setFlag) this.flags.add(choice.setFlag)
    if(choice.goto) { this.pauseOnNextDialogue = true; this.start(choice.goto); return }
    this.index++
    if(this.maybeAutoDecide()) return
    this.emitStep()
  }
  private applySideEffects(step: SceneStep | null){ if(!step) return; switch(step.type){
    case 'spriteShow': this.sprites[step.id] = step.src; break;
    case 'spriteSwap': this.sprites[step.id] = step.src; break;
    case 'spriteHide': delete this.sprites[step.id]; break;
    case 'background': this.bg = step.src; break;
    case 'music': this.music = step.track; emitMusicTrackChange({ id: step.track, title: step.track }); emitMusicPlay({ id: step.track, title: step.track }); break;
    case 'flag': step.value===false? this.flags.delete(step.flag): this.flags.add(step.flag); break;
    case 'transition': emit('vn:transition', { kind: step.kind, duration: step.duration||0, state: this.getPublicState() }); break;
  }}
  setVar(key:string,val:any){ this.vars[key]=val }
  getVar(key:string){ return this.vars[key] }
  hasFlag(f:string){ return this.flags.has(f) }
  snapshot(): SnapshotData { return { sceneId: this.currentSceneId||'', index: this.index, flags:[...this.flags], vars:{...this.vars}, sprites:{...this.sprites}, bg:this.bg, music:this.music } }
  restore(data: SnapshotData){ if(!this.scenes.has(data.sceneId)) throw new Error('restore_scene_missing'); this.currentSceneId = data.sceneId; this.index = data.index; this.flags = new Set(data.flags); this.vars = { ...data.vars }; this.sprites = { ...data.sprites }; this.bg=data.bg; this.music=data.music; this.emitStep() }
  private emitStep(){ if(!this.config.autoEmit) return; const step = this.getCurrentStep(); emit('vn:step', { step, state: this.getPublicState() }) }
  private validChoiceOptions(step: ChoiceStep): ChoiceOption[] { return step.options.filter(o => !o.condition || evaluateCondition(o.condition, this.flags, this.vars)) }
  private maybeAutoDecide(): boolean {
    const step = this.getCurrentStep();
    if(!step || step.type!=='choice') return false;
    const choiceStep = step as ChoiceStep;
    const valid = this.validChoiceOptions(choiceStep);
    if(valid.length===0) return false;
    const cfg = this.config;
    const shouldAuto = cfg.autoDecide || choiceStep.autoSingle || !!choiceStep.autoStrategy;
    if(!shouldAuto) return false;
    let chosen: ChoiceOption | null = null;
    if(choiceStep.autoSingle && valid.length===1) {
      chosen = valid[0];
    } else if(choiceStep.autoStrategy==='firstValid') {
      chosen = valid[0];
    } else if(choiceStep.autoStrategy==='random') {
      chosen = valid[Math.floor(Math.random()*valid.length)];
    } else if(choiceStep.autoStrategy==='highestWeight') {
      chosen = valid.slice().sort((a,b)=> (b.weight||0)-(a.weight||0))[0];
    } else if(cfg.autoDecide && valid.length===1) {
      chosen = valid[0];
    }
    if(!chosen) return false;
    const idx = choiceStep.options.indexOf(chosen);
    this.choose(idx);
    return true;
  }
  private runAutoLoop(){
    if(!this.config.autoAdvance) return
    if(this.inAutoLoop) return
    this.inAutoLoop = true
    let steps = 0
    const max = this.config.maxAutoSteps || 1000
    try {
      while(this.config.autoAdvance){
        if(steps++ > max) break
      const step = this.getCurrentStep()
      if(!step) break
      // Pause on the first dialogue encountered after a goto/choice scene change
      if(this.pauseOnNextDialogue && step.type === 'dialogue'){ this.pauseOnNextDialogue = false; break }
        // Pause at the first dialogue after any transition, even if side-effects occur before it
        if(this.pauseAfterTransition && step.type === 'dialogue'){ this.pauseAfterTransition = false; break }
      if(step.type==='choice'){
        if(this.maybeAutoDecide()){ continue } else { break }
      }
      if(step.type==='dialogue'){
        this.next(); continue
      }
        if(step.type==='goto'){ this.next(); continue }
        if(step.type==='spriteShow'||step.type==='spriteSwap'||step.type==='spriteHide'||step.type==='background'||step.type==='music'||step.type==='flag'||step.type==='sfx'||step.type==='transition'){
        if(step.type==='transition') this.pauseAfterTransition = true
        this.next(); continue
      }
      break
      }
    } finally {
      this.inAutoLoop = false
    }
  }
  getPublicState(){ return { sceneId:this.currentSceneId, index:this.index, bg:this.bg, music:this.music, sprites:{...this.sprites}, flags:[...this.flags], vars:{...this.vars} } }

  // Runtime controls for UI
  setAutoAdvance(on: boolean){
    this.config.autoAdvance = on
    if(on && !this.inAutoLoop) this.runAutoLoop()
  }
  setAutoDecide(on: boolean){
    this.config.autoDecide = on
    if(on && this.config.autoAdvance && !this.inAutoLoop) this.runAutoLoop()
  }
  isAutoAdvance(){ return !!this.config.autoAdvance }
  isAutoDecide(){ return !!this.config.autoDecide }
}

export function createEngine(cfg: VNEngineConfig = {}){ return new VNEngine(cfg) }
