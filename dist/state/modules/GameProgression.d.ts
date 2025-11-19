import type { GameState } from '../GameStateCore';
export interface ProgressionPlugin {
    id: string;
    onInit?(state: GameState): void;
    onTick?(state: GameState): void;
    canNavigateToEpisode?(id: string, state: GameState): boolean;
    getEpisodeTitle?(id: string, state: GameState): string | null;
}
export declare class GameProgressionModule {
    private readonly _get;
    private readonly _set;
    private plugins;
    constructor(_get: () => GameState, _set: (s: GameState) => void);
    registerPlugin(plugin: ProgressionPlugin): void;
    tick(): void;
    canNavigateToEpisode(id: string): boolean;
    getEpisodeTitle(id: string): string;
    debugSnapshot(): {
        episode: string;
        pluginCount: number;
    };
}
export default GameProgressionModule;
