import GameStateManager from '../utils/GameStateManager'

// Minimal step shape used in tests
export type Step = {
  type: string
  ids?: string[]
  id?: string
  path?: string
  value?: any
  delta?: number
}

// Deterministic, synchronous runner for a subset of engine steps used in unit tests
export function runSteps(steps: Step[], gsm: GameStateManager = GameStateManager.getInstance()): void {
  for (const step of steps) {
    switch (step.type) {
      case 'setFlags': {
        const ids = (step.ids || []).filter(Boolean)
        if (ids.length) {
          const merged = new Set<string>([...gsm.getCurrentState().flags, ...ids])
          gsm.updateState({ flags: merged })
        }
        break
      }
      case 'setFlag': {
        const id = step.id
        if (id) {
          const merged = new Set<string>([...gsm.getCurrentState().flags, id])
          gsm.updateState({ flags: merged })
        }
        break
      }
      case 'unsetFlag': {
        const id = step.id
        if (id) {
          const copy = new Set<string>([...gsm.getCurrentState().flags])
          copy.delete(id)
          gsm.updateState({ flags: copy })
        }
        break
      }
      case 'unsetFlags': {
        const ids = (step.ids || []).filter(Boolean)
        if (ids.length) {
          const copy = new Set<string>([...gsm.getCurrentState().flags])
          ids.forEach(i => copy.delete(i))
          gsm.updateState({ flags: copy })
        }
        break
      }
      case 'setVarDeep': {
        const path = step.path
        if (path) {
          const st = gsm.getCurrentState()
          // Create a deep mutable clone of variables (without freezing)
          const vars = JSON.parse(JSON.stringify(st.variables || {}))
          const segs = String(path).split('.').filter(Boolean)
          let cur: any = vars
          for (let i = 0; i < segs.length - 1; i++) {
            const k = segs[i]
            if (cur[k] == null || typeof cur[k] !== 'object') cur[k] = {}
            cur = cur[k]
          }
          cur[segs[segs.length - 1]] = step.value
          gsm.updateState({ variables: vars })
        }
        break
      }
      case 'incrementVar': {
        const path = step.path
        const delta = typeof step.delta === 'number' ? step.delta : 1
        if (path) {
          const st = gsm.getCurrentState()
          const vars = JSON.parse(JSON.stringify(st.variables || {}))
          const segs = String(path).split('.').filter(Boolean)
          let cur: any = vars
          for (let i = 0; i < segs.length - 1; i++) {
            const k = segs[i]
            if (cur[k] == null || typeof cur[k] !== 'object') cur[k] = {}
            cur = cur[k]
          }
          const leaf = segs[segs.length - 1]
          const prev = Number(cur[leaf] ?? 0)
          cur[leaf] = prev + delta
          gsm.updateState({ variables: vars })
        }
        break
      }
      // No-ops for runner
      case 'pause':
      case 'show':
      case 'end':
      default:
        break
    }
  }
}
