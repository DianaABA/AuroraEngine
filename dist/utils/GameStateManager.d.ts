export interface GameStatePreferences {
    autoSaveEnabled: boolean;
    autoSaveInterval: number;
    rollbackEnabled: boolean;
    maxRollbackSteps: number;
}
export interface GameState {
    currentEpisode: string;
    currentScene: string;
    currentLine: number;
    variables: Record<string, any>;
    flags: Set<string>;
    playTime: number;
    lastPlayTime: number;
    preferences: GameStatePreferences;
}
declare class GameStateManager {
    private static instance;
    private state;
    private flags;
    private progression;
    private metrics;
    private listeners;
    private constructor();
    static getInstance(): GameStateManager;
    getCurrentState(): any;
    updateState(partial: Partial<GameState>): void;
    private validate;
    on(ev: string, fn: (p: any) => void): () => void;
    private emit;
    addFlag(id: string): boolean;
    removeFlag(id: string): boolean;
    hasFlag(id: string): boolean;
}
export default GameStateManager;
