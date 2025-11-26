import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import Ajv from 'ajv'

const schemaPath = resolve(__dirname, '../docs/scene-schema.json')
const schema = JSON.parse(readFileSync(schemaPath, 'utf8'))

function validate(data: unknown) {
  const ajv = new Ajv({ allErrors: true })
  const validateFn = ajv.compile(schema)
  const valid = validateFn(data)
  return { valid, errors: validateFn.errors || [] }
}

describe('scene-schema.json', () => {
  it('accepts a minimal valid scene bundle', () => {
    const { valid, errors } = validate([
      { id: 'intro', steps: [{ type: 'dialogue', text: 'hi' }] }
    ])
    expect(valid).toBe(true)
    expect(errors).toHaveLength(0)
  })

  it('rejects scenes missing required id/steps', () => {
    const { valid, errors } = validate([{}])
    expect(valid).toBe(false)
    const hasIdError = errors.some(e => e.keyword === 'required' && (e.params as any)?.missingProperty === 'id')
    const hasStepsError = errors.some(e => e.keyword === 'required' && (e.params as any)?.missingProperty === 'steps')
    expect(hasIdError).toBe(true)
    expect(hasStepsError).toBe(true)
  })

  it('enforces allowed step shapes and enums (choice + transition)', () => {
    const { valid, errors } = validate([{
      id: 'intro',
      steps: [
        { type: 'choice', options: [{ label: 'Go', goto: 'a' }] },
        { type: 'transition', kind: 'fade', duration: 300 }
      ]
    }])
    expect(valid).toBe(true)
    expect(errors).toHaveLength(0)

    const bad = validate([{
      id: 'intro',
      steps: [
        { type: 'choice', options: [{ label: 'Bad', weight: 'heavy' as any }] },
        { type: 'transition', kind: 'spin', duration: 'fast' as any }
      ]
    }])
    expect(bad.valid).toBe(false)
    expect(bad.errors.some(e => `${e.instancePath}`.includes('/0/steps/0/options/0/weight'))).toBe(true)
    expect(bad.errors.some(e => `${e.instancePath}`.includes('/0/steps/1/kind'))).toBe(true)
  })

  it('allows sprite yPct fields on placement, moveTo, and moves', () => {
    const { valid, errors } = validate([{
      id: 'intro',
      steps: [{
        type: 'spriteShow',
        id: 'hero',
        src: 'hero.png',
        yPct: -8,
        moveTo: { x: 40, yPct: -10, ms: 300 },
        moves: [{ yPct: -6, ms: 200 }]
      }]
    }])
    expect(valid).toBe(true)
    expect(errors).toHaveLength(0)
  })
})
