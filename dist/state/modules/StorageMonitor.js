export class StorageMonitor {
    constructor() {
        Object.defineProperty(this, "timer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
    }
    start() { if (this.timer)
        return; this.timer = setInterval(() => { }, 15000); }
    stop() { if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
    } }
}
export function getStorageMonitor() { return new StorageMonitor(); }
