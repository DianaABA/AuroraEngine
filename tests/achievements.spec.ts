import { describe, it, expect } from 'vitest'
import Achievements from '../src/state/modules/Achievements'
import { on } from '../src/utils/eventBus'

describe('Achievements module', () => {
  it('unlocks and persists achievements, emitting events', () => {
    const a = new Achievements('test:achievements')
    a.reset()
    const events: any[] = []
    const off = on('achievements:unlock', (e)=> events.push(e))
    try {
      expect(a.has('first')).toBe(false)
      const item = a.unlock('first', { title:'First Steps', meta:{ points:10 } })
      expect(a.has('first')).toBe(true)
      expect(item.title).toBe('First Steps')
      expect(a.list().length).toBe(1)
      expect(events.length).toBe(1)
      expect(events[0].id).toBe('first')
      // idempotent
      const second = a.unlock('first')
      expect(a.list().length).toBe(1)
      expect(second.id).toBe('first')
    } finally { off() }
  })
})
