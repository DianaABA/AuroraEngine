import { describe, it, expect } from 'vitest'
import { createEngine } from '../src/vn/engine'
import type { SceneDef } from '../src/vn/sceneTypes'
import { encodeSnapshot, decodeSnapshot } from '../src/vn/save'

describe('VNEngine basic flow', () => {
  const scenes: SceneDef[] = [
    { id:'intro', bg:'bg1.png', music:'m1.mp3', steps:[
      { type:'dialogue', char:'Guide', text:'Welcome.' },
      { type:'choice', options:[{ label:'Hi', goto:'branchHi', setFlag:'hi' },{ label:'Who are you?', goto:'branchWho' }] }
    ]},
    { id:'branchHi', steps:[ { type:'dialogue', text:'You greeted the guide.' } ]},
    { id:'branchWho', steps:[ { type:'dialogue', text:'Curious, eh?' }, { type:'flag', flag:'curious' } ]}
  ]

  it('branches via choice and sets flag', () => {
    const eng = createEngine({ autoEmit:false })
    eng.loadScenes(scenes)
    eng.start('intro')
    expect(eng.getCurrentStep()?.type).toBe('dialogue')
    eng.next() // move to choice
    expect(eng.getCurrentStep()?.type).toBe('choice')
    eng.choose(0) // choose Hi
    expect(eng.getPublicState().sceneId).toBe('branchHi')
    expect(eng.hasFlag('hi')).toBe(true)
    console.log('[VNEngineTest] branch choice test executed')
  })

  it('snapshot and restore maintains state', () => {
    const eng = createEngine({ autoEmit:false })
    eng.loadScenes(scenes)
    eng.start('intro')
    eng.next()
    const snap = eng.snapshot()
    const raw = encodeSnapshot(snap)
    const eng2 = createEngine({ autoEmit:false })
    eng2.loadScenes(scenes)
    eng2.restore(decodeSnapshot(raw))
    expect(eng2.getCurrentStep()?.type).toBe('choice')
    expect(eng2.getPublicState().bg).toBe('bg1.png')
    console.log('[VNEngineTest] snapshot restore test executed')
  })
})
