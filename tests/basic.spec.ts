import { describe, it, expect } from 'vitest'
import { GameStateManager, runSteps } from '../src'

describe('Aurora Engine basic', () => {
  it('applies a flag step', () => {
    const manager = new GameStateManager()
    runSteps([ { type: 'flags', flagsAdd: ['testFlag'] } ], manager)
    expect(manager.getCurrentState().flags.has('testFlag')).toBe(true)
  })
})
