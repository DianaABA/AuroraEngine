export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
export interface LoggerOptions {
    namespace?: string;
    level?: LogLevel;
}
export declare function createLogger(opts?: LoggerOptions): {
    debug: (...a: any[]) => void;
    info: (...a: any[]) => void;
    warn: (...a: any[]) => void;
    error: (...a: any[]) => void;
};
export declare const globalLogger: {
    debug: (...a: any[]) => void;
    info: (...a: any[]) => void;
    warn: (...a: any[]) => void;
    error: (...a: any[]) => void;
};
