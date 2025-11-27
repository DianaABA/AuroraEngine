import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'

const packs = ['example', 'expressions', 'achievements', 'rtl', 'byok']

function loadPack(name: string){
  const file = path.join(__dirname, '..', 'templates', 'minimal', 'public', 'scenes', `${name}.json`)
  const raw = fs.readFileSync(file, 'utf-8')
  const json = JSON.parse(raw)
  if(!Array.isArray(json)) throw new Error(`Pack ${name} is not an array`)
  return json
}

describe('template packs', () => {
  it('all packs are present and parseable', () => {
    for(const p of packs){
      expect(() => loadPack(p)).not.toThrow()
    }
  })

  it('example pack uses the new default background', () => {
    const scenes = loadPack('example')
    const intro = scenes.find((s:any)=> s.id === 'intro')
    expect(intro?.bg).toBe('bg/aurora_engine_background.png')
  })
})
