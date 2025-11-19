import GameStateManager from '../utils/GameStateManager';
export interface Step {
    type: string;
    line?: number;
    flagsAdd?: string[];
}
export declare function runSteps(steps: Step[], gsm?: GameStateManager): void;
