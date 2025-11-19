export class GameStateCore {
    constructor() {
        this._state = null;
    }
    static getInstance() { if (!this.instance)
        this.instance = new GameStateCore(); return this.instance; }
    init(initial) { if (!this._state)
        this._state = initial; }
    get snapshot() { if (!this._state)
        throw new Error('GameStateCore not initialized'); return this._state; }
    update(partial) { if (!this._state)
        throw new Error('GameStateCore not initialized'); this._state = { ...this._state, ...partial }; }
    validate() { const issues = []; if (!this._state)
        issues.push('state_missing'); if (this._state && !(this._state.flags instanceof Set))
        issues.push('flags_not_set'); return issues; }
}
export default GameStateCore;
