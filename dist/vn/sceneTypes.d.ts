export type DialogueStep = {
    type: 'dialogue';
    char?: string;
    text: string;
};
export type SpritePlacement = {
    pos?: 'left' | 'center' | 'right';
    x?: number;
    y?: number;
    z?: number;
    scale?: number;
};
export type SpriteMotion = {
    moveMs?: number;
    moveEase?: string;
    moveTo?: {
        x?: number;
        y?: number;
        ms?: number;
        ease?: string;
    };
};
export type SpriteMove = {
    type: 'move';
    x?: number;
    y?: number;
    ms?: number;
    ease?: string;
};
export type SpriteTimeline = {
    moves?: SpriteMove[];
};
export type SpriteShowStep = {
    type: 'spriteShow';
    id: string;
    src: string;
    role?: string;
} & SpritePlacement & SpriteMotion & SpriteTimeline;
export type SpriteHideStep = {
    type: 'spriteHide';
    id: string;
};
export type SpriteSwapStep = {
    type: 'spriteSwap';
    id: string;
    src: string;
    role?: string;
} & SpritePlacement & SpriteMotion & SpriteTimeline;
export type BackgroundStep = {
    type: 'background';
    src: string;
};
export type ChoiceOption = {
    label: string;
    goto?: string;
    setFlag?: string;
    condition?: string;
    weight?: number;
};
export type ChoiceStep = {
    type: 'choice';
    options: ChoiceOption[];
    autoSingle?: boolean;
    autoStrategy?: 'firstValid' | 'random' | 'highestWeight';
};
export type FlagSetStep = {
    type: 'flag';
    flag: string;
    value?: boolean;
};
export type MusicStep = {
    type: 'music';
    track: string;
};
export type SfxStep = {
    type: 'sfx';
    track: string;
};
export type GotoStep = {
    type: 'goto';
    scene: string;
};
export type TransitionStep = {
    type: 'transition';
    kind: 'fade' | 'slide' | 'zoom' | 'shake' | 'flash';
    duration?: number;
};
export type SceneStep = DialogueStep | SpriteShowStep | SpriteHideStep | SpriteSwapStep | BackgroundStep | ChoiceStep | FlagSetStep | MusicStep | SfxStep | GotoStep | TransitionStep;
export interface SceneDef {
    id: string;
    bg?: string;
    music?: string;
    steps: SceneStep[];
}
export interface SnapshotData {
    sceneId: string;
    index: number;
    flags: string[];
    vars: Record<string, any>;
    sprites: Record<string, string>;
    bg?: string;
    music?: string;
}
