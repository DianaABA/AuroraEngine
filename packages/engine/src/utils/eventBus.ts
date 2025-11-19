// Lightweight event bus wrappers with typed helpers.

export type NotificationPayload = { id?: string; type: string; title: string; message?: string; icon?: string; timeoutMs?: number }

type Handler<T> = (detail: T) => void

export interface GlobalEvents {
  'save:corrupt': { slotKey: string; reason: string }
  'gameState:corrupt': { reason: string }
  'ui:notification': NotificationPayload
  'state:storage:estimate': { usage: number; quota?: number; pct?: number }
  'state:storage:warn': { usage: number; quota?: number; pct?: number; level: 'high' | 'critical' | 'near-full' }
}

const root: any = (typeof window !== 'undefined' && window) || (typeof globalThis !== 'undefined' ? globalThis : {})

function on<K extends keyof GlobalEvents>(name: K, handler: Handler<GlobalEvents[K]>) {
  const listener = (ev: Event) => {
    const any = ev as CustomEvent<GlobalEvents[K]>
    handler(any.detail as GlobalEvents[K])
  }
  try { root.addEventListener?.(name, listener as EventListener) } catch {}
  return () => { try { root.removeEventListener?.(name, listener as EventListener) } catch {} }
}

function emit<K extends keyof GlobalEvents>(name: K, detail?: GlobalEvents[K]) {
  try { root.dispatchEvent?.(new CustomEvent(name, { detail })) } catch {}
}

export const onSaveCorrupt = (handler: Handler<{ slotKey: string; reason: string }>) => on('save:corrupt', handler)
export const emitSaveCorrupt = (detail: { slotKey: string; reason: string }) => emit('save:corrupt', detail)
export const onGameStateCorrupt = (handler: Handler<{ reason: string }>) => on('gameState:corrupt', handler)
export const emitGameStateCorrupt = (detail: { reason: string }) => emit('gameState:corrupt', detail)
export const onNotification = (handler: Handler<NotificationPayload>) => on('ui:notification', handler)
export const emitNotification = (detail: NotificationPayload) => emit('ui:notification', detail)
export const onStorageEstimate = (handler: Handler<{ usage: number; quota?: number; pct?: number }>) => on('state:storage:estimate', handler)
export const onStorageWarn = (handler: Handler<{ usage: number; quota?: number; pct?: number; level: 'high' | 'critical' | 'near-full' }>) => on('state:storage:warn', handler)
export const emitStorageEstimate = (detail: { usage: number; quota?: number; pct?: number }) => emit('state:storage:estimate', detail)
export const emitStorageWarn = (detail: { usage: number; quota?: number; pct?: number; level: 'high' | 'critical' | 'near-full' }) => emit('state:storage:warn', detail)
