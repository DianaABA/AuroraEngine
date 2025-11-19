export function buildPreloadManifest(scenes) {
    const bg = new Set();
    const music = new Set();
    const sprites = new Set();
    for (const scene of scenes) {
        if (scene.bg)
            bg.add(scene.bg);
        if (scene.music)
            music.add(scene.music);
        for (const step of scene.steps) {
            collectStep(step, bg, music, sprites);
        }
    }
    return { backgrounds: [...bg], music: [...music], sprites: [...sprites] };
}
function collectStep(step, bg, music, sprites) {
    switch (step.type) {
        case 'background':
            bg.add(step.src);
            break;
        case 'music':
            music.add(step.track);
            break;
        case 'spriteShow':
            sprites.add(step.src);
            break;
    }
}
