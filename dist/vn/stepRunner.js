import GameStateManager from '../utils/GameStateManager';
export function runSteps(steps, gsm = GameStateManager.getInstance()) {
    for (const s of steps) {
        if (s.flagsAdd) {
            for (const f of s.flagsAdd)
                gsm.addFlag(f);
        }
        if (typeof s.line === 'number') {
            gsm.updateState({ currentLine: s.line });
        }
    }
}
