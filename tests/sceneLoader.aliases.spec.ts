import { describe, it, expect } from 'vitest'
import { validateScenesStrictCollection } from '../src/vn/sceneLoader'

describe('sceneLoader alias normalization', () => {
  it('accepts jump/show/hide/bg aliases', () => {
    const scenes = [
      {
        id: 'a',
        steps: [
          { type: 'bg', src: 'bg.png' },
          { type: 'show', id: 'mc', src: 'mc.png' },
          { type: 'hide', id: 'mc' },
          { type: 'jump', target: 'b' },
        ],
      },
      { id: 'b', steps: [ { type: 'dialogue', text: 'Ok' } ] }
    ]
    const { scenes: out, errors } = validateScenesStrictCollection(scenes)
    expect(errors, JSON.stringify(errors)).toHaveLength(0)
    expect(out).toHaveLength(2)
  })

  it('maps jump.label and jump.scene to goto.scene', () => {
    const scenes = [
      { id: 'a', steps: [ { type: 'jump', label: 'b' } ] },
      { id: 'b', steps: [ { type: 'dialogue', text: 'x' } ] },
    ]
    const { errors } = validateScenesStrictCollection(scenes)
    expect(errors, JSON.stringify(errors)).toHaveLength(0)
  })
})
