import { describe, it, expect } from 'vitest'
import { createEngine } from '../src/vn/engine'
import type { SceneDef } from '../src/vn/sceneTypes'
import { on } from '../src/utils/eventBus'

describe('VNEngine transitions', () => {
  it('emits vn:transition event and proceeds', () => {
    const scenes: SceneDef[] = [
      { id:'t', steps:[
        { type:'transition', kind:'fade', duration:300 },
        { type:'dialogue', text:'After fade' }
      ]}
    ]
    const eng = createEngine({ autoEmit:false, autoAdvance:true })
    const events: any[] = []
    on('vn:transition', (e)=> events.push(e))
    eng.loadScenes(scenes)
    eng.start('t')
    expect(events.length).toBe(1)
    expect(events[0].kind).toBe('fade')
    expect(eng.getCurrentStep()?.type).toBe('dialogue')
  })

  it('emits for zoom/shake/flash kinds and pauses before dialogue', () => {
    const kinds: any[] = []
    const scenes = [
      { id:'k1', steps:[ { type:'transition', kind:'zoom', duration:100 }, { type:'dialogue', text:'Z' } ]},
      { id:'k2', steps:[ { type:'transition', kind:'shake', duration:100 }, { type:'dialogue', text:'S' } ]},
      { id:'k3', steps:[ { type:'transition', kind:'flash', duration:100 }, { type:'dialogue', text:'F' } ]},
    ]
    const e1 = createEngine({ autoEmit:false, autoAdvance:true })
    const e2 = createEngine({ autoEmit:false, autoAdvance:true })
    const e3 = createEngine({ autoEmit:false, autoAdvance:true })
    const off = on('vn:transition', (ev:any)=> kinds.push(ev.kind))
    try{
      e1.loadScenes(scenes as any); e1.start('k1')
      e2.loadScenes(scenes as any); e2.start('k2')
      e3.loadScenes(scenes as any); e3.start('k3')
      expect(kinds).toEqual(['zoom','shake','flash'])
      expect(e1.getCurrentStep()?.type).toBe('dialogue')
      expect(e2.getCurrentStep()?.type).toBe('dialogue')
      expect(e3.getCurrentStep()?.type).toBe('dialogue')
    } finally { off() }
  })
})
