const levelOrder = ['debug', 'info', 'warn', 'error'];
export function createLogger(opts = {}) {
    const ns = opts.namespace ? `[${opts.namespace}]` : '';
    const minLevel = opts.level || 'debug';
    const allowedIdx = levelOrder.indexOf(minLevel);
    const make = (lvl) => (...a) => {
        if (levelOrder.indexOf(lvl) < allowedIdx)
            return;
        try {
            if (import.meta.env?.DEV)
                console[lvl === 'debug' ? 'log' : lvl](`${ns}[${lvl}]`, ...a);
        }
        catch { }
    };
    return {
        debug: make('debug'),
        info: make('info'),
        warn: make('warn'),
        error: make('error')
    };
}
// Global singleton (opt-in). Users may replace via dependency injection.
export const globalLogger = createLogger({ namespace: 'aurora', level: 'debug' });
