import { describe, it, expect } from 'vitest'
import { validateSceneJsonText, incrementalValidate } from '../templates/minimal/src/editorValidate'

describe('editor validate helpers', () => {
  it('validates a correct scene array', () => {
    const json = JSON.stringify([
      { id: 'intro', steps: [ { type:'dialogue', text:'hello' } ] },
      { id: 'next', steps: [] }
    ])
    const res = validateSceneJsonText(json)
    expect(res.ok).toBe(true)
    expect(res.scenes?.length).toBe(2)
  })

  it('catches link errors', () => {
    const json = JSON.stringify([
      { id: 'intro', steps: [ { type:'goto', scene:'missing' } ] }
    ])
    const res = validateSceneJsonText(json)
    expect(res.ok).toBe(false)
    expect(res.message).toContain('missing')
  })

  it('incrementally parses partial JSON', () => {
    const partial = '[{"id":"intro","steps":[{"type":"dialogue","text":"hi"}]}'
    const res = incrementalValidate(partial)
    expect(res.partial).toBe(true)
    const full = partial + ']'
    const ok = incrementalValidate(full)
    expect(ok.ok).toBe(true)
    expect(ok.partial).toBe(false)
  })
})
