import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import { createPackRegistry } from '../src/packs/loader'
import type { PackManifest } from '../src/packs/manifest'
import { loadScenesFromJsonStrict } from '../src/vn/sceneLoader'

const TEMPLATE_PUBLIC = path.join(__dirname, '..', 'templates', 'minimal', 'public')
const PACKS_JSON = path.join(TEMPLATE_PUBLIC, 'packs.json')

function readText(p: string){ return fs.readFileSync(p, 'utf-8') }

describe('packs manifest (templates/minimal/public/packs.json)', () => {
  it('exists and contains expected packs', () => {
    expect(fs.existsSync(PACKS_JSON)).toBe(true)
    const manifest: PackManifest = JSON.parse(readText(PACKS_JSON))
    const ids = new Set(manifest.packs.map(p => p.id))
    for(const id of ['example','expressions','achievements','rtl','byok']){
      expect(ids.has(id)).toBe(true)
    }
  })

  it('registry can resolve entries and scenes files exist', () => {
    const manifest: PackManifest = JSON.parse(readText(PACKS_JSON))
    const reg = createPackRegistry(manifest)
    for(const p of manifest.packs){
      const entry = reg.get(p.id)
      expect(entry).toBeTruthy()
      const rel = (entry!.scenesUrl || '').replace(/^\//, '')
      const file = path.join(TEMPLATE_PUBLIC, rel)
      expect(fs.existsSync(file)).toBe(true)
    }
  })

  it('each pack JSON has a start scene id; strict-valid except rtl', () => {
    const manifest: PackManifest = JSON.parse(readText(PACKS_JSON))
    for(const p of manifest.packs){
      const rel = (p.scenesUrl || '').replace(/^\//, '')
      const file = path.join(TEMPLATE_PUBLIC, rel)
      const jsonText = readText(file)
      const strict = loadScenesFromJsonStrict(jsonText)
      // RTL pack demonstrates textId/RTL and may fail strict text checks; others must be clean
      if(p.id !== 'rtl'){
        expect(strict.errors, `errors in pack ${p.id}`).toEqual([])
      }
      const arr = JSON.parse(jsonText)
      const start = (p.meta && (p.meta as any).start) || 'intro'
      const ids = new Set(Array.isArray(arr) ? arr.map((s:any)=> s.id) : [])
      expect(ids.has(start)).toBe(true)
    }
  })
})
