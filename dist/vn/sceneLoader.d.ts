import type { SceneDef } from './sceneTypes';
export interface SceneLoadResult {
    scenes: SceneDef[];
    errors: string[];
}
export type ValidationIssue = {
    path: string;
    code: string;
    message: string;
};
export declare function validateSceneDefStrict(raw: any): {
    def?: SceneDef;
    errors: ValidationIssue[];
};
export declare function validateSceneDef(raw: any): {
    def?: SceneDef;
    error?: string;
};
export declare function loadSceneDefsFromArray(arr: any[]): SceneLoadResult;
export declare function validateScenesStrictCollection(raw: any[]): {
    scenes: SceneDef[];
    errors: ValidationIssue[];
};
export declare function loadSceneDefsFromObject(record: Record<string, any>): SceneLoadResult;
export declare function loadSceneDefsStrict(arr: any[]): {
    scenes: SceneDef[];
    errors: ValidationIssue[];
};
export declare function indexScenes(scenes: SceneDef[]): Map<string, SceneDef>;
export declare function validateSceneLinks(scenes: SceneDef[]): string[];
export declare function validateSceneLinksStrict(scenes: SceneDef[]): ValidationIssue[];
export declare function simulateScene(s: SceneDef): string[];
export declare function loadScenesFromJson(json: string): SceneLoadResult;
export declare function loadScenesFromJsonStrict(json: string): {
    scenes: SceneDef[];
    errors: ValidationIssue[];
};
export declare function loadScenesFromUrl(url: string): Promise<SceneLoadResult>;
export declare function loadScenesFromUrlStrict(url: string): Promise<{
    scenes: SceneDef[];
    errors: ValidationIssue[];
}>;
