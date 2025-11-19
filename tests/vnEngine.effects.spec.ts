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

  it('sets initial scene-level bg/music without emitting music events', () => {
    const scenes: SceneDef[] = [
      { id:'intro', bg:'bg-city.png', music:'intro-track', steps:[ { type:'dialogue', text:'Welcome' } ]}
    ]
    const eng = createEngine({ autoEmit:false, autoAdvance:false })
    const trackEvents: any[] = []
    const playEvents: any[] = []
    const off1 = onMusicTrackChange((e)=> trackEvents.push(e))
    const off2 = onMusicPlay((e)=> playEvents.push(e))
    try {
      eng.loadScenes(scenes)
      eng.start('intro')
      expect(eng.getPublicState().bg).toBe('bg-city.png')
      expect(eng.getPublicState().music).toBe('intro-track')
      // start() sets scene music but does not emit music events
      expect(trackEvents.length).toBe(0)
      expect(playEvents.length).toBe(0)
      expect(eng.getCurrentStep()?.type).toBe('dialogue')
    } finally { off1(); off2(); }
  })

  it('emits multiple music events on sequential music steps and lands on dialogue', () => {
    const scenes: SceneDef[] = [
      { id:'mix', steps:[
        { type:'music', track:'A' },
        { type:'music', track:'B' },
        { type:'goto', scene:'end' }
      ]},
      { id:'end', steps:[ { type:'dialogue', text:'After B' } ]}
    ]
    const eng = createEngine({ autoEmit:false, autoAdvance:true })
    const trackEvents: any[] = []
    const playEvents: any[] = []
    const off1 = onMusicTrackChange((e)=> trackEvents.push(e))
    const off2 = onMusicPlay((e)=> playEvents.push(e))
    try {
      eng.loadScenes(scenes)
      eng.start('mix')
      expect(trackEvents.map(e=>e.id)).toEqual(['A','B'])
      expect(playEvents.map(e=>e.id)).toEqual(['A','B'])
      expect(eng.getPublicState().music).toBe('B')
      expect(eng.getPublicState().sceneId).toBe('end')
      expect(eng.getCurrentStep()?.type).toBe('dialogue')
    } finally { off1(); off2(); }
  })

  it('sprite persists across goto until explicitly hidden later', () => {
    const scenes: SceneDef[] = [
      { id:'start', steps:[
        { type:'spriteShow', id:'hero', src:'hero.png' },
        { type:'goto', scene:'talk' }
      ]},
      { id:'talk', steps:[
        { type:'dialogue', text:'Hi there' },
        { type:'goto', scene:'hide' }
      ]},
      { id:'hide', steps:[
        { type:'spriteHide', id:'hero' },
        { type:'dialogue', text:'Hidden' }
      ]}
    ]
    const eng = createEngine({ autoEmit:false, autoAdvance:true })
    eng.loadScenes(scenes)
    eng.start('start')
    // Paused at talk dialogue after goto; sprite should still be visible
    expect(eng.getPublicState().sceneId).toBe('talk')
    expect(eng.getCurrentStep()?.type).toBe('dialogue')
    expect(eng.getPublicState().sprites['hero']).toBe('hero.png')
    // Advance dialogue then process goto to hide scene
    eng.next() // consume talk dialogue
    eng.next() // process goto -> hide; auto loop applies hide then pauses at dialogue
    expect(eng.getPublicState().sceneId).toBe('hide')
    expect(eng.getCurrentStep()?.type).toBe('dialogue')
    expect(eng.getPublicState().sprites['hero']).toBeUndefined()
  })

  it('treats sfx as side-effect only and pauses at next scene dialogue', () => {
    const scenes: SceneDef[] = [
      { id:'sfxflow', steps:[
        { type:'dialogue', text:'Start' },
        { type:'sfx', track:'click' },
        { type:'flag', flag:'heard' },
        { type:'goto', scene:'end' }
      ]},
      { id:'end', steps:[ { type:'dialogue', text:'Done' } ]}
    ]
    const eng = createEngine({ autoEmit:false, autoAdvance:true })
    eng.loadScenes(scenes)
    eng.start('sfxflow')
    expect(eng.hasFlag('heard')).toBe(true)
    expect(eng.getPublicState().sceneId).toBe('end')
    expect(eng.getCurrentStep()?.type).toBe('dialogue')
    expect(eng.getPublicState().index).toBe(0)
  })

  it('pauses on first dialogue after a transition even with side-effects in between', () => {
    const scenes: SceneDef[] = [
      { id:'t2', steps:[
        { type:'transition', kind:'fade', duration:200 },
        { type:'background', src:'bg-space.png' },
        { type:'dialogue', text:'After fade in space' }
      ]}
    ]
    const eng = createEngine({ autoEmit:false, autoAdvance:true })
    eng.loadScenes(scenes)
    eng.start('t2')
    expect(eng.getPublicState().bg).toBe('bg-space.png')
    expect(eng.getCurrentStep()?.type).toBe('dialogue')
  })
})
