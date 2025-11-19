// A small, safe, dependency-free JSON-logic–style evaluator
// Supported ops:
//  - literals: number|string|boolean|null
//  - { var: "path.to.value" }
//  - logic: { and: [ ... ] }, { or: [ ... ] }, { not: expr }
//  - compare: { "==": [a,b] }, { "!=": [a,b] }, { ">": [a,b] }, { ">=": [a,b] }, { "<": [a,b] }, { "<=": [a,b] }
//  - math: { "+": [a,b] }, { "-": [a,b] }, { "*": [a,b] }, { "/": [a,b] }, { "%": [a,b] }
// The context is a plain object; variables resolve via dot-paths.

export type JSONValue = number | string | boolean | null
export type JSONLogicExpr =
  | JSONValue
  | { var: string }
  | { and: JSONLogicExpr[] }
  | { or: JSONLogicExpr[] }
  | { not: JSONLogicExpr }
  | { [op in '==' | '!=' | '>' | '>=' | '<' | '<=' | '+' | '-' | '*' | '/' | '%']?: [JSONLogicExpr, JSONLogicExpr] }

export function getByPath(obj: any, path: string): any {
  if (!path) return undefined
  const segs = path.split('.').filter(Boolean)
  let cur = obj
  for (const s of segs) {
    if (cur == null) return undefined
    cur = cur[s]
  }
  return cur
}

function toNumber(x: any): number {
  const n = typeof x === 'number' ? x : Number(x)
  return Number.isFinite(n) ? n : NaN
}

export function evaluateLogic(expr: JSONLogicExpr, context: any): any {
  // literals
  if (expr === null || typeof expr === 'number' || typeof expr === 'string' || typeof expr === 'boolean') {
    return expr
  }
  // var
  if (expr && typeof expr === 'object' && 'var' in expr) {
    const path = (expr as any).var
    return getByPath(context, path)
  }
  if (expr && typeof expr === 'object') {
    const keys = Object.keys(expr as any)
    if (keys.length !== 1) throw new Error('Invalid expression object')
    const op = keys[0]
    const val: any = (expr as any)[op]

    switch (op) {
      case 'and': {
        const arr: JSONLogicExpr[] = Array.isArray(val) ? val : []
        for (const sub of arr) {
          if (!evaluateTruth(evaluateLogic(sub, context))) return false
        }
        return true
      }
      case 'or': {
        const arr: JSONLogicExpr[] = Array.isArray(val) ? val : []
        for (const sub of arr) {
          if (evaluateTruth(evaluateLogic(sub, context))) return true
        }
        return false
      }
      case 'not': {
        return !evaluateTruth(evaluateLogic(val as JSONLogicExpr, context))
      }
      case '==':
      case '!=':
      case '>':
      case '>=':
      case '<':
      case '<=':
      case '+':
      case '-':
      case '*':
      case '/':
      case '%': {
        if (!Array.isArray(val) || val.length !== 2) throw new Error(`Operator ${op} requires a pair`)
        const a = evaluateLogic(val[0], context)
        const b = evaluateLogic(val[1], context)
        switch (op) {
          case '==': return a == b
          case '!=': return a != b
          case '>': return toNumber(a) > toNumber(b)
          case '>=': return toNumber(a) >= toNumber(b)
          case '<': return toNumber(a) < toNumber(b)
          case '<=': return toNumber(a) <= toNumber(b)
          case '+': return toNumber(a) + toNumber(b)
          case '-': return toNumber(a) - toNumber(b)
          case '*': return toNumber(a) * toNumber(b)
          case '/': return toNumber(a) / toNumber(b)
          case '%': return toNumber(a) % toNumber(b)
        }
      }
      default:
        throw new Error(`Unsupported operator: ${op}`)
    }
  }
  throw new Error('Invalid expression')
}

export function evaluateTruth(x: any): boolean {
  return !!x
}
