export class GameFlagsModule {
    constructor(get, set) {
        Object.defineProperty(this, "get", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: get
        });
        Object.defineProperty(this, "set", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: set
        });
    }
    addFlag(id) { const f = id.trim(); if (!f)
        return false; const st = this.get(); if (st.flags.has(f))
        return false; const next = new Set(st.flags); next.add(f); this.set({ ...st, flags: next }); return true; }
    removeFlag(id) { const f = id.trim(); if (!f)
        return false; const st = this.get(); if (!st.flags.has(f))
        return false; const next = new Set(st.flags); next.delete(f); this.set({ ...st, flags: next }); return true; }
    hasFlag(id) { return this.get().flags.has(id.trim()); }
}
export default GameFlagsModule;
