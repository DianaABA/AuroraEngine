import { describe, it, expect } from 'vitest'
import { computeBranchEdges } from '../templates/minimal/src/editorHelpers'

describe('editor branch map', () => {
  it('collects goto and choice targets', () => {
    const { edges, sceneIds } = computeBranchEdges([
      { id: 'intro', steps: [
        { type: 'goto', scene: 'a' },
        { type: 'choice', options: [ { label:'X', goto:'b' }, { label:'Y', goto:'c' } ] }
      ] },
      { id: 'a', steps: [] },
    ])
    expect(sceneIds.has('intro')).toBe(true)
    expect(sceneIds.has('a')).toBe(true)
    const targets = edges.map(e => e.to)
    expect(targets).toEqual(expect.arrayContaining(['a','b','c']))
  })

  it('handles missing ids gracefully', () => {
    const { edges, sceneIds } = computeBranchEdges([
      { id: '', steps: [ { type:'goto', scene:'missing' } ] } as any,
      { id: 'valid', steps: [] }
    ])
    expect(sceneIds.has('valid')).toBe(true)
    expect(sceneIds.has('')).toBe(false)
    expect(edges.some(e => e.to === 'missing')).toBe(false)
  })
})
