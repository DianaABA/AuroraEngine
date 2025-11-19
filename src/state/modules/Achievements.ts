import { emit } from '../../utils/eventBus'
import { getItem, setItem } from '../../utils/storage'

export interface AchievementData { id: string; title?: string; unlockedAt: number; meta?: Record<string, any> }

export default class Achievements {
  private key: string
  private map: Map<string, AchievementData>
  constructor(storageKey = 'aurora:achievements'){
    this.key = storageKey
    this.map = new Map()
    this.load()
  }
  private load(){
    const raw = getItem(this.key)
    if(!raw) return
    try{
      const arr: AchievementData[] = JSON.parse(raw)
      for(const a of arr){ this.map.set(a.id, a) }
    }catch{}
  }
  private save(){
    try{
      const arr = Array.from(this.map.values())
      setItem(this.key, JSON.stringify(arr))
    }catch{}
  }
  has(id: string){ return this.map.has(id) }
  list(){ return Array.from(this.map.values()).sort((a,b)=>a.unlockedAt-b.unlockedAt) }
  unlock(id: string, opts?: { title?: string; meta?: Record<string, any> }): AchievementData {
    if(this.map.has(id)) return this.map.get(id)!
    const data: AchievementData = { id, title: opts?.title, meta: opts?.meta, unlockedAt: Date.now() }
    this.map.set(id, data)
    this.save()
    emit('achievements:unlock', { id: data.id, title: data.title, meta: data.meta, unlockedAt: data.unlockedAt })
    return data
  }
  reset(){ this.map.clear(); this.save() }
}
