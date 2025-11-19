export class GameFlagsModule {
    constructor(get, set) {
        this.get = get;
        this.set = set;
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
