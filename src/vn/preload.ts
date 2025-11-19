import type { SceneDef, SceneStep } from './sceneTypes'

export interface PreloadManifest { backgrounds: string[]; music: string[]; sprites: string[] }

export function buildPreloadManifest(scenes: SceneDef[]): PreloadManifest {
  const bg = new Set<string>()
  const music = new Set<string>()
  const sprites = new Set<string>()
  for(const scene of scenes){
    if(scene.bg) bg.add(scene.bg)
    if(scene.music) music.add(scene.music)
    for(const step of scene.steps){
      collectStep(step, bg, music, sprites)
    }
  }
  return { backgrounds:[...bg], music:[...music], sprites:[...sprites] }
}

function collectStep(step: SceneStep, bg:Set<string>, music:Set<string>, sprites:Set<string>){
  switch(step.type){
    case 'background': bg.add(step.src); break
    case 'music': music.add(step.track); break
    case 'spriteShow': sprites.add(step.src); break
    case 'spriteSwap': sprites.add(step.src); break
  }
}

export interface PreloadProgress { loaded: number; total: number; kind: 'background'|'music'|'sprite'; item: string }

export async function preloadAssets(manifest: PreloadManifest, emit?: (p: PreloadProgress)=>void): Promise<void> {
  const bgItems = manifest.backgrounds.map(src=>({kind:'background' as const, src}))
  const musicItems = manifest.music.map(src=>({kind:'music' as const, src}))
  const spriteItems = manifest.sprites.map(src=>({kind:'sprite' as const, src}))
  const items = [...bgItems, ...musicItems, ...spriteItems]
  const total = items.length
  let loaded = 0
  const notify = (kind: 'background'|'music'|'sprite', src: string)=>{
    emit?.({ loaded, total, kind, item: src })
  }
  await Promise.all(items.map(it=> new Promise<void>((resolve)=>{
    if(it.kind==='background' || it.kind==='sprite'){
      const img = new Image()
      img.onload = ()=>{ loaded++; notify(it.kind, it.src); resolve() }
      img.onerror = ()=>{ loaded++; notify(it.kind, it.src); resolve() }
      img.src = it.src
    } else {
      try{
        const audio = new Audio()
        const done = ()=>{ loaded++; notify(it.kind, it.src); resolve() }
        audio.addEventListener('canplaythrough', done, { once: true })
        audio.addEventListener('error', done, { once: true })
        audio.src = it.src
        audio.load()
      }catch{
        loaded++; notify(it.kind, it.src); resolve()
      }
    }
  })))
}
