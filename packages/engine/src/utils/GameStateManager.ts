// Game State Manager for AuroraEngine (extracted from ChakraHearts)
import { SAVE_SCHEMA_VERSION, safeDeepClone } from './saveSchema.ts'
import { emitGameStateCorrupt, emitNotification } from './eventBus'
import GameStateCore from '../state/GameStateCore'
import GameHistory from '../state/GameHistory'
import GamePersistenceModule from '../state/modules/GamePersistence'
import GameProgressionModule from '../state/modules/GameProgression'
import GameMetricsModule from '../state/modules/GameMetrics'
import GameFlagsModule from '../state/modules/GameFlags'
import { getStorageMonitor } from '../state/modules/StorageMonitor'

export const GAME_STATE_VERSION = 1

export interface MigrationEntry { from: number; to: number; ts: string }
export interface GameState {
  schemaVersion?: number
  currentEpisode: string
  currentScene: string
  currentLine: number
  variables: Record<string, any>
  flags: Set<string>
  completedEpisodes: string[]
  unlockedEpisodes: string[]
  characterRelationships: Record<string, number>
  karma: number
  romance: number
  romanceLock?: string | null
  playTime: number
  lastPlayTime: number
  preferences: GamePreferences
  history?: string[]
  codexUnlocked?: string[]
  galleryUnlocked?: string[]
  badgesUnlocked?: string[]
  endingsUnlocked?: string[]
  migrations?: MigrationEntry[]
}

export interface GamePreferences {
  autoSaveEnabled: boolean
  autoSaveInterval: number
  skipSeenText: boolean
  showSkipIndicator: boolean
  quickMenuEnabled: boolean
  rollbackEnabled: boolean
  maxRollbackSteps: number
}

export interface SaveData {
  id: number
  type: 'manual' | 'auto' | 'quick'
  gameState: GameState
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

class GameStateManager {
  private static instance: GameStateManager
  private gameState: GameState
  private autoSaveTimer: ReturnType<typeof setInterval> | null = null
  private static readonly MAX_MANUAL_SLOTS = 24
  private prefixedListeners: Map<string, Set<(payload?: any) => void>> = new Map()
  private persistence!: GamePersistenceModule
  private progression!: GameProgressionModule
  private metrics!: GameMetricsModule
  private flags!: GameFlagsModule

  private constructor() {
    this.gameState = this.getDefaultState()
    try { GameStateCore.getInstance().init(this.gameState) } catch {}
    try {
      const h = GameHistory.getInstance()
      h.configure(this.gameState.preferences.maxRollbackSteps, 3)
    } catch {}
    const getState = () => this.gameState
    const setState = (next: GameState) => { this.updateState({ ...next }) }
    this.persistence = new GamePersistenceModule(getState, setState, { maxManualSlots: GameStateManager.MAX_MANUAL_SLOTS })
    this.progression = new GameProgressionModule(getState, setState)
    this.metrics = new GameMetricsModule(getState, setState)
    this.flags = new GameFlagsModule(getState, setState)

    this.loadPersistedGameState()
    this.loadPreferences()
    this.setupAutoSave()
    try { getStorageMonitor().start() } catch {}
    try {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden' && this.gameState.preferences.autoSaveEnabled) {
          this.autoSave()
        }
      })
    } catch {}
    try {
      ;(window as any).__dumpGameState__ = () => { try { return this.getCurrentState() } catch { return null } }
      ;(window as any).__listSaves__ = () => { try { return this.getSaveSummaries() } catch { return [] } }
    } catch {}
  }

  getSaveThumbnail(save: SaveData): string { return this.persistence.saveThumbnailResolver(save) }

  static getInstance(): GameStateManager {
    if (!GameStateManager.instance) {
      GameStateManager.instance = new GameStateManager()
    }
    return GameStateManager.instance
  }

  private getDefaultState(): GameState {
    return {
      schemaVersion: GAME_STATE_VERSION,
      currentEpisode: 'episode-01',
      currentScene: 'PROLOGUE',
      currentLine: 0,
      variables: {},
      flags: new Set(),
      completedEpisodes: [],
      unlockedEpisodes: [],
      characterRelationships: {},
      karma: 50,
      romance: 0,
      romanceLock: null,
      playTime: 0,
      lastPlayTime: Date.now(),
      preferences: {
        autoSaveEnabled: true,
        autoSaveInterval: 5,
        skipSeenText: false,
        showSkipIndicator: true,
        quickMenuEnabled: true,
        rollbackEnabled: true,
        maxRollbackSteps: 50
      },
      history: [],
      codexUnlocked: [],
      galleryUnlocked: [],
      badgesUnlocked: [],
      endingsUnlocked: [],
      migrations: []
    }
  }

  getCurrentState(): GameState {
    const snapshot = safeDeepClone(this.gameState)
    try { if ((import.meta as any)?.env?.DEV) (deepFreeze as any)?.(snapshot as any) } catch {}
    return snapshot
  }

  updateState(updates: Partial<GameState>): void {
    this.addToRollbackHistory()
    const now = Date.now()
    const prevLast = this.gameState.lastPlayTime || now
    const sessionTime = Math.max(0, now - prevLast)
    this.gameState = { ...this.gameState, ...updates, playTime: (this.gameState.playTime || 0) + sessionTime, lastPlayTime: now }
    this.emit('stateUpdate', safeDeepClone(this.gameState))
    try { this.validateCurrentState() } catch {}
  }

  private validateCurrentState() {
    try {
      const issues = GameStateCore.getInstance().validate()
      if (issues.length) {
        emitNotification({ type: 'warning', title: 'Game State Issues', message: issues.join(', ') })
      }
    } catch {}
  }

  on(event: string, handler: (payload?: any) => void): () => void {
    const set = this.prefixedListeners.get(event) || new Set()
    set.add(handler)
    this.prefixedListeners.set(event, set)
    return () => { set.delete(handler) }
  }

  private emit(event: string, payload?: any) {
    const set = this.prefixedListeners.get(event)
    if (!set) return
    for (const fn of set) {
      try { fn(payload) } catch {}
    }
  }

  private addToRollbackHistory() {
    try { GameHistory.getInstance().push(this.getCurrentState()) } catch {}
  }

  clearRollbackHistory() { try { GameHistory.getInstance().clear() } catch {} }

  getMaxManualSlots() { return GameStateManager.MAX_MANUAL_SLOTS }

  // Preferences
  loadPreferences() {
    try {
      const r = this.persistence.loadPreferencesResult()
      if (r.ok) this.gameState.preferences = r.value
    } catch {}
  }

  savePreferencesResult(prefs: GamePreferences) { return this.persistence.savePreferencesResult(prefs) }

  // Persistence wrappers
  async loadPersistedGameState() { try { await this.persistence.loadInitialGameState() } catch {} }

  saveGame(slotId: number, type: 'manual' | 'auto' | 'quick' = 'manual', opts?: { thumbnail?: string | null; screenshot?: string | null }): SaveData {
    const overrides = { episodeTitle: this.progression.getEpisodeTitle(this.gameState.currentEpisode) }
    return this.persistence.saveGame(slotId, type, opts, overrides)
  }

  saveGameResult(slotId: number, type: 'manual' | 'auto' | 'quick' = 'manual', opts?: { thumbnail?: string | null; screenshot?: string | null }) {
    const overrides = { episodeTitle: this.progression.getEpisodeTitle(this.gameState.currentEpisode) }
    return this.persistence.saveGameWithResult(slotId, type, opts, overrides)
  }

  loadGame(slotId: number): boolean {
    const r = this.persistence.loadGameWithResult(slotId)
    if (r.ok) { this.setState(r.data); return true }
    return false
  }

  loadGameResult(slotId: number) { return this.persistence.loadGameWithResult(slotId) }

  quickSave(): SaveData { return this.saveGame(991, 'quick') }

  autoSave() { try { this.saveGame(998, 'auto') } catch {} }

  private setState(next: GameState) { this.gameState = next; this.emit('stateUpdate', safeDeepClone(this.gameState)) }

  private setupAutoSave() {
    try {
      if (this.autoSaveTimer) clearInterval(this.autoSaveTimer)
      if (this.gameState.preferences.autoSaveEnabled) {
        const intervalMs = Math.max(1, this.gameState.preferences.autoSaveInterval) * 60 * 1000
        this.autoSaveTimer = setInterval(() => this.autoSave(), intervalMs)
      }
    } catch {}
  }

  // Summaries and utilities
  getSaveSummaries() { return this.persistence.getSaveSummaries() }
  getAllSaves() { return this.persistence.getAllSaves() }
  async getAllSavesAsync() { return this.persistence.getAllSavesAsync() }
  getCorruptSaves() { return this.persistence.getCorruptSaves() }
}

try { (globalThis as any).deepFreeze = (obj: any) => obj } catch {}

export default GameStateManager
