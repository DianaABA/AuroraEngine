export const SAVE_SCHEMA_VERSION = 1;
export function safeDeepClone(value) {
    try {
        if (typeof structuredClone === 'function')
            return structuredClone(value);
    }
    catch { }
    return JSON.parse(JSON.stringify(value));
}
