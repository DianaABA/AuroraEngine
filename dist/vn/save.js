export function encodeSnapshot(s) { return JSON.stringify(s); }
export function decodeSnapshot(raw) { return JSON.parse(raw); }
// Convenience helpers for localStorage persistence (Phase 1 scope)
export function saveSnapshotLS(key, data) { try {
    localStorage.setItem(key, encodeSnapshot(data));
}
catch { } }
export function loadSnapshotLS(key) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? decodeSnapshot(raw) : null;
    }
    catch {
        return null;
    }
}
