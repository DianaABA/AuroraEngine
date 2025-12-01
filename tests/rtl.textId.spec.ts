import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { loadScenesFromJsonStrict } from '../src/vn/sceneLoader'

describe('RTL scenes accept textId in dialogue', () => {
  it('validates templates/minimal/public/scenes/rtl.json strictly with no dialogue.missing_text', () => {
    const fp = resolve(__dirname, '../templates/minimal/public/scenes/rtl.json')
    const json = readFileSync(fp, 'utf8')
    const { scenes, errors } = loadScenesFromJsonStrict(json)
    // ensure scenes parsed
    expect(scenes.length).toBeGreaterThan(0)
    // no missing_text errors expected now that textId is supported
    const missingTextErrors = (errors || []).filter(e => String(e.code).includes('dialogue.missing_text'))
    expect(missingTextErrors.length).toBe(0)
  })
})
