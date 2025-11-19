import type { SceneDef, SceneStep, SnapshotData } from './sceneTypes';
export interface VNEngineConfig {
    autoEmit?: boolean;
    autoDecide?: boolean;
    autoAdvance?: boolean;
    maxAutoSteps?: number;
}
export declare class VNEngine {
    private scenes;
    private currentSceneId;
    private index;
    private flags;
    private vars;
    private sprites;
    private bg?;
    private music?;
    private config;
    private inAutoLoop;
    private justEnteredSceneFromGoto;
    constructor(cfg?: VNEngineConfig);
    loadScenes(defs: SceneDef[]): void;
    start(id: string): void;
    getCurrentScene(): SceneDef | null;
    getCurrentStep(): SceneStep | null;
    next(): void;
    choose(optionIndex: number): void;
    private applySideEffects;
    setVar(key: string, val: any): void;
    getVar(key: string): any;
    hasFlag(f: string): boolean;
    snapshot(): SnapshotData;
    restore(data: SnapshotData): void;
    private emitStep;
    private validChoiceOptions;
    private maybeAutoDecide;
    private runAutoLoop;
    getPublicState(): {
        sceneId: string | null;
        index: number;
        bg: string | undefined;
        music: string | undefined;
        sprites: {
            [x: string]: string;
        };
        flags: string[];
        vars: {
            [x: string]: any;
        };
    };
}
export declare function createEngine(cfg?: VNEngineConfig): VNEngine;
