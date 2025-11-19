// Deprecated: prefer structured logger (logger.ts). Retained for backward compatibility.
export const devLog = {
    debug: (...a) => { try {
        if (import.meta.env?.DEV)
            console.warn('[debug]', ...a);
    }
    catch { } },
    info: (...a) => { try {
        if (import.meta.env?.DEV)
            console.warn('[info]', ...a);
    }
    catch { } },
    warn: (...a) => { try {
        if (import.meta.env?.DEV)
            console.warn('[warn]', ...a);
    }
    catch { } },
    error: (...a) => { try {
        if (import.meta.env?.DEV)
            console.error('[error]', ...a);
    }
    catch { } }
};
