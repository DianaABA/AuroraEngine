export class GameMetricsModule {
    constructor(_get, _set) {
        this._get = _get;
        this._set = _set;
    }
    setPlayTime(ms) { const st = this._get(); this._set({ ...st, playTime: Math.max(0, ms) }); }
    accrue() { const st = this._get(); const now = Date.now(); const prev = st.lastPlayTime || now; const add = Math.max(0, now - prev); this._set({ ...st, playTime: st.playTime + add, lastPlayTime: now }); }
    getMetric(key) { const st = this._get(); return st[key]; }
}
export default GameMetricsModule;
