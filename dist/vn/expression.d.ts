export interface Vars {
    [key: string]: unknown;
}
export declare function evaluateCondition(expr: string, flags: Set<string>, vars: Vars): boolean;
