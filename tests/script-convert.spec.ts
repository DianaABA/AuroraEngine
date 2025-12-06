import { describe, expect, it } from 'vitest'
import { convertScriptToScenes, convertScenesToScript, ScriptParseError } from '../src/utils/scriptConverter'

describe('AAA Script Converter', () => {
  it('converts basic dialogue script to scenes', () => {
    const script = `
#scene intro
Guide: Welcome to Aurora Engine!
Guide: This is a test scene.
    `.trim()

    const scenes = convertScriptToScenes(script)
    expect(scenes).toHaveLength(1)
    expect(scenes[0].id).toBe('intro')
    expect(scenes[0].steps).toHaveLength(2)
    expect(scenes[0].steps[0]).toEqual({ type: 'dialogue', char: 'Guide', text: 'Welcome to Aurora Engine!' })
  })

  it('parses metadata directives', () => {
    const script = `
#scene forest
@bg forest.png
@music peaceful.mp3

Guide: Welcome to the forest!
    `.trim()

    const scenes = convertScriptToScenes(script)
    expect(scenes[0].bg).toBe('forest.png')
    expect(scenes[0].music).toBe('peaceful.mp3')
  })

  it('parses sprite directives', () => {
    const script = `
#scene sprites

show sprite_happy as hero at center
hero: I'm happy!

swap hero sprite_sad
hero: Now I'm sad...

hide hero
    `.trim()

    const scenes = convertScriptToScenes(script)
    const steps = scenes[0].steps

    expect(steps[0]).toMatchObject({
      type: 'spriteShow',
      id: 'hero',
      src: 'sprite_happy',
      pos: 'center'
    })

    expect(steps[1]).toEqual({
      type: 'dialogue',
      char: 'hero',
      text: "I'm happy!"
    })

    expect(steps[2]).toEqual({
      type: 'spriteSwap',
      id: 'hero',
      src: 'sprite_sad'
    })

    expect(steps[4]).toEqual({
      type: 'spriteHide',
      id: 'hero'
    })
  })

  it('parses sprite positions with parameters', () => {
    const script = `
#scene positioning

show sprite_guide as guide x=50,y=-10,moveMs=400
    `.trim()

    const scenes = convertScriptToScenes(script)
    const steps = scenes[0].steps

    expect(steps[0]).toMatchObject({
      type: 'spriteShow',
      id: 'guide',
      src: 'sprite_guide',
      x: 50,
      y: -10,
      moveMs: 400
    })
  })

  it('parses choices with goto targets', () => {
    const script = `
#scene choice_test
Guide: What will you do?

?
- Accept the quest -> quest_start
- Decline -> town
- Ask for more info
    `.trim()

    const scenes = convertScriptToScenes(script)
    const choice = scenes[0].steps.find(s => s.type === 'choice')

    expect(choice).toBeDefined()
    expect(choice.options).toHaveLength(3)
    expect(choice.options[0]).toEqual({ label: 'Accept the quest', goto: 'quest_start' })
    expect(choice.options[1]).toEqual({ label: 'Decline', goto: 'town' })
    expect(choice.options[2]).toEqual({ label: 'Ask for more info' })
  })

  it('parses flag/variable assignments', () => {
    const script = `
#scene flags

set quest_started = true
set quest_completed = false
    `.trim()

    const scenes = convertScriptToScenes(script)
    const steps = scenes[0].steps

    expect(steps[0]).toEqual({ type: 'flag', flag: 'quest_started', value: true })
    expect(steps[1]).toEqual({ type: 'flag', flag: 'quest_completed', value: false })
  })

  it('parses background and music changes', () => {
    const script = `
#scene atmosphere

bg sunset.png
music dramatic.mp3

Guide: The sun sets dramatically.

bg night.png
music mysterious.mp3
    `.trim()

    const scenes = convertScriptToScenes(script)
    const steps = scenes[0].steps

    expect(steps[0]).toEqual({ type: 'background', src: 'sunset.png' })
    expect(steps[1]).toEqual({ type: 'music', track: 'dramatic.mp3' })
    expect(steps[3]).toEqual({ type: 'background', src: 'night.png' })
    expect(steps[4]).toEqual({ type: 'music', track: 'mysterious.mp3' })
  })

  it('parses transitions and goto', () => {
    const script = `
#scene transitions

fx fade
Guide: This fades in.

fx shake
Guide: This shakes!

goto next_scene
    `.trim()

    const scenes = convertScriptToScenes(script)
    const steps = scenes[0].steps

    expect(steps[0]).toEqual({ type: 'transition', kind: 'fade' })
    expect(steps[2]).toEqual({ type: 'transition', kind: 'shake' })
    expect(steps[4]).toEqual({ type: 'goto', scene: 'next_scene' })
  })

  it('supports comments and blank lines', () => {
    const script = `
// This is a comment
#scene test

// Another comment
Guide: First line

// Blank lines are OK

Guide: Second line
    `.trim()

    const scenes = convertScriptToScenes(script)
    expect(scenes[0].steps).toHaveLength(2)
  })

  it('handles multiple scenes', () => {
    const script = `
#scene intro
Guide: Scene one

#scene middle
Guide: Scene two

#scene end
Guide: Scene three
    `.trim()

    const scenes = convertScriptToScenes(script)
    expect(scenes).toHaveLength(3)
    expect(scenes[0].id).toBe('intro')
    expect(scenes[1].id).toBe('middle')
    expect(scenes[2].id).toBe('end')
  })

  it('throws error on duplicate scene IDs', () => {
    const script = `
#scene intro
Guide: First

#scene intro
Guide: Duplicate!
    `.trim()

    expect(() => convertScriptToScenes(script)).toThrow(ScriptParseError)
    expect(() => convertScriptToScenes(script)).toThrow('Duplicate scene id')
  })

  it('throws error on choice option outside choice block', () => {
    const script = `
#scene bad
- This is wrong
    `.trim()

    expect(() => convertScriptToScenes(script)).toThrow(ScriptParseError)
    expect(() => convertScriptToScenes(script)).toThrow('not inside a choice block')
  })

  it('throws error on content before scene definition', () => {
    const script = `
Guide: This comes too early
#scene test
    `.trim()

    expect(() => convertScriptToScenes(script)).toThrow(ScriptParseError)
    expect(() => convertScriptToScenes(script)).toThrow('inside a scene')
  })

  it('converts scenes back to script format', () => {
    const original = `
#scene intro
@bg forest.png
@music peaceful.mp3

show sprite_guide as guide at center
Guide: Welcome!

?
- Continue -> next
- Quit
    `.trim()

    const scenes = convertScriptToScenes(original)
    const regenerated = convertScenesToScript(scenes).trim()

    // Convert both back to verify round-trip
    const scenesAgain = convertScriptToScenes(regenerated)
    expect(scenesAgain).toEqual(scenes)
  })

  it('supports alternative arrow syntaxes for choices', () => {
    const script = `
#scene arrows
?
- Option 1 -> target1
- Option 2 → target2
- Option 3 => target3
    `.trim()

    const scenes = convertScriptToScenes(script)
    const choice = scenes[0].steps[0]

    expect(choice.options[0].goto).toBe('target1')
    expect(choice.options[1].goto).toBe('target2')
    expect(choice.options[2].goto).toBe('target3')
  })

  it('supports short command aliases', () => {
    const script = `
#scene aliases

s sprite_a as char
h char
sw other sprite_b
m music.mp3
j next_scene
    `.trim()

    const scenes = convertScriptToScenes(script)
    const steps = scenes[0].steps

    expect(steps[0].type).toBe('spriteShow')
    expect(steps[1].type).toBe('spriteHide')
    expect(steps[2].type).toBe('spriteSwap')
    expect(steps[3].type).toBe('music')
    expect(steps[4].type).toBe('goto')
  })
})
