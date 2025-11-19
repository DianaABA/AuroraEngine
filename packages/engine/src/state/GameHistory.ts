// History/rollback isolation. Will gradually replace rollback in GameStateManager.
import type { GameState } from '../utils/GameStateManager'

export class GameHistory {
  private static instance: GameHistory
  private stack: GameState[] = []
  private max = 50
  private throttleEveryN = 3
  private sinceLastStore = 0
  private lastSig: string | null = null

  static getInstance() { if (!this.instance) this.instance = new GameHistory(); return this.instance }

  configure(maxSteps: number, throttleEveryN?: number) {
    this.max = Math.max(1, Math.min(500, maxSteps))
    if (typeof throttleEveryN === 'number') {
      this.throttleEveryN = Math.max(1, Math.min(20, Math.floor(throttleEveryN)))
    }
  }

  push(snapshot: GameState, opts?: { force?: boolean }) {
    const sig = this.buildSignature(snapshot)
    const isSameAsLast = this.lastSig != null && this.lastSig === sig

    if (opts?.force) {
      this.lastSig = sig
      this.sinceLastStore = 0
      this.stack.push(structuredClone ? structuredClone(snapshot) : JSON.parse(JSON.stringify(snapshot)))
      if (this.stack.length > this.max) this.stack.shift()
      return
    }

    if (!isSameAsLast) {
      this.lastSig = sig
      this.sinceLastStore = 0
      this.stack.push(structuredClone ? structuredClone(snapshot) : JSON.parse(JSON.stringify(snapshot)))
      if (this.stack.length > this.max) this.stack.shift()
      return
    }

    const nextCount = this.sinceLastStore + 1
    const shouldStore = nextCount % this.throttleEveryN === 0
    if (!shouldStore) {
      this.sinceLastStore = nextCount
      return
    }

    this.sinceLastStore = 0
    this.lastSig = sig
    this.stack.push(structuredClone ? structuredClone(snapshot) : JSON.parse(JSON.stringify(snapshot)))
    if (this.stack.length > this.max) this.stack.shift()
  }

  canRollback() { return this.stack.length > 0 }

  pop(): GameState | null { return this.stack.pop() || null }

  clear() { this.stack = [] }

  private buildSignature(s: GameState): string {
    try {
      const ep = s.currentEpisode || ''
      const sc = s.currentScene || ''
      const ln = typeof s.currentLine === 'number' ? s.currentLine : -1
      const flags = Array.isArray((s as any).flags)
        ? (s as any).flags as string[]
        : (s.flags && s.flags instanceof Set ? Array.from(s.flags) : [])
      flags.sort()
      const varCount = s.variables ? Object.keys(s.variables).length : 0
      return `${ep}|${sc}|${ln}|${flags.join(',')}|v:${varCount}`
    } catch {
      return 'sig_error'
    }
  }
}

export default GameHistory
