import { describe, it, expect } from 'vitest'
import { createEngine } from '../src/vn/engine'
import { on } from '../src/utils/eventBus'
import type { SceneDef } from '../src/vn/sceneTypes'

describe('VNEngine auto-choice hint event', () => {
  it('emits hint with strategy and option metadata when autoSingle applies', () => {
    const eng = createEngine({ autoEmit: true })
    const events: any[] = []
    const off = on('vn:auto-choice-hint', (d:any) => events.push(d))

    const scenes: SceneDef[] = [
      { id:'start', steps:[
        { type:'choice', autoSingle:true, options:[
          { label:'Go', goto:'end' },
          { label:'Hidden', goto:'skip', condition:'flag:hidden' }
        ] }
      ]},
      { id:'end', steps:[ { type:'dialogue', text:'done' } ]},
      { id:'skip', steps:[ { type:'dialogue', text:'skip' } ]}
    ]

    eng.loadScenes(scenes)
    eng.start('start')

    expect(events.length).toBe(1)
    const evt = events[0]
    expect(evt.strategy).toBe('autoSingle')
    expect(evt.chosenLabel).toBe('Go')
    expect(evt.validOptions).toBe(1)
    expect(evt.options).toBe(2)
    off()
  })
})
