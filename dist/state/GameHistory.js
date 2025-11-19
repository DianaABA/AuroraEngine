export class GameHistory {
    constructor() {
        Object.defineProperty(this, "stack", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "max", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 50
        });
    }
    static getInstance() { if (!this.instance)
        this.instance = new GameHistory(); return this.instance; }
    configure(maxSteps) { this.max = Math.max(1, Math.min(500, maxSteps)); }
    push(s) { this.stack.push(JSON.parse(JSON.stringify(s))); if (this.stack.length > this.max)
        this.stack.shift(); }
    canRollback() { return this.stack.length > 0; }
    pop() { return this.stack.pop() || null; }
    clear() { this.stack = []; }
}
export default GameHistory;
