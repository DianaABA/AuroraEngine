import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import Ajv from 'ajv'

describe('RTL scenes accept textId in dialogue (schema)', () => {
  it('schema validates templates/minimal/public/scenes/rtl.json (textId or text allowed)', () => {
    const jsonPath = resolve(__dirname, '../templates/minimal/public/scenes/rtl.json')
    const schemaPath = resolve(__dirname, '../docs/scene-schema.json')
    const data = JSON.parse(readFileSync(jsonPath, 'utf8'))
    const schema = JSON.parse(readFileSync(schemaPath, 'utf8'))
    const ajv = new Ajv({ allErrors: true })
    const validate = ajv.compile(schema)
    const ok = validate(data)
    if(!ok){
      const details = (validate.errors||[]).map(e => `${e.instancePath||'/'} :: ${e.message}`).join('\n')
      throw new Error('Schema invalid:\n'+details)
    }
    expect(ok).toBe(true)
  })
})
