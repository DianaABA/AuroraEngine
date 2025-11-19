const counters = new Map();
export function incrementCounter(name, delta = 1) {
    const c = counters.get(name);
    if (c)
        c.value += delta;
    else
        counters.set(name, { name, value: delta });
}
export function getMetricsSnapshot() {
    return Array.from(counters.values()).map(c => ({ name: c.name, value: c.value }));
}
export async function timeAsync(label, fn) {
    const start = performance.now();
    try {
        return await fn();
    }
    finally {
        incrementCounter(label + ':ms', performance.now() - start);
    }
}
export function timeSync(label, fn) {
    const start = performance.now();
    try {
        return fn();
    }
    finally {
        incrementCounter(label + ':ms', performance.now() - start);
    }
}
export function resetMetrics() { counters.clear(); }
