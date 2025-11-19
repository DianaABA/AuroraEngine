import { describe, it, expect } from 'vitest'
import { loadScenesFromJson, validateSceneDef } from '../src/vn/sceneLoader'

describe('sceneLoader', () => {
  it('parses valid array of scenes', () => {
    const json = JSON.stringify([{ id:'a', steps:[{ type:'dialogue', text:'hi' }] }])
    const { scenes, errors } = loadScenesFromJson(json)
    expect(errors).toEqual([])
    expect(scenes.length).toBe(1)
    expect(scenes[0].id).toBe('a')
  })
  it('reports missing fields with indexed paths', () => {
    const bad = { id:'intro', steps:[ { type:'dialogue' }, { type:'choice', options: [] } ] }
    const { error } = validateSceneDef(bad) as any
    expect(error).toBeTruthy()
    expect(error).toContain('scene:intro:step[0]:dialogue.missing_text')
    expect(error).toContain('scene:intro:step[1]:choice.missing_options')
  })
  it('handles root non-array/object', () => {
    const { scenes, errors } = loadScenesFromJson('"oops"')
    expect(scenes.length).toBe(0)
    expect(errors[0]).toContain('json_root_must_be_array_or_object')
  })
})
