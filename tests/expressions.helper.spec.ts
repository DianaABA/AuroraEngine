import { describe, it, expect } from 'vitest'
import { stepShowExpression, stepSwapExpression, stepHideExpression } from '../src/utils/expressions'
import { createEngine } from '../src/vn/engine'
import type { SceneDef } from '../src/vn/sceneTypes'

const MAP = {
  hero: {
    neutral: 'hero_neutral.png',
    happy: 'hero_happy.png',
  }
}

describe('Expression helpers', () => {
  it('builds sprite show/swap/hide steps from map and applies via engine', () => {
    const show = stepShowExpression('hero', 'neutral', MAP)
    const swap = stepSwapExpression('hero', 'happy', MAP)
    const hide = stepHideExpression('hero')

    const scenes: SceneDef[] = [
      { id:'expr', steps:[ show, { type:'dialogue', text:'hi' }, swap, { type:'goto', scene:'next' } ]},
      { id:'next', steps:[ { type:'dialogue', text:'ok' }, hide ]}
    ]
    const eng = createEngine({ autoEmit:false, autoAdvance:true })
    eng.loadScenes(scenes)
    eng.start('expr')
    expect(eng.getPublicState().sprites['hero']).toBe('hero_happy.png')
    // Paused at first dialogue ('ok') in next scene
    expect(eng.getCurrentStep()?.type).toBe('dialogue')
    eng.next() // consume 'ok' dialogue
    // Next step is a side-effect (spriteHide); next() will present it as current step
    expect(eng.getCurrentStep()?.type).toBe('spriteHide')
    eng.next() // apply hide
    expect(eng.getCurrentStep() || undefined).toBeUndefined()
    expect(eng.getPublicState().sprites['hero']).toBeUndefined()
  })

  it('throws descriptive errors for missing character or variant', () => {
    expect(()=> stepShowExpression('villain','smirk', MAP as any)).toThrowError('expression:character_not_found:villain')
    expect(()=> stepSwapExpression('hero','angry', MAP as any)).toThrowError('expression:variant_not_found:hero:angry')
  })
})
