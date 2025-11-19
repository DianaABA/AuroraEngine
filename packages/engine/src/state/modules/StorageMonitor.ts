// StorageMonitor: periodically samples StorageManager estimate (if available)
// Emits state:storage:estimate every interval and state:storage:warn at thresholds.
// Thresholds: 70% (high), 85% (critical), 95% (near-full)
// Fallback: approximate usage by summing localStorage key/value lengths if quota unavailable.
import { emitStorageEstimate, emitStorageWarn } from '../../utils/eventBus'

export interface StorageMonitorConfig {
  intervalMs?: number
  highPct?: number
  criticalPct?: number
  nearFullPct?: number
}

export class StorageMonitor {
  private timer: ReturnType<typeof setInterval> | null = null
  private lastWarnLevel: string | null = null
  private cfg: Required<StorageMonitorConfig>

  constructor(cfg: StorageMonitorConfig = {}) {
    this.cfg = {
      intervalMs: cfg.intervalMs ?? 15000,
      highPct: cfg.highPct ?? 70,
      criticalPct: cfg.criticalPct ?? 85,
      nearFullPct: cfg.nearFullPct ?? 95
    }
  }

  private async sampleOnce() {
    let usage = 0
    let quota: number | undefined
    try {
      if (navigator?.storage?.estimate) {
        const est = await navigator.storage.estimate()
        usage = typeof est.usage === 'number' ? est.usage : 0
        quota = typeof est.quota === 'number' ? est.quota : undefined
      } else {
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i) || ''
          const v = localStorage.getItem(k) || ''
          usage += k.length + v.length
        }
        quota = 5 * 1024 * 1024
      }
    } catch {}
    const pct = quota ? Math.min(100, Math.round((usage / quota) * 100)) : undefined
    emitStorageEstimate({ usage, quota, pct })
    if (pct != null) {
      let level: 'high' | 'critical' | 'near-full' | null = null
      if (pct >= this.cfg.nearFullPct) level = 'near-full'
      else if (pct >= this.cfg.criticalPct) level = 'critical'
      else if (pct >= this.cfg.highPct) level = 'high'
      if (level && level !== this.lastWarnLevel) {
        this.lastWarnLevel = level
        emitStorageWarn({ usage, quota, pct, level })
      }
      if (!level) this.lastWarnLevel = null
    }
  }

  start() {
    if (this.timer) return
    this.sampleOnce()
    this.timer = setInterval(() => { this.sampleOnce() }, this.cfg.intervalMs)
  }

  stop() {
    if (this.timer) { clearInterval(this.timer); this.timer = null }
  }
}

let singleton: StorageMonitor | null = null
export function getStorageMonitor(): StorageMonitor {
  if (!singleton) singleton = new StorageMonitor()
  return singleton
}

export default StorageMonitor
