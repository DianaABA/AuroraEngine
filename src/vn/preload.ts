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
  }
}
