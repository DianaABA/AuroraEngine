import type { SceneDef, ChoiceOption, SceneStep } from '../vn/sceneTypes'

/**
 * Error thrown during script parsing with line number context
 */
export class ScriptParseError extends Error {
  constructor(message: string, public readonly line?: number) {
    super(line ? `Line ${line}: ${message}` : message)
    this.name = 'ScriptParseError'
  }
}

type PendingChoice = {
  options: ChoiceOption[]
}

type SceneMetadata = {
  bg?: string
  music?: string
}

// Regex patterns
const CHOICE_OPTION_REGEX = /^-\s*(.*?)(?:\s*(?:->|→|=>)\s*(.+))?$/
const DIALOGUE_REGEX = /^([^:]+?):\s*(.+)$/
const SPRITE_SHOW_REGEX = /^(?:show|s)\s+(\S+)(?:\s+as\s+(\S+))?(?:\s+at\s+(\S+))?(?:\s+(.+))?$/i
const SPRITE_HIDE_REGEX = /^(?:hide|h)\s+(\S+)$/i
const SPRITE_SWAP_REGEX = /^(?:swap|sw)\s+(\S+)\s+(.+)$/i
const SPRITE_MOVE_REGEX = /^(?:move|mv)\s+(\S+)\s+(.+)$/i
const FLAG_REGEX = /^(?:flag|var|set)\s+(\S+)\s*=\s*(.+)$/i
const TRANSITION_REGEX = /^(?:fx|effect|transition)\s+(\S+)$/i
const GOTO_REGEX = /^(?:goto|jump|j)\s+(.+)$/i
const METADATA_REGEX = /^@(\w+)\s+(.+)$/

/**
 * Flush pending choice to current scene
 */
function flushChoice(current: SceneDef | null, pending: PendingChoice | null): PendingChoice | null {
  if (current && pending && pending.options.length > 0) {
    current.steps.push({ type: 'choice', options: pending.options })
  }
  return null
}

/**
 * Parse a choice option line (e.g., "- Accept the quest -> quest_start")
 */
function parseChoiceOption(line: string, lineNumber: number): ChoiceOption {
  const match = CHOICE_OPTION_REGEX.exec(line)
  if (!match) throw new ScriptParseError('Invalid choice option format', lineNumber)

  const label = match[1].trim()
  const goto = match[2]?.trim()

  if (!label) throw new ScriptParseError('Choice option missing label', lineNumber)

  const option: ChoiceOption = { label }
  if (goto) option.goto = goto

  return option
}

/**
 * Parse sprite position/move parameters
 * Format: x=50,y=-10,ms=400,ease=smooth
 */
function parsePositionParams(params: string): Record<string, string | number> {
  const result: Record<string, string | number> = {}
  const parts = params.split(',').map(p => p.trim())

  for (const part of parts) {
    const [key, value] = part.split('=').map(s => s.trim())
    if (!key || value === undefined) continue

    // Try to parse as number
    const num = parseFloat(value)
    result[key] = isNaN(num) ? value : num
  }

  return result
}

/**
 * Parse metadata line (e.g., "@bg forest.png")
 */
function parseMetadata(line: string, metadata: SceneMetadata, lineNumber: number): void {
  const match = METADATA_REGEX.exec(line)
  if (!match) return

  const key = match[1]
  const value = match[2].trim()

  switch (key) {
    case 'bg':
    case 'background':
      metadata.bg = value
      break

    case 'music':
    case 'bgm':
      metadata.music = value
      break

    default:
      throw new ScriptParseError(`Unknown metadata key: ${key}`, lineNumber)
  }
}

/**
 * Parse a script directive/command line
 */
function parseDirective(
  line: string,
  currentScene: SceneDef,
  lineNumber: number
): SceneStep | null {
  const trimmed = line.trim()

  // Background change
  const bgMatch = trimmed.match(/^bg\s+(.+)$/i)
  if (bgMatch) {
    return { type: 'background', src: bgMatch[1].trim() }
  }

  // Music change
  const musicMatch = trimmed.match(/^(?:music|m|bgm)\s+(.+)$/i)
  if (musicMatch) {
    return { type: 'music', track: musicMatch[1].trim() }
  }

  // Sprite show: show sprite_happy [as character] [at center] [x=50,y=0]
  const showMatch = SPRITE_SHOW_REGEX.exec(trimmed)
  if (showMatch) {
    const sprite = showMatch[1]
    const asChar = showMatch[2]
    const position = showMatch[3]
    const extraParams = showMatch[4]

    const step: any = { type: 'spriteShow', id: asChar || sprite, src: sprite }

    // Parse position preset
    if (position) {
      if (position === 'left' || position === 'center' || position === 'right') {
        step.pos = position
      }
    }

    // Parse extra parameters
    if (extraParams) {
      const params = parsePositionParams(extraParams)
      Object.assign(step, params)
    }

    return step
  }

  // Sprite hide: hide character
  const hideMatch = SPRITE_HIDE_REGEX.exec(trimmed)
  if (hideMatch) {
    return { type: 'spriteHide', id: hideMatch[1] }
  }

  // Sprite swap: swap character sprite_sad
  const swapMatch = SPRITE_SWAP_REGEX.exec(trimmed)
  if (swapMatch) {
    return { type: 'spriteSwap', id: swapMatch[1], src: swapMatch[2] }
  }

  // Sprite move: move character x=60,y=-5,ms=300
  // Note: Since there's no dedicated spriteMove step type, we convert to spriteSwap with moveTo
  const moveMatch = SPRITE_MOVE_REGEX.exec(trimmed)
  if (moveMatch) {
    const id = moveMatch[1]
    const params = parsePositionParams(moveMatch[2])
    // For now, skip sprite move as it requires the current sprite src
    // This would need runtime context to work properly
    return null
  }

  // Flag/variable: set flag_name = value
  const flagMatch = FLAG_REGEX.exec(trimmed)
  if (flagMatch) {
    const flag = flagMatch[1]
    let value: any = flagMatch[2]

    // Try to parse as boolean
    if (value === 'true') value = true
    else if (value === 'false') value = false
    else {
      // FlagSetStep only accepts boolean, so default to true if not boolean
      value = true
    }

    return { type: 'flag', flag, value }
  }

  // Transition: fx fade
  const fxMatch = TRANSITION_REGEX.exec(trimmed)
  if (fxMatch) {
    const effect = fxMatch[1]
    // Validate kind
    const validKinds = ['fade', 'slide', 'zoom', 'shake', 'flash']
    if (!validKinds.includes(effect)) {
      return { type: 'transition', kind: 'fade' } // Default to fade
    }
    return { type: 'transition', kind: effect as any }
  }

  // Goto: goto scene_id
  const gotoMatch = GOTO_REGEX.exec(trimmed)
  if (gotoMatch) {
    return { type: 'goto', scene: gotoMatch[1] }
  }

  return null
}

/**
 * Convert a plaintext script to scene definitions
 *
 * @example
 * ```
 * #scene intro
 * @bg forest.png
 * @music peaceful.mp3
 * @role guide=sprite_guide
 *
 * show sprite_guide as guide at center
 * Guide: Welcome to Aurora Engine!
 * Guide: This is a simple script format.
 *
 * ?
 * - Continue the tutorial -> tutorial
 * - Skip ahead -> main_story
 * ```
 */
export function convertScriptToScenes(script: string): SceneDef[] {
  const scenes: SceneDef[] = []
  const seenIds = new Set<string>()
  const lines = script.split(/\r?\n/)

  let currentScene: SceneDef | null = null
  let pendingChoice: PendingChoice | null = null
  let sceneMetadata: SceneMetadata = {}

  for (let idx = 0; idx < lines.length; idx++) {
    const raw = lines[idx]
    const lineNumber = idx + 1
    const trimmed = raw.trim()

    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith('//')) {
      pendingChoice = flushChoice(currentScene, pendingChoice)
      continue
    }

    // Scene header: #scene scene_id
    if (trimmed.startsWith('#scene')) {
      pendingChoice = flushChoice(currentScene, pendingChoice)

      // Save previous scene
      if (currentScene) {
        scenes.push(currentScene)
      }

      // Parse scene ID
      const sceneId = trimmed.slice(6).trim().split(/\s+/)[0]
      if (!sceneId) {
        throw new ScriptParseError('Scene header requires an id', lineNumber)
      }
      if (seenIds.has(sceneId)) {
        throw new ScriptParseError(`Duplicate scene id "${sceneId}"`, lineNumber)
      }

      seenIds.add(sceneId)

      // Create new scene with metadata
      currentScene = {
        id: sceneId,
        steps: [],
        ...sceneMetadata
      }

      // Reset metadata for next scene
      sceneMetadata = {}
      continue
    }

    // Section headers (ignored but allowed for organization)
    if (trimmed.startsWith('#')) {
      pendingChoice = flushChoice(currentScene, pendingChoice)
      continue
    }

    // Metadata line: @key value
    if (trimmed.startsWith('@')) {
      pendingChoice = flushChoice(currentScene, pendingChoice)
      parseMetadata(trimmed, sceneMetadata, lineNumber)

      // Apply metadata to current scene if it exists
      if (currentScene) {
        if (sceneMetadata.bg) currentScene.bg = sceneMetadata.bg
        if (sceneMetadata.music) currentScene.music = sceneMetadata.music

        // Clear applied metadata
        sceneMetadata = {}
      }
      continue
    }

    // Must be inside a scene
    if (!currentScene) {
      throw new ScriptParseError('Content must be inside a scene (start with `#scene`)', lineNumber)
    }

    // Choice block start: ?
    if (trimmed.startsWith('?')) {
      pendingChoice = flushChoice(currentScene, pendingChoice)
      pendingChoice = { options: [] }
      continue
    }

    // Choice option: - Label -> target
    if (trimmed.startsWith('-')) {
      if (!pendingChoice) {
        throw new ScriptParseError('Choice option is not inside a choice block', lineNumber)
      }
      pendingChoice.options.push(parseChoiceOption(trimmed, lineNumber))
      continue
    }

    // Try directive parsing
    pendingChoice = flushChoice(currentScene, pendingChoice)
    const directive = parseDirective(trimmed, currentScene, lineNumber)
    if (directive) {
      currentScene.steps.push(directive)
      continue
    }

    // Dialogue line: Character: Text
    const dialogueMatch = DIALOGUE_REGEX.exec(trimmed)
    if (dialogueMatch) {
      const char = dialogueMatch[1].trim()
      const text = dialogueMatch[2].trim()

      if (!text) {
        throw new ScriptParseError('Dialogue text cannot be empty', lineNumber)
      }

      currentScene.steps.push({
        type: 'dialogue',
        char: char || undefined,
        text
      })
      continue
    }

    // If we reach here, the line format is unknown
    throw new ScriptParseError(`Unrecognized line format: ${trimmed}`, lineNumber)
  }

  // Flush final choice and scene
  pendingChoice = flushChoice(currentScene, pendingChoice)
  if (currentScene) {
    scenes.push(currentScene)
  }

  if (scenes.length === 0) {
    throw new ScriptParseError('No scenes found in script')
  }

  return scenes
}

/**
 * Convert scenes back to script format
 */
export function convertScenesToScript(scenes: SceneDef[]): string {
  const lines: string[] = []

  for (const scene of scenes) {
    // Scene header
    lines.push(`#scene ${scene.id}`)

    // Metadata
    if (scene.bg) lines.push(`@bg ${scene.bg}`)
    if (scene.music) lines.push(`@music ${scene.music}`)

    lines.push('') // Blank line after metadata

    // Steps
    for (const step of scene.steps) {
      switch (step.type) {
        case 'dialogue':
          lines.push(`${step.char || ''}: ${step.text}`)
          break

        case 'choice':
          lines.push('?')
          for (const opt of step.options) {
            lines.push(`- ${opt.label}${opt.goto ? ` -> ${opt.goto}` : ''}`)
          }
          break

        case 'background':
          lines.push(`bg ${step.src}`)
          break

        case 'music':
          lines.push(`music ${step.track}`)
          break

        case 'spriteShow':
          lines.push(`show ${step.src}${step.id !== step.src ? ` as ${step.id}` : ''}${step.pos ? ` at ${step.pos}` : ''}`)
          break

        case 'spriteHide':
          lines.push(`hide ${step.id}`)
          break

        case 'spriteSwap':
          lines.push(`swap ${step.id} ${step.src}`)
          break

        case 'flag':
          lines.push(`set ${step.flag} = ${step.value}`)
          break

        case 'transition':
          lines.push(`fx ${step.kind}`)
          break

        case 'goto':
          lines.push(`goto ${step.scene}`)
          break
      }
    }

    lines.push('') // Blank line between scenes
  }

  return lines.join('\n')
}
