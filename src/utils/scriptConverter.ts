import type { SceneDef, ChoiceOption } from '../vn/sceneTypes'

export class ScriptParseError extends Error {
  constructor(message: string, public readonly line?: number) {
    super(line ? `Line ${line}: ${message}` : message)
    this.name = 'ScriptParseError'
  }
}

type PendingChoice = {
  options: ChoiceOption[]
}

const CHOICE_OPTION_REGEX = /^-\s*(.*?)(?:\s*(?:->|→|=>)\s*(.+))?$/

function flushChoice(current: SceneDef | null, pending: PendingChoice | null): PendingChoice | null {
  if (current && pending && pending.options.length > 0) {
    current.steps.push({ type: 'choice', options: pending.options })
  }
  return null
}

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

export function convertScriptToScenes(script: string): SceneDef[] {
  const scenes: SceneDef[] = []
  const seenIds = new Set<string>()
  const lines = script.split(/\r?\n/)
  let currentScene: SceneDef | null = null
  let pendingChoice: PendingChoice | null = null

  for (let idx = 0; idx < lines.length; idx++) {
    const raw = lines[idx]
    const lineNumber = idx + 1
    const trimmed = raw.trim()
    if (!trimmed || trimmed.startsWith('//')) {
      pendingChoice = flushChoice(currentScene, pendingChoice)
      continue
    }
    if (trimmed.startsWith('#scene')) {
      pendingChoice = flushChoice(currentScene, pendingChoice)
      const sceneId = trimmed.slice(6).trim().split(/\s+/)[0]
      if (!sceneId) throw new ScriptParseError('Scene header requires an id', lineNumber)
      if (seenIds.has(sceneId)) throw new ScriptParseError(`Duplicate scene id "${sceneId}"`, lineNumber)
      seenIds.add(sceneId)
      if (currentScene) scenes.push(currentScene)
      currentScene = { id: sceneId, steps: [] }
      continue
    }
    if (trimmed.startsWith('#')) {
      pendingChoice = flushChoice(currentScene, pendingChoice)
      continue
    }
    if (!currentScene) throw new ScriptParseError('Scene definition must start with `#scene`', lineNumber)

    const bgMatch = trimmed.match(/^bg\s+(.+)$/i)
    if (bgMatch) {
      pendingChoice = flushChoice(currentScene, pendingChoice)
      currentScene.bg = bgMatch[1].trim()
      continue
    }
    const musicMatch = trimmed.match(/^(?:music|m|bgm)\s+(.+)$/i)
    if (musicMatch) {
      pendingChoice = flushChoice(currentScene, pendingChoice)
      currentScene.music = musicMatch[1].trim()
      continue
    }

    if (trimmed.startsWith('?')) {
      pendingChoice = flushChoice(currentScene, pendingChoice)
      pendingChoice = { options: [] }
      continue
    }

    if (trimmed.startsWith('-')) {
      if (!pendingChoice) throw new ScriptParseError('Choice option is not inside a choice block', lineNumber)
      pendingChoice.options.push(parseChoiceOption(trimmed, lineNumber))
      continue
    }

    pendingChoice = flushChoice(currentScene, pendingChoice)
    const colonIndex = trimmed.indexOf(':')
    if (colonIndex <= 0) {
      throw new ScriptParseError('Dialogue lines must follow the format `Character: Dialogue`', lineNumber)
    }
    const char = trimmed.slice(0, colonIndex).trim()
    const text = trimmed.slice(colonIndex + 1).trim()
    if (!text) throw new ScriptParseError('Dialogue text cannot be empty', lineNumber)
    currentScene.steps.push({ type: 'dialogue', char: char || undefined, text })
  }

  pendingChoice = flushChoice(currentScene, pendingChoice)
  if (currentScene) scenes.push(currentScene)
  if (scenes.length === 0) throw new ScriptParseError('No scenes found in script')
  return scenes
}
