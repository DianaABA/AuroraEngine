import type { GameState } from '../GameStateCore';
export declare class GameFlagsModule {
    private get;
    private set;
    constructor(get: () => GameState, set: (s: GameState) => void);
    addFlag(id: string): boolean;
    removeFlag(id: string): boolean;
    hasFlag(id: string): boolean;
}
export default GameFlagsModule;
