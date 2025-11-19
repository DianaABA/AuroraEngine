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
})
