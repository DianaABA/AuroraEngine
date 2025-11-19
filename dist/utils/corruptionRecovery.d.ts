export interface StorageLike {
    getItem(key: string): string | null;
    setItem(key: string, value: string): void;
    removeItem(key: string): void;
}
export declare function validateSlotShape(obj: any): boolean;
export declare function computeIntegrity(save: any): {
    algo: string;
    hash: string;
};
export declare function verifyIntegrity(save: any): boolean;
export declare function detectCorruption(save: any): boolean;
export declare function quarantineCorruptSlot(storage: StorageLike, key: string): boolean;
export declare function repairAttempt(save: any): any;
