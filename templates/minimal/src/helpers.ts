export function resolveYPercent(meta: { y?: number; yPct?: number }): number {
  const raw = typeof meta.yPct === 'number'
    ? meta.yPct
    : typeof meta.y === 'number'
      ? meta.y
      : 0
  return Math.max(-200, Math.min(200, raw))
}
