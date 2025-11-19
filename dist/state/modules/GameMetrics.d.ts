import type { GameState } from '../GameStateCore';
export declare class GameMetricsModule {
    private readonly _get;
    private readonly _set;
    constructor(_get: () => GameState, _set: (s: GameState) => void);
    setPlayTime(ms: number): void;
    accrue(): void;
    getMetric(key: string): any;
}
export default GameMetricsModule;
