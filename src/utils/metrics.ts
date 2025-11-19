interface Counter { name: string; value: number }
const counters: Map<string, Counter> = new Map()

export function incrementCounter(name: string, delta = 1) {
  const c = counters.get(name)
  if (c) c.value += delta
  else counters.set(name, { name, value: delta })
}

export function getMetricsSnapshot() {
  return Array.from(counters.values()).map(c => ({ name: c.name, value: c.value }))
}

export async function timeAsync<T>(label: string, fn: () => Promise<T>): Promise<T> {
  const start = performance.now()
  try { return await fn() } finally { incrementCounter(label + ':ms', performance.now() - start) }
}

export function timeSync<T>(label: string, fn: () => T): T {
  const start = performance.now()
  try { return fn() } finally { incrementCounter(label + ':ms', performance.now() - start) }
}

export function resetMetrics() { counters.clear() }