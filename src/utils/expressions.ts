import type { SpriteShowStep, SpriteSwapStep, SpriteHideStep } from '../vn/sceneTypes'

export type ExpressionMap = Record<string, Record<string, string>>

export function resolveExpression(characterId: string, expression: string, map: ExpressionMap): { id: string; src: string } {
  const forChar = map[characterId]
  if(!forChar) throw new Error(`expression:character_not_found:${characterId}`)
  const src = forChar[expression]
  if(!src) throw new Error(`expression:variant_not_found:${characterId}:${expression}`)
  return { id: characterId, src }
}

export function stepShowExpression(characterId: string, expression: string, map: ExpressionMap): SpriteShowStep {
  const { id, src } = resolveExpression(characterId, expression, map)
  return { type: 'spriteShow', id, src }
}

export function stepSwapExpression(characterId: string, expression: string, map: ExpressionMap): SpriteSwapStep {
  const { id, src } = resolveExpression(characterId, expression, map)
  return { type: 'spriteSwap', id, src }
}

export function stepHideExpression(characterId: string): SpriteHideStep {
  return { type: 'spriteHide', id: characterId }
}
