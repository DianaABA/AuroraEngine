export interface GameState {
    currentEpisode: string;
    currentScene: string;
    currentLine: number;
    flags: Set<string>;
    variables: Record<string, any>;
    playTime: number;
    lastPlayTime: number;
    preferences: {
        autoSaveEnabled: boolean;
        autoSaveInterval: number;
        rollbackEnabled: boolean;
        maxRollbackSteps: number;
    };
}
export declare class GameStateCore {
    private static instance;
    private _state;
    static getInstance(): GameStateCore;
    init(initial: GameState): void;
    get snapshot(): GameState;
    update(partial: Partial<GameState>): void;
    validate(): string[];
}
export default GameStateCore;
