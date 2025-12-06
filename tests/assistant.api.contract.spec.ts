import { describe, it, expect } from 'vitest'

// Contract stubs: validate shapes returned by helper functions (to be implemented)

type ModelInfo = { id: string; provider: string }

type ModelsResponse = { providers: string[]; models: ModelInfo[] }

describe('Assistant API contracts (stubs)', () => {
  it('models response shape is valid', () => {
    const sample: ModelsResponse = {
      providers: ['openai', 'anthropic', 'groq', 'deepseek'],
      models: [ { id: 'gpt-4o-mini', provider: 'openai' }, { id: 'local-tiny', provider: 'local' } ]
    }
    expect(Array.isArray(sample.providers)).toBe(true)
    expect(sample.providers.length).toBeGreaterThan(0)
    expect(sample.models.every(m => typeof m.id==='string' && typeof m.provider==='string')).toBe(true)
  })

  it('NDJSON stream events are recognizable', () => {
    const events = [
      { type: 'chunk', data: '...' },
      { type: 'error', message: 'oops' },
      { type: 'done' }
    ]
    const ok = events.every(ev => typeof ev.type === 'string')
    expect(ok).toBe(true)
  })
})
