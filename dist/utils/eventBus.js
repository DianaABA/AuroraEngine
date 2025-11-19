const root = (typeof window !== 'undefined' && window) || globalThis;
// Fallback minimalist emitter for non-DOM environments (e.g., Node tests)
const listeners = new Map();
const hasDom = !!(root && typeof root.addEventListener === 'function' && typeof root.dispatchEvent === 'function');
export function emit(name, detail) {
    if (hasDom) {
        try {
            root.dispatchEvent(new CustomEvent(name, { detail }));
        }
        catch { }
    }
    const set = listeners.get(name);
    if (set) {
        for (const h of Array.from(set)) {
            try {
                h(detail);
            }
            catch { }
        }
    }
}
export function on(name, handler) {
    let domFn = null;
    if (hasDom) {
        domFn = (e) => { handler(e.detail); };
        try {
            root.addEventListener(name, domFn);
        }
        catch { }
    }
    let set = listeners.get(name);
    if (!set) {
        set = new Set();
        listeners.set(name, set);
    }
    set.add(handler);
    return () => {
        if (hasDom && domFn) {
            try {
                root.removeEventListener(name, domFn);
            }
            catch { }
        }
        const s = listeners.get(name);
        if (s) {
            s.delete(handler);
        }
    };
}
export const emitNotification = (d) => emit('ui:notification', d);
export const onNotification = (h) => on('ui:notification', h);
export const emitGameStateCorrupt = (d) => emit('gameState:corrupt', d);
// Music events
export const emitMusicTrackChange = (d) => emit('music:track-change', d);
export const onMusicTrackChange = (h) => on('music:track-change', h);
export const emitMusicPlay = (d) => emit('music:play', d);
export const onMusicPlay = (h) => on('music:play', h);
export const emitMusicPause = (d) => emit('music:pause', d);
export const onMusicPause = (h) => on('music:pause', h);
