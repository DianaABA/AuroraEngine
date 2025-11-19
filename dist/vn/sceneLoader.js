export function validateSceneDef(raw) {
    const errs = [];
    const ctx = (k) => `scene:${raw?.id ?? '?'}:${k}`;
    if (!raw || typeof raw !== 'object')
        return { error: 'invalid_scene_object' };
    if (typeof raw.id !== 'string' || !raw.id.trim())
        errs.push('scene_missing_id');
    if (!Array.isArray(raw.steps))
        errs.push(ctx('steps') + ':missing_steps');
    const steps = [];
    if (Array.isArray(raw.steps)) {
        raw.steps.forEach((s, i) => {
            const sp = `step[${i}]`;
            if (!s || typeof s !== 'object') {
                errs.push(ctx(sp) + ':invalid_object');
                return;
            }
            if (typeof s.type !== 'string') {
                errs.push(ctx(sp) + ':missing_type');
                return;
            }
            // type-specific validation
            switch (s.type) {
                case 'dialogue':
                    if (typeof s.text !== 'string')
                        errs.push(ctx(sp) + ':dialogue.missing_text');
                    if (s.char !== undefined && typeof s.char !== 'string')
                        errs.push(ctx(sp) + ':dialogue.char_not_string');
                    break;
                case 'choice':
                    if (!Array.isArray(s.options) || s.options.length === 0) {
                        errs.push(ctx(sp) + ':choice.missing_options');
                        break;
                    }
                    s.options.forEach((o, oi) => {
                        const op = `${sp}.options[${oi}]`;
                        if (!o || typeof o !== 'object') {
                            errs.push(ctx(op) + ':invalid_object');
                            return;
                        }
                        if (typeof o.label !== 'string')
                            errs.push(ctx(op) + ':missing_label');
                        if (o.goto !== undefined && typeof o.goto !== 'string')
                            errs.push(ctx(op) + ':goto_not_string');
                        if (o.setFlag !== undefined && typeof o.setFlag !== 'string')
                            errs.push(ctx(op) + ':setFlag_not_string');
                        if (o.condition !== undefined && typeof o.condition !== 'string')
                            errs.push(ctx(op) + ':condition_not_string');
                        if (o.weight !== undefined && typeof o.weight !== 'number')
                            errs.push(ctx(op) + ':weight_not_number');
                    });
                    break;
                case 'background':
                    if (typeof s.src !== 'string')
                        errs.push(ctx(sp) + ':background.missing_src');
                    break;
                case 'music':
                    if (typeof s.track !== 'string')
                        errs.push(ctx(sp) + ':music.missing_track');
                    break;
                case 'sfx':
                    if (typeof s.track !== 'string')
                        errs.push(ctx(sp) + ':sfx.missing_track');
                    break;
                case 'spriteShow':
                    if (typeof s.id !== 'string' || typeof s.src !== 'string')
                        errs.push(ctx(sp) + ':spriteShow.missing_id_or_src');
                    break;
                case 'spriteHide':
                    if (typeof s.id !== 'string')
                        errs.push(ctx(sp) + ':spriteHide.missing_id');
                    break;
                case 'flag':
                    if (typeof s.flag !== 'string')
                        errs.push(ctx(sp) + ':flag.missing_flag');
                    if (s.value !== undefined && typeof s.value !== 'boolean')
                        errs.push(ctx(sp) + ':flag.value_not_boolean');
                    break;
                case 'goto':
                    if (typeof s.scene !== 'string')
                        errs.push(ctx(sp) + ':goto.missing_scene');
                    break;
                case 'transition':
                    if (s.kind !== 'fade' && s.kind !== 'slide' && s.kind !== 'zoom' && s.kind !== 'shake' && s.kind !== 'flash')
                        errs.push(ctx(sp) + ':transition.invalid_kind');
                    if (s.duration !== undefined && typeof s.duration !== 'number')
                        errs.push(ctx(sp) + ':transition.duration_not_number');
                    break;
                default:
                    errs.push(ctx(sp) + `:unknown_type:${s.type}`);
            }
            steps.push(s);
        });
    }
    if (errs.length > 0)
        return { error: errs.join(';') };
    return { def: { id: raw.id, bg: raw.bg, music: raw.music, steps } };
}
export function loadSceneDefsFromArray(arr) {
    const scenes = [];
    const errors = [];
    for (const raw of arr) {
        const { def, error } = validateSceneDef(raw);
        if (def)
            scenes.push(def);
        else if (error)
            errors.push(error);
    }
    return { scenes, errors };
}
export function loadSceneDefsFromObject(record) {
    const scenes = [];
    const errors = [];
    for (const key of Object.keys(record)) {
        const { def, error } = validateSceneDef(record[key]);
        if (def)
            scenes.push(def);
        else if (error)
            errors.push(key + ':' + error);
    }
    return { scenes, errors };
}
export function indexScenes(scenes) {
    const map = new Map();
    for (const s of scenes) {
        map.set(s.id, s);
    }
    return map;
}
// Cross-scene validation: ensure that all goto targets and choice option gotos exist
export function validateSceneLinks(scenes) {
    const errors = [];
    const ids = new Set(scenes.map(s => s.id));
    for (const s of scenes) {
        s.steps.forEach((step, i) => {
            const ctx = `scene:${s.id}:step[${i}]`;
            if (step.type === 'goto') {
                if (!ids.has(step.scene))
                    errors.push(ctx + `:goto.unknown_scene:${step.scene}`);
            }
            if (step.type === 'choice') {
                step.options.forEach((o, oi) => {
                    if (o.goto && !ids.has(o.goto))
                        errors.push(`${ctx}.options[${oi}]:choice.goto.unknown_scene:${o.goto}`);
                });
            }
        });
    }
    return errors;
}
// Simple interpreter helper for one-off scene testing
export function simulateScene(s) {
    const log = [];
    for (const step of s.steps) {
        switch (step.type) {
            case 'dialogue':
                log.push(step.char ? step.char + ': ' + step.text : step.text);
                break;
            case 'choice':
                log.push('CHOICE:' + step.options.map(o => o.label).join('|'));
                break;
            case 'background':
                log.push('BG:' + step.src);
                break;
            case 'music':
                log.push('MUSIC:' + step.track);
                break;
            case 'spriteShow':
                log.push('SPRITE+' + step.id);
                break;
            case 'spriteHide':
                log.push('SPRITE-' + step.id);
                break;
            case 'flag':
                log.push('FLAG:' + step.flag + (step.value === false ? ':off' : ':on'));
                break;
            case 'goto':
                log.push('GOTO:' + step.scene);
                break;
            case 'transition':
                log.push('TRANSITION:' + step.kind);
                break;
        }
    }
    return log;
}
// Convenience: parse scenes from a JSON string (array or object form)
export function loadScenesFromJson(json) {
    const errors = [];
    try {
        const data = JSON.parse(json);
        if (Array.isArray(data))
            return loadSceneDefsFromArray(data);
        if (data && typeof data === 'object')
            return loadSceneDefsFromObject(data);
        return { scenes: [], errors: ['json_root_must_be_array_or_object'] };
    }
    catch (e) {
        errors.push('json_parse_error:' + (e?.message || 'unknown'));
        return { scenes: [], errors };
    }
}
// Convenience: fetch scenes JSON from a URL (browser/Node18+)
export async function loadScenesFromUrl(url) {
    const errors = [];
    try {
        const res = await fetch(url);
        if (!res.ok)
            return { scenes: [], errors: ['http_' + res.status] };
        const text = await res.text();
        return loadScenesFromJson(text);
    }
    catch (e) {
        errors.push('fetch_error:' + (e?.message || 'unknown'));
        return { scenes: [], errors };
    }
}
