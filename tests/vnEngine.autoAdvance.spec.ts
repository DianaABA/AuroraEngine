import { describe, it, expect } from 'vitest'
import { createEngine } from '../src/vn/engine'
import type { SceneDef } from '../src/vn/sceneTypes'

describe('VNEngine autoAdvance full automation', () => {
  it('auto advances through linear dialogue and side-effect steps', () => {
    const scenes: SceneDef[] = [
      { id:'linear', steps:[
        { type:'dialogue', text:'Line 1' },
        { type:'dialogue', text:'Line 2' },
        { type:'flag', flag:'done' },
        { type:'goto', scene:'end' }
      ]},
      { id:'end', steps:[ { type:'dialogue', text:'The end.' } ]}
    ]
    const eng = createEngine({ autoEmit:false, autoAdvance:true })
    eng.loadScenes(scenes)
    eng.start('linear')
    expect(eng.getPublicState().sceneId).toBe('end')
    expect(eng.hasFlag('done')).toBe(true)
    expect(eng.getCurrentStep()?.type).toBe('dialogue')
    expect(eng.getPublicState().index).toBe(0)
  })

  it('auto resolves weighted choice with highestWeight', () => {
    const scenes: SceneDef[] = [
      { id:'root', steps:[
        { type:'choice', autoStrategy:'highestWeight', options:[
          { label:'Low', goto:'low', weight:1 },
          { label:'High', goto:'high', weight:10 },
          { label:'Mid blocked', goto:'mid', weight:5, condition:'flag:never' }
        ] }
      ]},
      { id:'high', steps:[ { type:'dialogue', text:'High chosen.' } ]},
      { id:'low', steps:[ { type:'dialogue', text:'Low.' } ]},
      { id:'mid', steps:[ { type:'dialogue', text:'Mid.' } ]}
    ]
    const eng = createEngine({ autoEmit:false, autoAdvance:true, autoDecide:true })
    eng.loadScenes(scenes)
    eng.start('root')
    expect(eng.getPublicState().sceneId).toBe('high')
    expect(eng.getCurrentStep()?.type).toBe('dialogue')
  })

  it('respects maxAutoSteps guard for looping goto', () => {
    const scenes: SceneDef[] = [
      { id:'loop', steps:[ { type:'flag', flag:'tick' }, { type:'goto', scene:'loop' } ]}
    ]
    const eng = createEngine({ autoEmit:false, autoAdvance:true, maxAutoSteps:20 })
    eng.loadScenes(scenes)
    eng.start('loop')
    // After guard triggers, still in loop scene and tick flag set
    expect(eng.getPublicState().sceneId).toBe('loop')
    expect(eng.hasFlag('tick')).toBe(true)
  })
})
