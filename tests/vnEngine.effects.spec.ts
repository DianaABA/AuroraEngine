import { describe, it, expect } from 'vitest'
import { createEngine } from '../src/vn/engine'
import type { SceneDef } from '../src/vn/sceneTypes'
import { onMusicTrackChange, onMusicPlay } from '../src/utils/eventBus'

describe('VNEngine side effects', () => {
  it('emits music events and updates state, then pauses on next scene dialogue', () => {
    const scenes: SceneDef[] = [
      { id:'music', steps:[
        { type:'music', track:'theme-1' },
        { type:'goto', scene:'end' }
      ]},
      { id:'end', steps:[ { type:'dialogue', text:'After music' } ]}
    ]
    const eng = createEngine({ autoEmit:false, autoAdvance:true })
    const trackEvents: any[] = []
    const playEvents: any[] = []
    const off1 = onMusicTrackChange((e)=> trackEvents.push(e))
    const off2 = onMusicPlay((e)=> playEvents.push(e))
    try {
      eng.loadScenes(scenes)
      eng.start('music')
      expect(trackEvents.length).toBe(1)
      expect(playEvents.length).toBe(1)
      expect(trackEvents[0].id).toBe('theme-1')
      expect(playEvents[0].id).toBe('theme-1')
      expect(eng.getPublicState().music).toBe('theme-1')
      // Paused on first dialogue of new scene after goto
      expect(eng.getPublicState().sceneId).toBe('end')
      expect(eng.getCurrentStep()?.type).toBe('dialogue')
      expect(eng.getPublicState().index).toBe(0)
    } finally {
      off1(); off2();
    }
  })

  it('applies background change before goto and pauses on target dialogue', () => {
    const scenes: SceneDef[] = [
      { id:'bgchange', steps:[
        { type:'background', src:'bg-forest.png' },
        { type:'goto', scene:'talk' }
      ]},
      { id:'talk', steps:[ { type:'dialogue', text:'Hello in forest' } ]}
    ]
    const eng = createEngine({ autoEmit:false, autoAdvance:true })
    eng.loadScenes(scenes)
    eng.start('bgchange')
    expect(eng.getPublicState().bg).toBe('bg-forest.png')
    expect(eng.getPublicState().sceneId).toBe('talk')
    expect(eng.getCurrentStep()?.type).toBe('dialogue')
  })

  it('shows and hides sprites correctly across steps before goto', () => {
    const scenes: SceneDef[] = [
      { id:'sprites', steps:[
        { type:'spriteShow', id:'hero', src:'hero.png' },
        { type:'spriteHide', id:'hero' },
        { type:'goto', scene:'scene' }
      ]},
      { id:'scene', steps:[ { type:'dialogue', text:'No sprite visible' } ]}
    ]
    const eng = createEngine({ autoEmit:false, autoAdvance:true })
    eng.loadScenes(scenes)
    eng.start('sprites')
    expect(eng.getPublicState().sprites['hero']).toBeUndefined()
    expect(eng.getPublicState().sceneId).toBe('scene')
    expect(eng.getCurrentStep()?.type).toBe('dialogue')
  })
})
