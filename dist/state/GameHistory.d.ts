import type { GameState } from './GameStateCore';
export declare class GameHistory {
    private static instance;
    private stack;
    private max;
    static getInstance(): GameHistory;
    configure(maxSteps: number): void;
    push(s: GameState): void;
    canRollback(): boolean;
    pop(): GameState | null;
    clear(): void;
}
export default GameHistory;
