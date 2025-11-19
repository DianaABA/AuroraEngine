import { describe, it, expect } from 'vitest'
import { createEngine } from '../src/vn/engine'
import type { SceneDef } from '../src/vn/sceneTypes'

describe('VNEngine auto decision & conditions', () => {
  const scenes: SceneDef[] = [
    { id:'start', steps:[
      { type:'flag', flag:'met', value:true },
      { type:'choice', autoSingle:true, options:[
        { label:'Greeting', goto:'branchA', condition:'flag:met' },
        { label:'Hidden', goto:'branchB', condition:'flag:missing' }
      ] }
    ]},
    { id:'branchA', steps:[ { type:'dialogue', text:'Auto picked greeting.' } ]},
    { id:'branchB', steps:[ { type:'dialogue', text:'Should not reach.' } ]}
  ]

  it('autoSingle chooses the only valid option', () => {
    const eng = createEngine({ autoEmit:false })
    eng.loadScenes(scenes)
    eng.start('start')
    // advance to choice
    eng.next() // flag step executed, now at choice (autoSingle triggers)
    expect(eng.getPublicState().sceneId).toBe('branchA')
    expect(eng.getCurrentStep()?.type).toBe('dialogue')
  })

  it('autoDecide config chooses when one valid option remains', () => {
    const scenes2: SceneDef[] = [
      { id:'root', steps:[
        { type:'choice', options:[
          { label:'Only', goto:'end', condition:'flag:ready' },
          { label:'Blocked', goto:'end2', condition:'flag:missing' }
        ] }
      ]},
      { id:'end', steps:[ { type:'dialogue', text:'End.' } ]},
      { id:'end2', steps:[ { type:'dialogue', text:'Unused.' } ]}
    ]
    const eng = createEngine({ autoEmit:false, autoDecide:true })
    eng.loadScenes(scenes2)
    // set flag then start
    eng.start('root')
    eng.flags?.add?.('ready') // direct add for test simplicity
    // entering root choice should auto decide
    if(eng.getCurrentStep()?.type==='choice'){
      // trigger maybe auto by calling next which would otherwise halt
      eng.next()
    }
    expect(eng.getPublicState().sceneId).toBe('end')
  })
})
