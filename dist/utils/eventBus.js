const root = (typeof window !== 'undefined' && window) || globalThis;
export function emit(name, detail) { try {
    root.dispatchEvent(new CustomEvent(name, { detail }));
}
catch { } }
export function on(name, handler) { const fn = (e) => { handler(e.detail); }; try {
    root.addEventListener(name, fn);
}
catch { } ; return () => { try {
    root.removeEventListener(name, fn);
}
catch { } }; }
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
