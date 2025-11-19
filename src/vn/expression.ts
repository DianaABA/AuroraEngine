// Simple expression evaluator for conditions like:
// flag:hi && !flag:curious || var:score>=10
// Supports terms: flag:name, var:name<op>number where op in > >= < <= == !=
// Logical operators: &&, || ; ! prefix for term negation.

const COMP_RE = /^(var:[a-zA-Z0-9_]+)([<>]=?|==|!=)([-+]?[0-9]*\.?[0-9]+)$/

export interface Vars { [key: string]: unknown }
export function evaluateCondition(expr: string, flags: Set<string>, vars: Vars): boolean {
  if(!expr.trim()) return true
  // Split by || first
  const orParts = splitBy(expr, '||')
  for(const part of orParts){
    if(evaluateAndPart(part.trim(), flags, vars)) return true
  }
  return false
}

function evaluateAndPart(part: string, flags: Set<string>, vars: Vars): boolean {
  const andParts = splitBy(part, '&&')
  for(const raw of andParts){
    const token = raw.trim()
    if(!evaluateToken(token, flags, vars)) return false
  }
  return true
}

function evaluateToken(token: string, flags: Set<string>, vars: Vars): boolean {
  let negate = false
  if(token.startsWith('!')){ negate = true; token = token.slice(1).trim() }
  let result: boolean
  if(token.startsWith('flag:')){
    const name = token.slice(5)
    result = flags.has(name)
  } else if(token.startsWith('var:')){
    result = evaluateVarComparison(token, vars)
  } else {
    // Unknown token: treat as false to be strict
    result = false
  }
  return negate ? !result : result
}

function evaluateVarComparison(token: string, vars: Vars): boolean {
  const m = COMP_RE.exec(token)
  if(!m){
    // Support plain existence check: var:name
    const name = token.slice(4)
    return vars[name] !== undefined && vars[name] !== null
  }
  const name = m[1].slice(4)
  const op = m[2]
  const value = parseFloat(m[3])
  const actual = Number(vars[name])
  if(Number.isNaN(actual)) return false
  switch(op){
    case '>': return actual > value
    case '>=': return actual >= value
    case '<': return actual < value
    case '<=': return actual <= value
    case '==': return actual === value
    case '!=': return actual !== value
    default: return false
  }
}

function splitBy(expr: string, sep: '||'|'&&'): string[] {
  const res: string[] = []
  const depth = 0 // depth reserved for future parentheses support
  let current = ''
  for(let i=0;i<expr.length;i++){
    if(expr.startsWith(sep, i) && depth===0){
      res.push(current); current=''; i+=sep.length-1; continue
    }
    current += expr[i]
  }
  if(current) res.push(current)
  return res
}
