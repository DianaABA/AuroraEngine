import type { SceneDef } from './sceneTypes';
export interface PreloadManifest {
    backgrounds: string[];
    music: string[];
    sprites: string[];
}
export declare function buildPreloadManifest(scenes: SceneDef[]): PreloadManifest;
export interface PreloadProgress {
    loaded: number;
    total: number;
    kind: 'background' | 'music' | 'sprite';
    item: string;
}
export declare function preloadAssets(manifest: PreloadManifest, emit?: (p: PreloadProgress) => void): Promise<void>;
