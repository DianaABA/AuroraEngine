import { describe, it, expect } from 'vitest'
import { remapRoles } from '../src/vn/sceneLoader'
import type { SceneDef } from '../src/vn/sceneTypes'

describe('remapRoles', () => {
  it('replaces role with concrete sprite ids and strips role field', () => {
    const scenes: SceneDef[] = [
      {
        id: 'intro',
        roles: { guide: 'spr_guide' } as any,
        steps: [
          { type:'spriteShow', role:'guide', id:'unused', src:'guide.png' } as any,
          { type:'spriteSwap', role:'guide', id:'unused2', src:'guide2.png' } as any,
          { type:'spriteHide', role:'guide', id:'unused3' } as any
        ]
      } as any
    ]
    const mapped = remapRoles(scenes as any)
    const s = mapped[0]
    const ids = s.steps.map((st:any)=> st.id)
    expect(ids).toEqual(['spr_guide','spr_guide','spr_guide'])
    expect(s.steps.every((st:any)=> st.role === undefined)).toBe(true)
  })
})
