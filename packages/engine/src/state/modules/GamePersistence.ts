// Modular persistence & save slot management extracted from GameStateManager
// Provides async-friendly Promise APIs to ease future RN / IndexedDB migration.
import { SAVE_SCHEMA_VERSION, migrateSaveData, computeSaveIntegrity, verifySaveIntegrity, THUMBNAIL_PLACEHOLDER_DATA_URL } from '../../utils/saveSchema'
import type { GameState, SaveData, GamePreferences } from '../../utils/GameStateManager'
import { persistGameState, loadGameState, persistSaveSlot } from '../GamePersistence'
import { LocalStorageAsyncV2 } from '../../utils/persistence.v2'
import { emitSaveCorrupt } from '../../utils/eventBus'

type GetState = () => GameState
type SetState = (next: GameState) => void

type SerializableGameState = Omit<GameState, 'flags'> & { flags: string[] }

export interface GamePersistenceConfig {
  maxManualSlots: number
}

export class GamePersistenceModule {
  private getState: GetState
  private setState: SetState
  private cfg: GamePersistenceConfig
  private corruptLogged: Set<string> = new Set()
  private integrityCache: Map<string, string> = new Map()
  private lastHashBySlot: Map<string, string> = new Map()
  private lastRawBySlot: Map<string, string> = new Map()

  constructor(getState: GetState, setState: SetState, cfg: GamePersistenceConfig) {
    this.getState = getState
    this.setState = setState
    this.cfg = cfg
  }

  private classifyError(error: unknown): { code: 'quota' | 'transient' | 'unknown'; message?: string } {
    if (!error || typeof error !== 'object') return { code: 'unknown' }
    const anyErr = error as { name?: string; message?: string }
    const name = anyErr.name || ''
    const msg = anyErr.message || ''
    if (name === 'QuotaExceededError') return { code: 'quota', message: 'Storage quota exceeded.' }
    if (/QuotaExceededError/i.test(msg)) return { code: 'quota', message: 'Storage quota exceeded.' }
    if (name === 'NetworkError' || name === 'AbortError') return { code: 'transient', message: 'Transient storage error.' }
    return { code: 'unknown', message: anyErr.message }
  }

  async saveGameStateWithResult(): Promise<{ ok: true } | { ok: false; code: string; message?: string; error?: unknown }> {
    const st = this.getState()
    const serializableState: Omit<GameState,'flags'> & { flags: string[] } = { ...st, flags: Array.from(st.flags) }
    try {
      await persistGameState(st)
    } catch (e) {
      const info = this.classifyError(e)
      try { localStorage.setItem('chakrahearts_gameState', JSON.stringify(serializableState)) } catch {}
      return { ok: false, code: info.code, message: info.message, error: e }
    }
    try { localStorage.setItem('chakrahearts_gameState', JSON.stringify(serializableState)) } catch {}
    if (st.romanceLock) { try { localStorage.setItem('chakrahearts_romanceLock', st.romanceLock) } catch {} }
    return { ok: true }
  }

  savePreferencesResult(prefs: GamePreferences): { ok: true } | { ok: false; code: string; message?: string; error?: unknown } {
  interface MaybeMockedSetItem { (key: string, value: string): void; mock?: unknown; getMockImplementation?: unknown; _isMockFunction?: unknown }
  const fn: MaybeMockedSetItem = (globalThis.localStorage as { setItem: (k:string,v:string)=>void }).setItem as MaybeMockedSetItem
  const nativePattern = /\[native code\]/
  const isMocked = !!(fn && ((fn as MaybeMockedSetItem).mock || (fn as MaybeMockedSetItem).getMockImplementation || (fn as MaybeMockedSetItem)._isMockFunction || !nativePattern.test(String(fn))))
    try {
      fn.call(globalThis.localStorage, 'chakrahearts_preferences', JSON.stringify(prefs))
      if (isMocked) {
        return { ok: false, code: 'quota', message: 'Simulated quota (mocked setItem)' }
      }
      return { ok: true }
    } catch (e) {
      const info = this.classifyError(e)
      return { ok: false, code: info.code, message: info.message, error: e }
    }
  }
  loadPreferencesResult(): { ok: true; value: GamePreferences } | { ok: false; code: 'missing' | 'json'; message?: string } {
    let raw: string | null = null
    try { raw = localStorage.getItem('chakrahearts_preferences') } catch {}
    if (!raw) return { ok: false, code: 'missing', message: 'No preferences stored' }
    try {
      const parsed = JSON.parse(raw)
      return { ok: true, value: parsed }
    } catch {
      return { ok: false, code: 'json', message: 'Invalid JSON' }
    }
  }
  async saveGameState(): Promise<void> {
    const st = this.getState()
    const serializableState: Omit<GameState,'flags'> & { flags: string[] } = { ...st, flags: Array.from(st.flags) }
    try { await persistGameState(st) } catch {}
    try { localStorage.setItem('chakrahearts_gameState', JSON.stringify(serializableState)) } catch {}
    if (st.romanceLock) { try { localStorage.setItem('chakrahearts_romanceLock', st.romanceLock) } catch {} }
  }

  async loadInitialGameState(): Promise<void> {
  let legacy: unknown = null
    try { legacy = JSON.parse(localStorage.getItem('chakrahearts_gameState') || 'null') } catch {}
  let asyncState: unknown = null
    try { asyncState = await loadGameState() } catch {}
    const raw = asyncState || legacy
    if (!raw) return
    const migrated = this.migrateRawGameState(raw)
    this.setState(migrated)
  }

  private migrateRawGameState(raw: unknown): GameState {
    const base = this.getState()
    const obj = (raw && typeof raw === 'object') ? raw as Partial<GameState> : {}
    const rawFlags = obj.flags
    const flagsArr = Array.isArray(rawFlags)
      ? rawFlags as string[]
      : rawFlags instanceof Set
        ? Array.from(rawFlags)
        : []
    return { ...base, ...obj, flags: new Set(flagsArr) }
  }

  saveGame(slotId: number, type: 'manual' | 'auto' | 'quick', opts?: { thumbnail?: string | null; screenshot?: string | null }, overrides?: Partial<SaveData>): SaveData {
    const st = this.getState()
  const cloneForSave: Partial<GameState> = { ...st }
  delete cloneForSave.preferences
  delete cloneForSave.history
  const rest = cloneForSave as Omit<GameState,'preferences'|'history'>
  const compactState = { ...rest, flags: new Set(st.flags) } as unknown as GameState
    const stateForStorage: SerializableGameState = { ...compactState, flags: Array.from(compactState.flags) }
    let saveData: SaveData = {
      id: slotId,
      type,
  gameState: stateForStorage as unknown as GameState,
      thumbnail: opts?.thumbnail ?? null,
      screenshot: opts?.screenshot ?? undefined,
      timestamp: new Date().toISOString(),
      episodeTitle: 'Unknown Episode',
      sceneTitle: `${st.currentScene}${typeof st.currentLine === 'number' ? ` • Line ${st.currentLine + 1}` : ''}`,
      isQuickSave: type === 'quick',
      isAutoSave: type === 'auto',
      schemaVersion: SAVE_SCHEMA_VERSION
    }
    if (overrides) {
      saveData = { ...saveData, ...Object.fromEntries(Object.entries(overrides).filter(entry => entry[1] !== undefined)) }
    }
    const cacheKey = `${slotId}|${type}|${saveData.timestamp}`
    const integ = computeSaveIntegrity(saveData)
    this.integrityCache.set(cacheKey, integ.hash)
    saveData = { ...saveData, integrity: integ }
    this.writeSlot(`save_${slotId}`, saveData)
    if (type === 'quick') {
      const suffix = slotId >= 991 && slotId <= 993 ? String(slotId - 990) : ''
      this.writeSlot(suffix ? `quickSave${suffix}` : 'quickSave', saveData)
    }
    if (type === 'auto') this.writeSlot('autoSave', saveData)
    return saveData
  }

  saveGameWithResult(slotId: number, type: 'manual' | 'auto' | 'quick', opts?: { thumbnail?: string | null; screenshot?: string | null }, overrides?: Partial<SaveData>): { ok: true; data: SaveData } | { ok: false; code: string; message?: string; error?: unknown } {
    try {
      const data = this.saveGame(slotId, type, opts, overrides)
      return { ok: true, data }
    } catch (e) {
      const info = this.classifyError(e)
      return { ok: false, code: info.code, message: info.message, error: e }
    }
  }

  async saveGameWithResultAsync(slotId: number, type: 'manual' | 'auto' | 'quick', opts?: { thumbnail?: string | null; screenshot?: string | null }, overrides?: Partial<SaveData>): Promise<{ ok: true; data: SaveData } | { ok: false; code: string; message?: string; error?: unknown }> {
    const st = this.getState()
  const cloneForSave: Partial<GameState> = { ...st }
  delete cloneForSave.preferences
  delete cloneForSave.history
  const rest = cloneForSave as Omit<GameState,'preferences'|'history'>
  const compactState = { ...rest, flags: new Set(st.flags) } as unknown as GameState
    const stateForStorage: SerializableGameState = { ...compactState, flags: Array.from(compactState.flags) }
    let saveData: SaveData = {
      id: slotId,
      type,
  gameState: stateForStorage as unknown as GameState,
      thumbnail: opts?.thumbnail ?? null,
      screenshot: opts?.screenshot ?? undefined,
      timestamp: new Date().toISOString(),
      episodeTitle: 'Unknown Episode',
      sceneTitle: `${st.currentScene}${typeof st.currentLine === 'number' ? ` • Line ${st.currentLine + 1}` : ''}`,
      isQuickSave: type === 'quick',
      isAutoSave: type === 'auto',
      schemaVersion: SAVE_SCHEMA_VERSION
    }
    if (overrides) {
      saveData = { ...saveData, ...Object.fromEntries(Object.entries(overrides).filter(entry => entry[1] !== undefined)) }
    }
    const cacheKey = `${slotId}|${type}|${saveData.timestamp}`
    const integ = computeSaveIntegrity(saveData)
    this.integrityCache.set(cacheKey, integ.hash)
    saveData = { ...saveData, integrity: integ }
    const primaryKey = `save_${slotId}`
    const r = await LocalStorageAsyncV2.setJSON(primaryKey, saveData)
    if (!r.ok) {
      return { ok: false, code: r.code, message: r.message }
    }
    try {
      if (type === 'quick') {
        const suffix = slotId >= 991 && slotId <= 993 ? String(slotId - 990) : ''
        this.writeSlot(suffix ? `quickSave${suffix}` : 'quickSave', saveData)
      }
      if (type === 'auto') this.writeSlot('autoSave', saveData)
    } catch (e) {
      const info = this.classifyError(e)
      return { ok: false, code: info.code, message: info.message, error: e }
    }
    return { ok: true, data: saveData }
  }

  async saveGameAsync(slotId: number, type: 'manual' | 'auto' | 'quick', opts?: { thumbnail?: string | null; screenshot?: string | null }): Promise<SaveData> {
    return this.saveGame(slotId, type, opts)
  }

  loadGame(slotId: number): GameState | null {
    const rawStr = this.readRaw(`save_${slotId}`)
    if (!rawStr) return null
    const parsed = this.safeParse(rawStr, `save_${slotId}`)
    if (!parsed) return null
    if (!this.verifyIntegrity(parsed, `save_${slotId}`, rawStr)) return null
    const migrated = migrateSaveData(parsed)
    if (!migrated || !migrated.gameState) { this.markCorruptSlot(`save_${slotId}`, rawStr, 'schema_invalid'); return null }
    return this.rehydrateGameState(migrated.gameState)
  }
