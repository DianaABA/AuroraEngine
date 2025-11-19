// Development-only logger: in production builds, it's a no-op. To satisfy lint, route debug/info to console.warn.
export const devLog = {
  debug: (...args: unknown[]) => { try { if ((import.meta as unknown as { env?: { DEV?: boolean } }).env?.DEV) console.warn('[debug]', ...args) } catch {} },
  info:  (...args: unknown[]) => { try { if ((import.meta as unknown as { env?: { DEV?: boolean } }).env?.DEV) console.warn('[info]', ...args) } catch {} },
  warn:  (...args: unknown[]) => { try { if ((import.meta as unknown as { env?: { DEV?: boolean } }).env?.DEV) console.warn(...args) } catch {} },
  error: (...args: unknown[]) => { try { if ((import.meta as unknown as { env?: { DEV?: boolean } }).env?.DEV) console.error(...args) } catch {} }
}
