import { emitMusicPause, emitMusicPlay, emitMusicTrackChange } from './eventBus'

export interface JukeboxState { id?: string; title?: string; isPlaying: boolean }

class JukeboxImpl {
  private state: JukeboxState = { isPlaying: false }
  play(id: string, title?: string){
    this.state.id = id
    this.state.title = title || id
    this.state.isPlaying = true
    emitMusicTrackChange({ id, title: this.state.title! })
    emitMusicPlay({ id, title: this.state.title! })
  }
  pause(){
    if(!this.state.id) return
    this.state.isPlaying = false
    emitMusicPause({ id: this.state.id, title: this.state.title || this.state.id })
  }
  get(){ return { ...this.state } }
}

export const Jukebox = new JukeboxImpl()
