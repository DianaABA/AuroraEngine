import { emit } from '../../utils/eventBus'
import { getItem, setItem } from '../../utils/storage'

export interface GalleryItem { id: string; src: string; title?: string; unlockedAt: number; meta?: Record<string, any> }

export default class Gallery {
  private key: string
  private map: Map<string, GalleryItem>
  constructor(storageKey = 'aurora:gallery'){
    this.key = storageKey
    this.map = new Map()
    this.load()
  }
  private load(){
    const raw = getItem(this.key)
    if(!raw) return
    try{
      const arr: GalleryItem[] = JSON.parse(raw)
      for(const it of arr){ this.map.set(it.id, it) }
    }catch{}
  }
  private save(){
    try{
      const arr = Array.from(this.map.values())
      setItem(this.key, JSON.stringify(arr))
    }catch{}
  }
  has(id: string){ return this.map.has(id) }
  get(id: string){ return this.map.get(id) || null }
  list(){ return Array.from(this.map.values()).sort((a,b)=>a.unlockedAt-b.unlockedAt) }
  unlock(id: string, src: string, opts?: { title?: string; meta?: Record<string, any> }): GalleryItem {
    if(this.map.has(id)) return this.map.get(id)!
    const item: GalleryItem = { id, src, title: opts?.title, meta: opts?.meta, unlockedAt: Date.now() }
    this.map.set(id, item)
    this.save()
    emit('gallery:unlock', { id: item.id, src: item.src, title: item.title, meta: item.meta, unlockedAt: item.unlockedAt })
    return item
  }
  reset(){ this.map.clear(); this.save() }
}
