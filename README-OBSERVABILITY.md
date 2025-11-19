## Observability Additions

This document summarizes new engine-level observability primitives.

### Logger (`utils/logger.ts`)
Structured logger with level gating and optional namespace.

```ts
import { createLogger, globalLogger } from 'aurora-engine/utils/logger'
const log = createLogger({ namespace: 'save', level: 'info' })
log.debug('ignored')
log.info('persist ok')
```

### Metrics (`utils/metrics.ts`)
Counters and simple timing helpers.

```ts
import { incrementCounter, timeSync, getMetricsSnapshot } from 'aurora-engine/utils/metrics'
timeSync('parse', () => parseEpisodeMarkdown(md))
incrementCounter('saves')
console.table(getMetricsSnapshot())
```

### Corruption Recovery (`utils/corruptionRecovery.ts`)
Detect, quarantine, and attempt repair of corrupt saves.

```ts
import { detectCorruption, quarantineCorruptSlot, repairAttempt } from 'aurora-engine/utils/corruptionRecovery'
if (detectCorruption(slot)) {
  quarantineCorruptSlot(localStorage, slotKey)
  const repaired = repairAttempt(slot)
}
```

### Progression Plugins (`state/modules/GameProgression.ts`)
Register modular progression logic.

```ts
progression.registerPlugin({
  id: 'chapters',
  canNavigateToEpisode: (id, state) => state.variables?.unlocked?.includes(id),
  getEpisodeTitle: (id) => id.startsWith('ep') ? `Episode ${id.slice(2)}` : null
})
```

These additions are intentionally minimal; future work may introduce event emission for metrics flush, structured JSON logs, and tracing spans.