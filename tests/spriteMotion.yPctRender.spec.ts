import { describe, it, expect } from 'vitest'
import { resolveYPercent } from '../templates/minimal/src/helpers'

describe('sprite rendering helpers', () => {
  it('prefers yPct over y and clamps to [-200, 200]', () => {
    expect(resolveYPercent({ y: 10, yPct: -30 })).toBe(-30)
    expect(resolveYPercent({ y: -999 })).toBe(-200)
    expect(resolveYPercent({ yPct: 250 })).toBe(200)
    expect(resolveYPercent({})).toBe(0)
  })
})
