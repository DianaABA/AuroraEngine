import type { SceneDef } from './sceneTypes';
export interface PreloadManifest {
    backgrounds: string[];
    music: string[];
    sprites: string[];
}
export declare function buildPreloadManifest(scenes: SceneDef[]): PreloadManifest;
