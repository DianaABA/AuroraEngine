import { describe, it, expect } from 'vitest'
import { loadScenesFromJsonStrict } from '../src/vn/sceneLoader'

describe('sprite motion yPct propagation', () => {
  it('preserves yPct on placement, moveTo, and moves when loading JSON', () => {
    const json = JSON.stringify([{
      id: 'intro',
      steps: [{
        type: 'spriteShow',
        id: 'hero',
        src: 'hero.png',
        yPct: -5,
        moveTo: { x: 60, yPct: -12, ms: 300, ease: 'easeOutBack' },
        moves: [
          { yPct: -8, ms: 180 },
          { yPct: -4, ms: 120, ease: 'easeInOutSine' }
        ]
      }]
    }])

    const { scenes, errors } = loadScenesFromJsonStrict(json)
    expect(errors).toHaveLength(0)
    expect(scenes).toHaveLength(1)
    const step = scenes[0].steps[0] as any
    expect(step.yPct).toBe(-5)
    expect(step.moveTo?.yPct).toBe(-12)
    expect(step.moves?.[0].yPct).toBe(-8)
    expect(step.moves?.[1].yPct).toBe(-4)
  })
})
