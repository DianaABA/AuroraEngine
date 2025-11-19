import type { SceneDef } from './sceneTypes';
export interface SceneLoadResult {
    scenes: SceneDef[];
    errors: string[];
}
export declare function validateSceneDef(raw: any): {
    def?: SceneDef;
    error?: string;
};
export declare function loadSceneDefsFromArray(arr: any[]): SceneLoadResult;
export declare function loadSceneDefsFromObject(record: Record<string, any>): SceneLoadResult;
export declare function indexScenes(scenes: SceneDef[]): Map<string, SceneDef>;
export declare function simulateScene(s: SceneDef): string[];
export declare function loadScenesFromJson(json: string): SceneLoadResult;
export declare function loadScenesFromUrl(url: string): Promise<SceneLoadResult>;
