import { describe, it, expect } from 'vitest'
import { createEngine } from '../src/vn/engine'
import type { SceneDef } from '../src/vn/sceneTypes'

describe('Sprite expression swap', () => {
  it('replaces sprite src with spriteSwap and persists until hidden', () => {
    const scenes: SceneDef[] = [
      { id:'expr', steps:[
        { type:'spriteShow', id:'hero', src:'hero_neutral.png' },
        { type:'dialogue', text:'...' },
        { type:'spriteSwap', id:'hero', src:'hero_happy.png' },
        { type:'goto', scene:'next' }
      ]},
      { id:'next', steps:[ { type:'dialogue', text:'Continue' } ]}
    ]
    const eng = createEngine({ autoEmit:false, autoAdvance:true })
    eng.loadScenes(scenes)
    eng.start('expr')
    expect(eng.getPublicState().sprites['hero']).toBe('hero_happy.png')
    expect(eng.getPublicState().sceneId).toBe('next')
    expect(eng.getCurrentStep()?.type).toBe('dialogue')
  })
})
