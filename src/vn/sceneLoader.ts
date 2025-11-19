import type { SceneDef, SceneStep } from './sceneTypes'

export interface SceneLoadResult { scenes: SceneDef[]; errors: string[] }

export function validateSceneDef(raw: any): { def?: SceneDef; error?: string } {
  if(!raw || typeof raw !== 'object') return { error: 'invalid_scene_object' }
  if(typeof raw.id !== 'string' || !raw.id.trim()) return { error: 'scene_missing_id' }
  if(!Array.isArray(raw.steps)) return { error: 'scene_missing_steps:'+raw.id }
  const steps: SceneStep[] = []
  for(const s of raw.steps){
    if(!s || typeof s !== 'object' || typeof s.type !== 'string') return { error: 'invalid_step:'+raw.id }
    steps.push(s as SceneStep)
  }
  return { def: { id: raw.id, bg: raw.bg, music: raw.music, steps } }
}

export function loadSceneDefsFromArray(arr: any[]): SceneLoadResult {
  const scenes: SceneDef[] = []
  const errors: string[] = []
  for(const raw of arr){
    const { def, error } = validateSceneDef(raw)
    if(def) scenes.push(def); else if(error) errors.push(error)
  }
  return { scenes, errors }
}

export function loadSceneDefsFromObject(record: Record<string, any>): SceneLoadResult {
  const scenes: SceneDef[] = []
  const errors: string[] = []
  for(const key of Object.keys(record)){
    const { def, error } = validateSceneDef(record[key])
    if(def) scenes.push(def); else if(error) errors.push(key+':'+error)
  }
  return { scenes, errors }
}

export function indexScenes(scenes: SceneDef[]): Map<string, SceneDef> {
  const map = new Map<string, SceneDef>()
  for(const s of scenes){ map.set(s.id, s) }
  return map
}

// Simple interpreter helper for one-off scene testing
export function simulateScene(s: SceneDef): string[] {
  const log: string[] = []
  for(const step of s.steps){
    switch(step.type){
      case 'dialogue': log.push(step.char? step.char+': '+step.text : step.text); break
      case 'choice': log.push('CHOICE:'+ step.options.map(o=>o.label).join('|')); break
      case 'background': log.push('BG:'+step.src); break
      case 'music': log.push('MUSIC:'+step.track); break
      case 'spriteShow': log.push('SPRITE+'+step.id); break
      case 'spriteHide': log.push('SPRITE-'+step.id); break
      case 'flag': log.push('FLAG:'+step.flag+(step.value===false?':off':':on')); break
      case 'goto': log.push('GOTO:'+step.scene); break
      case 'transition': log.push('TRANSITION:'+step.kind); break
    }
  }
  return log
}

// Convenience: parse scenes from a JSON string (array or object form)
export function loadScenesFromJson(json: string): SceneLoadResult {
  const errors: string[] = []
  try {
    const data = JSON.parse(json)
    if (Array.isArray(data)) return loadSceneDefsFromArray(data)
    if (data && typeof data === 'object') return loadSceneDefsFromObject(data as Record<string, any>)
    return { scenes: [], errors: ['json_root_must_be_array_or_object'] }
  } catch (e:any) {
    errors.push('json_parse_error:'+ (e?.message||'unknown'))
    return { scenes: [], errors }
  }
}

// Convenience: fetch scenes JSON from a URL (browser/Node18+)
export async function loadScenesFromUrl(url: string): Promise<SceneLoadResult> {
  const errors: string[] = []
  try {
    const res = await fetch(url)
    if(!res.ok) return { scenes: [], errors: ['http_'+res.status] }
    const text = await res.text()
    return loadScenesFromJson(text)
  } catch (e:any) {
    errors.push('fetch_error:'+ (e?.message||'unknown'))
    return { scenes: [], errors }
  }
}
