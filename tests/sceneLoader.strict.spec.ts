import { describe, it, expect } from 'vitest'
import { validateSceneDefStrict, validateSceneLinksStrict, loadScenesFromJsonStrict } from '../src/vn/sceneLoader'

describe('sceneLoader strict validation', () => {
  it('returns structured codes and paths for invalid steps', () => {
    const bad = {
      id: 'intro',
      steps: [
        { type: 'dialogue' },
        { type: 'spriteShow', id: 'hero', src: 'hero.png', pos: 'wrong', moves:[{ x:'oops' as any }] }
      ]
    }
    const { errors } = validateSceneDefStrict(bad as any)
    const codes = errors.map(e => e.code)
    expect(codes).toContain('dialogue.missing_text')
    expect(codes).toContain('sprite.pos_invalid')
    expect(codes).toContain('sprite.moves.x_not_number')
    expect(errors.some(e => e.path.includes('step[0]'))).toBe(true)
    expect(errors.some(e => e.path.includes('step[1]'))).toBe(true)
  })

  it('detects unknown goto targets across scenes', () => {
    const scenes: any = [
      { id: 'a', steps: [ { type:'dialogue', text:'hi' }, { type:'goto', scene:'missing' } ] },
      { id: 'b', steps: [ { type:'choice', options:[ { label:'X', goto:'missing' } ] } ] }
    ]
    const issues = validateSceneLinksStrict(scenes)
    expect(issues.some(i => i.code === 'goto.unknown_scene')).toBe(true)
    expect(issues.some(i => i.code === 'choice.goto.unknown_scene')).toBe(true)
  })

  it('loads scenes from JSON strictly when valid', () => {
    const json = JSON.stringify([{ id:'ok', steps:[ { type:'dialogue', text:'hi' } ] }])
    const { scenes, errors } = loadScenesFromJsonStrict(json)
    expect(errors.length).toBe(0)
    expect(scenes.length).toBe(1)
    expect(scenes[0].id).toBe('ok')
  })
})
