import { describe, it, expect } from 'vitest'
import { loadScenesFromJson, validateSceneDef, validateSceneDefStrict } from '../src/vn/sceneLoader'

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
    const { errors } = validateSceneDefStrict(bad) as any
    expect(errors.length).toBeGreaterThan(0)
    const codes = errors.map((e:any)=> e.code)
    const paths = errors.map((e:any)=> e.path)
    expect(codes).toContain('dialogue.missing_text')
    expect(codes).toContain('choice.missing_options')
    expect(paths.some((p:string)=> p.includes('step[0]'))).toBe(true)
    expect(paths.some((p:string)=> p.includes('step[1]'))).toBe(true)
  })
  it('handles root non-array/object', () => {
    const { scenes, errors } = loadScenesFromJson('"oops"')
    expect(scenes.length).toBe(0)
    expect(errors[0]).toContain('json_root_must_be_array_or_object')
  })
})
