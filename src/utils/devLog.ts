// Deprecated: prefer structured logger (logger.ts). Retained for backward compatibility.
export const devLog = {
  debug: (...a:any[])=>{ try { if((import.meta as any).env?.DEV) console.warn('[debug]',...a) } catch {} },
  info:  (...a:any[])=>{ try { if((import.meta as any).env?.DEV) console.warn('[info]',...a) } catch {} },
  warn:  (...a:any[])=>{ try { if((import.meta as any).env?.DEV) console.warn('[warn]',...a) } catch {} },
  error: (...a:any[])=>{ try { if((import.meta as any).env?.DEV) console.error('[error]',...a) } catch {} }
}
