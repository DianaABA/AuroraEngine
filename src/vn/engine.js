import { emit } from '../utils/eventBus';
import { emitMusicTrackChange, emitMusicPlay } from '../utils/eventBus';
import { evaluateCondition } from './expression';
import { validateSceneLinks } from './sceneLoader';
export class VNEngine {
    constructor(cfg = {}) {
        this.scenes = new Map();
        this.currentSceneId = null;
        this.index = 0;
        this.flags = new Set();
        this.vars = {};
        this.sprites = {};
        this.inAutoLoop = false;
        this.pauseOnNextDialogue = false;
        this.pauseAfterTransition = false;
        this.cachedAutoChoice = { sceneId: null, index: -1, candidate: null };
        this.config = { maxAutoSteps: 1000, ...cfg };
    }
    loadScenes(defs) {
        for (const s of defs) {
            this.scenes.set(s.id, s);
        }
        const linkErrors = validateSceneLinks([...this.scenes.values()]);
        if (linkErrors.length) {
            throw new Error('scene_validation_failed:' + linkErrors.join(';'));
        }
    }
    start(id) {
        if (!this.scenes.has(id))
            throw new Error('scene_not_found:' + id);
        const scene = this.scenes.get(id);
        this.currentSceneId = id;
        this.index = 0;
        this.cachedAutoChoice = { sceneId: null, index: -1, candidate: null };
        if (scene.bg)
            this.bg = scene.bg;
        if (scene.music)
            this.music = scene.music;
        this.emitStep();
        if (this.config.autoAdvance && !this.inAutoLoop)
            this.runAutoLoop();
    }
    getCurrentScene() { return this.currentSceneId ? this.scenes.get(this.currentSceneId) : null; }
    getCurrentStep() { const scene = this.getCurrentScene(); if (!scene)
        return null; return scene.steps[this.index] || null; }
    next() {
        const scene = this.getCurrentScene();
        if (!scene)
            return;
        const step = this.getCurrentStep();
        if (!step)
            return;
        if (step.type === 'choice') {
            if (this.maybeAutoDecide())
                return;
            return;
        }
        if (step.type === 'goto') {
            this.pauseOnNextDialogue = true;
            this.start(step.scene);
            return;
        }
        this.applySideEffects(step);
        this.index++;
        if (this.maybeAutoDecide())
            return;
        this.emitStep();
    }
    choose(optionIndex) {
        const step = this.getCurrentStep();
        if (!step || step.type !== 'choice')
            return;
        const choice = step.options[optionIndex];
        if (!choice)
            return;
        if (choice.setFlag)
            this.flags.add(choice.setFlag);
        if (choice.goto) {
            this.pauseOnNextDialogue = true;
            this.start(choice.goto);
            return;
        }
        this.index++;
        this.cachedAutoChoice = { sceneId: null, index: -1, candidate: null };
        if (this.maybeAutoDecide())
            return;
        this.emitStep();
    }
    applySideEffects(step) {
        if (!step)
            return;
        switch (step.type) {
            case 'spriteShow':
                this.sprites[step.id] = step.src;
                break;
            case 'spriteSwap':
                this.sprites[step.id] = step.src;
                break;
            case 'spriteHide':
                delete this.sprites[step.id];
                break;
            case 'background':
                this.bg = step.src;
                break;
            case 'music':
                this.music = step.track;
                emitMusicTrackChange({ id: step.track, title: step.track });
                emitMusicPlay({ id: step.track, title: step.track });
                break;
            case 'flag':
                step.value === false ? this.flags.delete(step.flag) : this.flags.add(step.flag);
                break;
            case 'transition':
                emit('vn:transition', { kind: step.kind, duration: step.duration || 0, state: this.getPublicState() });
                break;
        }
    }
    setVar(key, val) { this.vars[key] = val; }
    getVar(key) { return this.vars[key]; }
    hasFlag(f) { return this.flags.has(f); }
    snapshot() { return { sceneId: this.currentSceneId || '', index: this.index, flags: [...this.flags], vars: { ...this.vars }, sprites: { ...this.sprites }, bg: this.bg, music: this.music }; }
    restore(data) { if (!this.scenes.has(data.sceneId))
        throw new Error('restore_scene_missing'); this.currentSceneId = data.sceneId; this.index = data.index; this.flags = new Set(data.flags); this.vars = { ...data.vars }; this.sprites = { ...data.sprites }; this.bg = data.bg; this.music = data.music; this.cachedAutoChoice = { sceneId: null, index: -1, candidate: null }; this.emitStep(); }
    emitStep() {
        if (!this.config.autoEmit)
            return;
        const step = this.getCurrentStep();
        const state = this.getPublicState();
        if (step && step.type === 'choice') {
            const hint = this.computeAutoChoice(step, true);
            if (hint) {
                emit('vn:auto-choice-hint', {
                    sceneId: state.sceneId,
                    index: state.index,
                    chosenIndex: hint.idx,
                    chosenLabel: hint.choice.label,
                    strategy: hint.strategy,
                    options: hint.options,
                    validOptions: hint.validOptions,
                    willAutoDecide: !!(this.config.autoDecide || step.autoSingle || !!step.autoStrategy),
                    state
                });
            }
        }
        emit('vn:step', { step, state });
    }
    validChoiceOptions(step) { return step.options.filter(o => !o.condition || evaluateCondition(o.condition, this.flags, this.vars)); }
    computeAutoChoice(step, useCache = false) {
        if (useCache && this.cachedAutoChoice.sceneId === this.currentSceneId && this.cachedAutoChoice.index === this.index) {
            return this.cachedAutoChoice.candidate;
        }
        const valid = this.validChoiceOptions(step);
        if (valid.length === 0)
            return null;
        const cfg = this.config;
        const autoRequested = cfg.autoDecide || step.autoSingle || !!step.autoStrategy;
        if (!autoRequested) {
            if (useCache)
                this.cachedAutoChoice = { sceneId: this.currentSceneId, index: this.index, candidate: null };
            return null;
        }
        let chosen = null;
        let strategy = undefined;
        if (step.autoSingle && valid.length === 1) {
            chosen = valid[0];
            strategy = 'autoSingle';
        }
        else if (step.autoStrategy === 'firstValid') {
            chosen = valid[0];
            strategy = 'firstValid';
        }
        else if (step.autoStrategy === 'random') {
            chosen = valid[Math.floor(Math.random() * valid.length)];
            strategy = 'random';
        }
        else if (step.autoStrategy === 'highestWeight') {
            chosen = valid.slice().sort((a, b) => (b.weight || 0) - (a.weight || 0))[0];
            strategy = 'highestWeight';
        }
        else if (cfg.autoDecide && valid.length === 1) {
            chosen = valid[0];
            strategy = 'autoDecideSingle';
        }
        if (!chosen) {
            if (useCache)
                this.cachedAutoChoice = { sceneId: this.currentSceneId, index: this.index, candidate: null };
            return null;
        }
        const idx = step.options.indexOf(chosen);
        const candidate = { idx, choice: chosen, strategy: strategy || 'autoDecide', options: step.options.length, validOptions: valid.length };
        if (useCache) {
            this.cachedAutoChoice = { sceneId: this.currentSceneId, index: this.index, candidate };
        }
        return candidate;
    }
    maybeAutoDecide() {
        const step = this.getCurrentStep();
        if (!step || step.type !== 'choice')
            return false;
        const choiceStep = step;
        const candidate = this.computeAutoChoice(choiceStep, true);
        if (!candidate)
            return false;
        emit('vn:auto-choice', {
            sceneId: this.currentSceneId,
            index: this.index,
            chosenIndex: candidate.idx,
            chosenLabel: candidate.choice.label,
            strategy: candidate.strategy,
            options: candidate.options,
            validOptions: candidate.validOptions,
            state: this.getPublicState()
        });
        this.choose(candidate.idx);
        return true;
    }
    runAutoLoop() {
        if (!this.config.autoAdvance)
            return;
        if (this.inAutoLoop)
            return;
        this.inAutoLoop = true;
        let steps = 0;
        const max = this.config.maxAutoSteps || 1000;
        try {
            while (this.config.autoAdvance) {
                if (steps++ > max) {
                    emit('vn:auto-loop-guard', { steps, max, state: this.getPublicState() });
                    break;
                }
                const step = this.getCurrentStep();
                if (!step)
                    break;
                // Pause on the first dialogue encountered after a goto/choice scene change
                if (this.pauseOnNextDialogue && step.type === 'dialogue') {
                    this.pauseOnNextDialogue = false;
                    break;
                }
                // Pause at the first dialogue after any transition, even if side-effects occur before it
                if (this.pauseAfterTransition && step.type === 'dialogue') {
                    this.pauseAfterTransition = false;
                    break;
                }
                if (step.type === 'choice') {
                    if (this.maybeAutoDecide()) {
                        continue;
                    }
                    else {
                        break;
                    }
                }
                if (step.type === 'dialogue') {
                    this.next();
                    continue;
                }
                if (step.type === 'goto') {
                    this.next();
                    continue;
                }
                if (step.type === 'spriteShow' || step.type === 'spriteSwap' || step.type === 'spriteHide' || step.type === 'background' || step.type === 'music' || step.type === 'flag' || step.type === 'sfx' || step.type === 'transition') {
                    if (step.type === 'transition')
                        this.pauseAfterTransition = true;
                    this.next();
                    continue;
                }
                break;
            }
        }
        finally {
            this.inAutoLoop = false;
        }
    }
    getPublicState() { return { sceneId: this.currentSceneId, index: this.index, bg: this.bg, music: this.music, sprites: { ...this.sprites }, flags: [...this.flags], vars: { ...this.vars } }; }
    // Runtime controls for UI
    setAutoAdvance(on) {
        this.config.autoAdvance = on;
        if (on && !this.inAutoLoop)
            this.runAutoLoop();
    }
    setAutoDecide(on) {
        this.config.autoDecide = on;
        if (on && this.config.autoAdvance && !this.inAutoLoop)
            this.runAutoLoop();
    }
    isAutoAdvance() { return !!this.config.autoAdvance; }
    isAutoDecide() { return !!this.config.autoDecide; }
}
export function createEngine(cfg = {}) { return new VNEngine(cfg); }
//# sourceMappingURL=engine.js.map