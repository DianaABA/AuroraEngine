export interface NotificationPayload { id?: string; type: string; title: string; message?: string }
export interface MusicTrackEventDetail { id: string; title: string }
const root: any = (typeof window !== 'undefined' && window) || globalThis
export function emit<K extends string>(name: K, detail?: any){ try { root.dispatchEvent(new CustomEvent(name,{detail})) } catch {} }
export function on<K extends string>(name: K, handler: (detail:any)=>void){ const fn=(e:Event)=>{handler((e as CustomEvent).detail)}; try { root.addEventListener(name,fn) } catch {}; return ()=>{ try { root.removeEventListener(name,fn) } catch {} } }
export const emitNotification = (d: NotificationPayload)=> emit('ui:notification', d)
export const onNotification = (h:(d:NotificationPayload)=>void)=> on('ui:notification', h)
export const emitGameStateCorrupt = (d:{reason:string})=> emit('gameState:corrupt', d)
// Music events
export const emitMusicTrackChange = (d: MusicTrackEventDetail)=> emit('music:track-change', d)
export const onMusicTrackChange = (h:(d:MusicTrackEventDetail)=>void)=> on('music:track-change', h)
export const emitMusicPlay = (d: MusicTrackEventDetail)=> emit('music:play', d)
export const onMusicPlay = (h:(d:MusicTrackEventDetail)=>void)=> on('music:play', h)
export const emitMusicPause = (d: MusicTrackEventDetail)=> emit('music:pause', d)
export const onMusicPause = (h:(d:MusicTrackEventDetail)=>void)=> on('music:pause', h)
