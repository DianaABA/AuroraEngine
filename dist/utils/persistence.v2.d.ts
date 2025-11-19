export type PersistenceErrorCode = 'quota' | 'transient' | 'unknown';
export type Ok<T> = {
    ok: true;
    value: T;
};
export type Err = {
    ok: false;
    code: PersistenceErrorCode;
    message?: string;
};
export type Result<T> = Ok<T> | Err;
export declare const ok: <T>(value: T) => Ok<T>;
export declare const err: (code: PersistenceErrorCode, message?: string) => Err;
export declare const AsyncStore: {
    getItem(key: string): Promise<Err | Ok<string | null>>;
    setItem(key: string, value: string): Promise<Err | Ok<void>>;
    getJSON<T = any>(key: string): Promise<Err | Ok<T | null>>;
    setJSON<T = any>(key: string, v: T): Promise<Err | Ok<void>>;
};
