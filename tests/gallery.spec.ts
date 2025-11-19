import { describe, it, expect } from 'vitest'
import Gallery from '../src/state/modules/Gallery'
import { on } from '../src/utils/eventBus'

describe('Gallery module', () => {
  it('unlocks CGs, persists, and emits events', () => {
    const g = new Gallery('test:gallery')
    g.reset()
    const events: any[] = []
    const off = on('gallery:unlock', (e)=> events.push(e))
    try {
      expect(g.has('cg1')).toBe(false)
      const item = g.unlock('cg1', 'cgs/cg1.png', { title: 'First CG', meta:{ tag:'intro' } })
      expect(g.has('cg1')).toBe(true)
      expect(item.src).toBe('cgs/cg1.png')
      expect(item.title).toBe('First CG')
      expect(g.list().length).toBe(1)
      expect(events.length).toBe(1)
      expect(events[0].id).toBe('cg1')
      // idempotent
      const again = g.unlock('cg1', 'cgs/cg1.png')
      expect(g.list().length).toBe(1)
      expect(again.id).toBe('cg1')
    } finally { off() }
  })
})
