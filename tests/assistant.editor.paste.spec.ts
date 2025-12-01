import { describe, it, expect } from 'vitest'
import { loadScenesFromJsonStrict, validateSceneLinksStrict } from '../src'

const VALID_JSON = JSON.stringify([
  {
    id: 'intro',
    steps: [ { type:'dialogue', text:'Hello' } ]
  }
])

const INVALID_JSON = JSON.stringify([
  {
    id: 'intro',
    steps: [ { type:'choice', options:[ { label:'Go', goto:'missing' } ] } ]
  }
])

describe('Assistant → Editor paste + lint path', () => {
  it('validates OK for a simple scene bundle', () => {
    const { scenes, errors } = loadScenesFromJsonStrict(VALID_JSON)
    expect(errors?.length || 0).toBe(0)
    const linkIssues = validateSceneLinksStrict(scenes as any)
    expect(linkIssues.length).toBe(0)
  })

  it('reports link errors for missing goto targets', () => {
    const { scenes, errors } = loadScenesFromJsonStrict(INVALID_JSON)
    expect(errors?.length || 0).toBe(0)
    const linkIssues = validateSceneLinksStrict(scenes as any)
    expect(linkIssues.length).toBeGreaterThan(0)
  })
})
