import { describe, expect, it } from 'vitest'
import { convertScriptToScenes, ScriptParseError } from '../src/utils/scriptConverter'

describe('convertScriptToScenes', () => {
  it('converts a simple script into scenes and choices', () => {
    const script = `
#scene intro
BG forest_day
Mia: It’s beautiful today.
? What should we do?
- Explore -> explore
- Stay cautious -> caution
`
    const scenes = convertScriptToScenes(script)
    expect(scenes).toHaveLength(1)
    expect(scenes[0]).toMatchObject({
      id: 'intro',
      bg: 'forest_day',
      steps: [
        { type: 'dialogue', char: 'Mia', text: "It’s beautiful today." },
        {
          type: 'choice',
          options: [
            { label: 'Explore', goto: 'explore' },
            { label: 'Stay cautious', goto: 'caution' }
          ]
        }
      ]
    })
  })

  it('throws when script contains no scene headers', () => {
    expect(() => convertScriptToScenes('Mia: without scene')).toThrow(ScriptParseError)
  })
})
