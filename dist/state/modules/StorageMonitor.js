export class StorageMonitor {
    constructor() {
        this.timer = null;
    }
    start() { if (this.timer)
        return; this.timer = setInterval(() => { }, 15000); }
    stop() { if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
    } }
}
export function getStorageMonitor() { return new StorageMonitor(); }
