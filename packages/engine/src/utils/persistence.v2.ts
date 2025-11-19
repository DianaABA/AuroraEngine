// Persistence v2: Result-based API (non-breaking addition)

export type PersistenceErrorCode = 'quota' | 'transient' | 'integrity' | 'unknown'
export type Ok<T> = { ok: true; value: T }
export type Err = { ok: false; code: PersistenceErrorCode; message?: string }
export type Result<T> = Ok<T> | Err

export function ok<T>(value: T): Ok<T> { return { ok: true, value } }
export function err(code: PersistenceErrorCode, message?: string): Err { return { ok: false, code, message } }

export interface AsyncPersistenceV2 {
  getItem(key: string): Promise<Result<string | null>>
  setItem(key: string, value: string): Promise<Result<void>>
  removeItem(key: string): Promise<Result<void>>
  keys(prefix?: string): Promise<Result<string[]>>
  getJSON<T = any>(key: string): Promise<Result<T | null>>
  setJSON<T = any>(key: string, value: T): Promise<Result<void>>
}

function withPrefix(key: string): string {
  return key.startsWith('chakrahearts_') ? key : `chakrahearts_${key}`
}

function classifyError(e: any): Err {
  if (e && typeof e === 'object') {
    const msg = String((e as any).message || '')
    if (/quota|exceeded/i.test(msg)) return err('quota', msg)
    return err('unknown', msg || undefined)
  }
  return err('unknown', e ? String(e) : undefined)
}

export const LocalStorageAsyncV2: AsyncPersistenceV2 = {
  async getItem(key) {
    try { return ok<string | null>(localStorage.getItem(withPrefix(key))) } catch (e) { return classifyError(e) }
  },
  async setItem(key, value) {
    try { localStorage.setItem(withPrefix(key), value); return ok<void>(undefined) } catch (e) { return classifyError(e) }
  },
  async removeItem(key) {
    try { localStorage.removeItem(withPrefix(key)); return ok<void>(undefined) } catch (e) { return classifyError(e) }
  },
  async keys(prefix) {
    const out: string[] = []
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i)
        if (!k || !k.startsWith('chakrahearts_')) continue
        const short = k.replace('chakrahearts_', '')
        if (!prefix || short.startsWith(prefix)) out.push(short)
      }
      return ok(out)
    } catch (e) { return classifyError(e) }
  },
  async getJSON<T = any>(key: string) {
    const r = await this.getItem(key)
    if (!r.ok) return r
    if (!r.value) return ok<null>(null)
    try { return ok<T>(JSON.parse(r.value)) } catch { return err('transient', 'Malformed JSON') }
  },
  async setJSON<T = any>(key: string, value: T) {
    try {
      const ser = JSON.stringify(value)
      const r = await this.setItem(key, ser)
      return r.ok ? ok<void>(undefined) : r
    } catch (e) { return classifyError(e) }
  }
}

export async function estimateStorageUsageV2(maxBytesGuess = 5_000_000): Promise<Result<{ bytesUsed: number; keys: number; ratio: number }>> {
  let bytes = 0; let count = 0
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i) || ''
      if (!k.startsWith('chakrahearts_')) continue
      const v = localStorage.getItem(k)
      const size = (k.length + (v?.length || 0))
      bytes += size; count++
    }
  } catch (e) { return classifyError(e) }
  const ratio = Math.min(1, bytes / maxBytesGuess)
  return ok({ bytesUsed: bytes, keys: count, ratio })
}
