import type { GameState } from '../../utils/GameStateManager'

type GetState = () => GameState
type SetState = (next: GameState) => void

// Simplified progression module for the generic engine.
// Does not depend on app-specific episode lists; callers can override as needed.
export class GameProgressionModule {
  constructor(private getState: GetState, private setState: SetState) {}

  canNavigateToEpisode(episodeId: string): boolean {
    const st = this.getState()
    const id = this.canonicalEpisodeId(episodeId)
    return st.unlockedEpisodes.includes(id) || st.currentEpisode === id
  }

  unlockEpisode(episodeId: string) {
    const st = this.getState()
    const id = this.canonicalEpisodeId(episodeId)
    if (!st.unlockedEpisodes.includes(id)) {
      this.setState({ ...st, unlockedEpisodes: [...st.unlockedEpisodes, id] })
    }
  }

  completeEpisode(episodeId: string) {
    const st = this.getState()
    const id = this.canonicalEpisodeId(episodeId)
    if (!st.completedEpisodes.includes(id)) {
      this.setState({ ...st, completedEpisodes: [...st.completedEpisodes, id] })
      // No auto-unlock next episode here; leave to host app.
    }
  }

  getEpisodeTitle(episodeId: string): string {
    return episodeId
  }

  canonicalEpisodeId(episodeId: string): string {
    return String(episodeId || '').trim()
  }
}

export default GameProgressionModule
