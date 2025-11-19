import type { SnapshotData } from './sceneTypes'

export function encodeSnapshot(s: SnapshotData){ return JSON.stringify(s) }
export function decodeSnapshot(raw: string){ return JSON.parse(raw) as SnapshotData }

// Convenience helpers for localStorage persistence (Phase 1 scope)
export function saveSnapshotLS(key: string, data: SnapshotData){ try{ localStorage.setItem(key, encodeSnapshot(data)) }catch{} }
export function loadSnapshotLS(key: string): SnapshotData | null {
	try{ const raw = localStorage.getItem(key); return raw? decodeSnapshot(raw): null }catch{ return null }
}
