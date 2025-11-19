export declare function incrementCounter(name: string, delta?: number): void;
export declare function getMetricsSnapshot(): {
    name: string;
    value: number;
}[];
export declare function timeAsync<T>(label: string, fn: () => Promise<T>): Promise<T>;
export declare function timeSync<T>(label: string, fn: () => T): T;
export declare function resetMetrics(): void;
