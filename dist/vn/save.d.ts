import type { SnapshotData } from './sceneTypes';
export declare function encodeSnapshot(s: SnapshotData): string;
export declare function decodeSnapshot(raw: string): SnapshotData;
export declare function saveSnapshotLS(key: string, data: SnapshotData): void;
export declare function loadSnapshotLS(key: string): SnapshotData | null;
