// Corruption recovery utilities (engine-level, UI agnostic)
// Provides integrity verification & quarantine helpers.

export interface StorageLike { getItem(key: string): string | null; setItem(key: string, value: string): void; removeItem(key: string): void }

// Minimal validation (can be replaced by full validator lib)
export function validateSlotShape(obj: any): boolean {
  if (!obj || typeof obj !== 'object') return false
  if (typeof obj.id !== 'number') return false
  if (!['manual','auto','quick'].includes(String(obj.type))) return false
  if (!obj.timestamp) return false
  if (!obj.gameState || typeof obj.gameState !== 'object') return false
  return true
}

function stableStringify(obj: any): string {
  const seen = new WeakSet()
  const walk = (v: any): string => {
    if (v === null || typeof v !== 'object') return JSON.stringify(v)
    if (seen.has(v)) return '"[Circular]"'
    seen.add(v)
    if (Array.isArray(v)) return `[${v.map(walk).join(',')}]`
    const keys = Object.keys(v).sort()
    return `{${keys.map(k => JSON.stringify(k)+':'+walk(v[k])).join(',')}}`
  }
  return walk(obj)
}

function fnv1a32(str: string): string {
  let hash = 0x811c9dc5 >>> 0
  for (let i=0;i<str.length;i++){ hash ^= str.charCodeAt(i); hash = Math.imul(hash, 0x01000193) >>> 0 }
  return ('00000000'+hash.toString(16)).slice(-8)
}

export function computeIntegrity(save: any) {
  const { screenshot, integrity, ...rest } = save || {}
  return { algo: 'fnv1a32', hash: fnv1a32(stableStringify(rest)) }
}

export function verifyIntegrity(save: any): boolean {
  if (!save || typeof save !== 'object' || !save.integrity) return true
  if (save.integrity.algo !== 'fnv1a32') return true
  return computeIntegrity(save).hash === save.integrity.hash
}

export function detectCorruption(save: any): boolean {
  if (!validateSlotShape(save)) return true
  if (!verifyIntegrity(save)) return true
  return false
}

export function quarantineCorruptSlot(storage: StorageLike, key: string) {
  try {
    const raw = storage.getItem(key)
    if (raw == null) return false
    storage.setItem(key + '.corrupt', raw)
    storage.removeItem(key)
    return true
  } catch { return false }
}

export function repairAttempt(save: any): any {
  if (!save || typeof save !== 'object') return null
  const clone = { ...save }
  // Drop fields that are common corruption culprits
  delete (clone as any).screenshot
  delete (clone as any).integrity
  const integrity = computeIntegrity(clone)
  return { ...clone, integrity }
}