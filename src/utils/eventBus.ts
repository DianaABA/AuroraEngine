export interface NotificationPayload { id?: string; type: string; title: string; message?: string }
export interface MusicTrackEventDetail { id: string; title: string }
const root: any = (typeof window !== 'undefined' && window) || globalThis

// Fallback minimalist emitter for non-DOM environments (e.g., Node tests)
const listeners = new Map<string, Set<(d:any)=>void>>()
const hasDom = !!(root && typeof root.addEventListener === 'function' && typeof root.dispatchEvent === 'function')

export function emit<K extends string>(name: K, detail?: any){
	if(hasDom){
		try { root.dispatchEvent(new CustomEvent(name,{detail})) } catch {}
	}
	const set = listeners.get(name)
	if(set){
		for(const h of Array.from(set)){
			try { h(detail) } catch {}
		}
	}
}

export function on<K extends string>(name: K, handler: (detail:any)=>void){
	let domFn: ((e:Event)=>void) | null = null
	if(hasDom){
		domFn = (e:Event)=>{ handler((e as CustomEvent).detail) }
		try { root.addEventListener(name, domFn) } catch {}
	}
	let set = listeners.get(name)
	if(!set){ set = new Set(); listeners.set(name, set) }
	set.add(handler)
	return ()=>{
		if(hasDom && domFn){ try { root.removeEventListener(name, domFn) } catch {} }
		const s = listeners.get(name); if(s){ s.delete(handler) }
	}
}

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
