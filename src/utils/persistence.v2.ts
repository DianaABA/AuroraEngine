export type PersistenceErrorCode = 'quota' | 'transient' | 'unknown'
export type Ok<T> = { ok: true; value: T }
export type Err = { ok: false; code: PersistenceErrorCode; message?: string }
export type Result<T> = Ok<T> | Err
export const ok = <T,>(value:T):Ok<T>=>({ok:true,value})
export const err = (code:PersistenceErrorCode,message?:string):Err=>({ok:false,code,message})
const wrap=(k:string)=> k.startsWith('aurora_')?k:`aurora_${k}`
export const AsyncStore = {
  async getItem(key:string){ try { return ok<string|null>(localStorage.getItem(wrap(key))) } catch(e){ return err('unknown', (e as any)?.message) } },
  async setItem(key:string, value:string){ try { localStorage.setItem(wrap(key), value); return ok<void>(undefined) } catch(e){ return err('unknown',(e as any)?.message) } },
  async getJSON<T=any>(key:string){ const r = await this.getItem(key); if(!r.ok) return r; if(!r.value) return ok<T|null>(null); try { return ok<T>(JSON.parse(r.value)) } catch { return err('transient','json') } },
  async setJSON<T=any>(key:string,v:T){ try { return await this.setItem(key, JSON.stringify(v)) } catch(e){ return err('unknown',(e as any)?.message) } }
}
