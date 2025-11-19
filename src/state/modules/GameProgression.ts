import type { GameState } from '../GameStateCore'

export interface ProgressionPlugin {
  id: string
  onInit?(state: GameState): void
  onTick?(state: GameState): void
  canNavigateToEpisode?(id: string, state: GameState): boolean
  getEpisodeTitle?(id: string, state: GameState): string | null
}

export class GameProgressionModule {
  private plugins: ProgressionPlugin[] = []
  constructor(private readonly _get: () => GameState, private readonly _set: (s: GameState) => void) {
    const snapshot = this._get(); this._set(snapshot)
  }
  registerPlugin(plugin: ProgressionPlugin) {
    if (!this.plugins.find(p => p.id === plugin.id)) {
      this.plugins.push(plugin)
      try { plugin.onInit?.(this._get()) } catch {}
    }
  }
  tick() {
    const state = this._get()
    for (const p of this.plugins) {
      try { p.onTick?.(state) } catch {}
    }
  }
  canNavigateToEpisode(id: string) {
    const state = this._get()
    for (const p of this.plugins) {
      try {
        const res = p.canNavigateToEpisode?.(id, state)
        if (res === false) return false
      } catch {}
    }
    return !!id
  }
  getEpisodeTitle(id: string) {
    const state = this._get()
    for (const p of this.plugins) {
      try {
        const title = p.getEpisodeTitle?.(id, state)
        if (title) return title
      } catch {}
    }
    return id
  }
  debugSnapshot() { return { episode: this._get().currentEpisode, pluginCount: this.plugins.length } }
}
export default GameProgressionModule
