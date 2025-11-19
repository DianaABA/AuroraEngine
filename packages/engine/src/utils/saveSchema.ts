// Centralized save schema versioning and migration utilities
// Non-breaking additive changes should bump minor; structural changes major.

export const SAVE_SCHEMA_VERSION = 1

// Deep clone helper using native structuredClone if available, with fallback.
export function safeDeepClone<T>(value: T): T {
  try {
    // @ts-ignore
    if (typeof structuredClone === 'function') return structuredClone(value)
  } catch {}
  return JSON.parse(JSON.stringify(value))
}

// Minimal runtime validation for save slot objects
export function validateSaveData(obj: any): boolean {
  if (!obj || typeof obj !== 'object') return false
  if (typeof obj.id !== 'number') return false
  if (!obj.type || !['manual','auto','quick'].includes(String(obj.type))) return false
  if (!obj.timestamp || typeof obj.timestamp !== 'string') return false
  if (!obj.gameState || typeof obj.gameState !== 'object') return false
  if (obj.schemaVersion != null && typeof obj.schemaVersion !== 'number') return false
  // Basic gameState checks
  const gs = obj.gameState
  if (typeof gs.currentEpisode !== 'string') return false
  if (typeof gs.currentScene !== 'string') return false
  if (typeof gs.currentLine !== 'number') return false
  return true
}

// Public TypeScript interface describing stored slot shape
export interface SerializedSlot {
  id: number
  type: 'manual' | 'auto' | 'quick'
  gameState: {
    currentEpisode: string
    currentScene: string
    currentLine: number
    variables?: Record<string, any>
    flags?: string[]
    [k: string]: any
  }
  screenshot?: string
  thumbnail?: string | null
  timestamp: string
  episodeTitle: string
  sceneTitle: string
  isQuickSave?: boolean
  isAutoSave?: boolean
  schemaVersion?: number
  integrity?: { algo: 'fnv1a32'; hash: string }
}

// Tiny SVG placeholder (16:9) as data URL for missing thumbnails
export const THUMBNAIL_PLACEHOLDER_DATA_URL = (() => {
  const svg = encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='320' height='180' viewBox='0 0 320 180'>
      <defs>
        <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
          <stop offset='0%' stop-color='#1f2937'/>
          <stop offset='100%' stop-color='#374151'/>
        </linearGradient>
      </defs>
      <rect width='320' height='180' fill='url(#g)'/>
      <rect x='8' y='8' width='304' height='164' rx='8' ry='8' fill='none' stroke='#6b7280' stroke-width='2'/>
      <g opacity='0.7'>
        <circle cx='160' cy='90' r='28' fill='#111827' stroke='#9ca3af' stroke-width='2'/>
        <polygon points='152,78 184,90 152,102' fill='#9ca3af'/>
      </g>
    </svg>`
  )
  return `data:image/svg+xml;charset=UTF-8,${svg}`
})()

// Stable stringify with sorted keys to produce deterministic hashes
function stableStringify(obj: any): string {
  const seen = new WeakSet()
  const stringify = (value: any): string => {
    if (value === null || typeof value !== 'object') return JSON.stringify(value)
    if (seen.has(value)) return '"[Circular]"'
    seen.add(value)
    if (Array.isArray(value)) return `[${value.map(v => stringify(v)).join(',')}]`
    const keys = Object.keys(value).sort()
    const pairs = keys.map(k => `${JSON.stringify(k)}:${stringify(value[k])}`)
    return `{${pairs.join(',')}}`
  }
  return stringify(obj)
}

// FNV-1a 32-bit hash for integrity (non-cryptographic tamper indicator)
function fnv1a32(str: string): string {
  let hash = 0x811c9dc5 >>> 0
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193) >>> 0
  }
  // Return 8-char zero-padded hex
  return ('00000000' + hash.toString(16)).slice(-8)
}

// Compute integrity hash for a save slot, excluding transient fields like screenshot/integrity itself
export function computeSaveIntegrity(save: any): { algo: 'fnv1a32'; hash: string } {
  const { screenshot, integrity, ...rest } = save || {}
  const payload = stableStringify(rest)
  return { algo: 'fnv1a32', hash: fnv1a32(payload) }
}

export function verifySaveIntegrity(save: any): boolean {
  if (!save || typeof save !== 'object' || !save.integrity) return true // No integrity -> treat as ok (legacy)
  if (save.integrity.algo !== 'fnv1a32') return true // Unknown algo, don't block
  const expected = computeSaveIntegrity(save).hash
  return expected === save.integrity.hash
}

// Shape for older (v0) saves before schemaVersion existed
type LegacySaveData = any

function migrateFromV0(raw: LegacySaveData): any {
  const migrated: any = {
    ...raw,
    schemaVersion: SAVE_SCHEMA_VERSION,
    gameState: {
      ...raw.gameState,
      // Ensure flags is an array for storage (GameStateManager rehydrates to Set)
      flags: Array.isArray((raw.gameState as any).flags) ? (raw.gameState as any).flags : []
    }
  }
  return migrated
}

// Public migration entrypoint; if raw is null or invalid returns raw unchanged.
export function migrateSaveData(raw: any): any | null {
  if (!raw || typeof raw !== 'object') return null
  const version = typeof raw.schemaVersion === 'number' ? raw.schemaVersion : 0
  if (version === SAVE_SCHEMA_VERSION) return validateSaveData(raw) ? raw : null
  // Future dispatch based on version value
  switch (version) {
    case 0:
    default:
      {
        const up = migrateFromV0(raw as LegacySaveData)
        return validateSaveData(up) ? up : null
      }
  }
}
