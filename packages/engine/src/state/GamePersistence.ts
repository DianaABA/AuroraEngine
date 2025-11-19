// Async persistence adapter layer; wraps localStorage for now
// Future: swap based on platform (IndexedDB, AsyncStorage, etc.)
import type { GameState } from '../utils/GameStateManager'

export interface StorageAdapter {
  get(key: string): Promise<string | null>
  set(key: string, value: string): Promise<void>
  remove(key: string): Promise<void>
  estimate?(): Promise<{ bytesUsed?: number; bytesTotal?: number; ratio?: number } | null>
}

class LocalStorageAdapter implements StorageAdapter {
  async get(key: string) {
    try { return localStorage.getItem(key) } catch { return null }
  }
  async set(key: string, value: string) {
    localStorage.setItem(key, value)
  }
  async remove(key: string) {
    try { localStorage.removeItem(key) } catch {}
  }
  async estimate() {
    try {
      const used = JSON.stringify(localStorage).length
      const total = 5 * 1024 * 1024
      return { bytesUsed: used, bytesTotal: total, ratio: used / total }
    } catch { return null }
  }
}

export const storageAdapter: StorageAdapter = new LocalStorageAdapter()

export async function persistGameState(state: GameState) {
  try {
    const serialized = JSON.stringify({ ...state, flags: Array.from(state.flags) })
    await storageAdapter.set('chakrahearts_gameState', serialized)
  } catch (e) {
    console.error('persistGameState_failed', e)
    throw e
  }
}

export async function loadGameState(): Promise<GameState | null> {
  try {
    const raw = await storageAdapter.get('chakrahearts_gameState')
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (parsed && parsed.flags && Array.isArray(parsed.flags)) {
      parsed.flags = new Set(parsed.flags)
    }
    return parsed as GameState
  } catch (e) {
    console.warn('loadGameState_failed', e)
    return null
  }
}

export async function persistSaveSlot(slotKey: string, payload: any) {
  try {
    await storageAdapter.set(`chakrahearts_${slotKey}`, JSON.stringify(payload))
  } catch (e) {
    console.error('persistSaveSlot_failed', slotKey, e)
    throw e
  }
}

export async function loadSaveSlot(slotKey: string): Promise<any | null> {
  try {
    const raw = await storageAdapter.get(`chakrahearts_${slotKey}`)
    if (!raw) return null
    return JSON.parse(raw)
  } catch { return null }
}
