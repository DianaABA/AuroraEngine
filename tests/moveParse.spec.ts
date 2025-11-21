import { describe, it, expect } from 'vitest'

function parseMove(input: string){
  if(!input) return null
  const parts = input.split(',').map(p=> p.trim()).filter(Boolean)
  if(!parts.length) return null
  const mv: any = { ms: 250, ease: 'ease-in-out' }
  for(const p of parts){
    const [k,v] = p.split('=').map(s=> (s||'').trim())
    if(k === 'x') mv.x = Number(v)
    if(k === 'y') mv.y = Number(v)
    if(k === 'ms') mv.ms = Number(v)
    if(k === 'ease') mv.ease = v
  }
  return mv
}

describe('parseMove helper', () => {
  it('parses x/y/ms/ease', () => {
    const mv = parseMove('x=40, y=-10, ms=400, ease=easeOutBack')!
    expect(mv.x).toBe(40)
    expect(mv.y).toBe(-10)
    expect(mv.ms).toBe(400)
    expect(mv.ease).toBe('easeOutBack')
  })
  it('returns null on empty input', () => {
    expect(parseMove('')).toBeNull()
  })
})
