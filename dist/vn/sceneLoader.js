const SPRITE_POS = new Set(['left', 'center', 'right']);
const TRANSITIONS = new Set(['fade', 'slide', 'zoom', 'shake', 'flash']);
function validateChoiceOption(raw, path, push) {
    if (!raw || typeof raw !== 'object') {
        push({ path, code: 'choice.option.invalid_object', message: 'Choice option must be an object' });
        return null;
    }
    if (typeof raw.label !== 'string')
        push({ path, code: 'choice.option.missing_label', message: 'Choice option needs a label' });
    if (raw.goto !== undefined && typeof raw.goto !== 'string')
        push({ path, code: 'choice.option.goto_not_string', message: 'Choice option goto must be a string' });
    if (raw.setFlag !== undefined && typeof raw.setFlag !== 'string')
        push({ path, code: 'choice.option.setFlag_not_string', message: 'Choice option setFlag must be a string' });
    if (raw.condition !== undefined && typeof raw.condition !== 'string')
        push({ path, code: 'choice.option.condition_not_string', message: 'Choice option condition must be a string' });
    if (raw.weight !== undefined && typeof raw.weight !== 'number')
        push({ path, code: 'choice.option.weight_not_number', message: 'Choice option weight must be a number' });
    return raw;
}
function validateSpriteMotion(raw, path, push) {
    const placement = {};
    if (raw.pos !== undefined && !SPRITE_POS.has(raw.pos))
        push({ path: `${path}.pos`, code: 'sprite.pos_invalid', message: 'Sprite pos must be left/center/right' });
    if (raw.x !== undefined && typeof raw.x !== 'number')
        push({ path: `${path}.x`, code: 'sprite.x_not_number', message: 'Sprite x must be a number (percentage)' });
    if (raw.y !== undefined && typeof raw.y !== 'number')
        push({ path: `${path}.y`, code: 'sprite.y_not_number', message: 'Sprite y must be a number (percentage offset)' });
    if (raw.z !== undefined && typeof raw.z !== 'number')
        push({ path: `${path}.z`, code: 'sprite.z_not_number', message: 'Sprite z must be a number' });
    if (raw.scale !== undefined && typeof raw.scale !== 'number')
        push({ path: `${path}.scale`, code: 'sprite.scale_not_number', message: 'Sprite scale must be a number' });
    if (raw.moveMs !== undefined && typeof raw.moveMs !== 'number')
        push({ path: `${path}.moveMs`, code: 'sprite.moveMs_not_number', message: 'moveMs must be a number' });
    if (raw.moveEase !== undefined && typeof raw.moveEase !== 'string')
        push({ path: `${path}.moveEase`, code: 'sprite.moveEase_not_string', message: 'moveEase must be a string' });
    if (raw.moveTo !== undefined) {
        if (typeof raw.moveTo !== 'object') {
            push({ path: `${path}.moveTo`, code: 'sprite.moveTo_not_object', message: 'moveTo must be an object' });
        }
        else {
            if (raw.moveTo.x !== undefined && typeof raw.moveTo.x !== 'number')
                push({ path: `${path}.moveTo.x`, code: 'sprite.moveTo.x_not_number', message: 'moveTo.x must be a number' });
            if (raw.moveTo.y !== undefined && typeof raw.moveTo.y !== 'number')
                push({ path: `${path}.moveTo.y`, code: 'sprite.moveTo.y_not_number', message: 'moveTo.y must be a number' });
            if (raw.moveTo.ms !== undefined && typeof raw.moveTo.ms !== 'number')
                push({ path: `${path}.moveTo.ms`, code: 'sprite.moveTo.ms_not_number', message: 'moveTo.ms must be a number' });
            if (raw.moveTo.ease !== undefined && typeof raw.moveTo.ease !== 'string')
                push({ path: `${path}.moveTo.ease`, code: 'sprite.moveTo.ease_not_string', message: 'moveTo.ease must be a string' });
        }
    }
    return raw;
}
export function validateSceneDefStrict(raw) {
    const issues = [];
    const ctx = (k) => `scene:${raw?.id ?? '?'}:${k}`;
    if (!raw || typeof raw !== 'object')
        return { errors: [{ path: 'scene', code: 'invalid_scene_object', message: 'Scene must be an object' }] };
    if (typeof raw.id !== 'string' || !raw.id.trim())
        issues.push({ path: 'scene:id', code: 'scene_missing_id', message: 'Scene id is required' });
    if (!Array.isArray(raw.steps))
        issues.push({ path: ctx('steps'), code: 'missing_steps', message: 'Scene is missing steps[]' });
    const steps = [];
    if (Array.isArray(raw.steps)) {
        raw.steps.forEach((s, i) => {
            const sp = `step[${i}]`;
            const stepPath = ctx(sp);
            if (!s || typeof s !== 'object') {
                issues.push({ path: stepPath, code: 'step.invalid_object', message: 'Step must be an object' });
                return;
            }
            if (typeof s.type !== 'string') {
                issues.push({ path: stepPath, code: 'step.missing_type', message: 'Step is missing type' });
                return;
            }
            switch (s.type) {
                case 'dialogue':
                    if (typeof s.text !== 'string')
                        issues.push({ path: `${stepPath}.text`, code: 'dialogue.missing_text', message: 'Dialogue needs text' });
                    if (s.char !== undefined && typeof s.char !== 'string')
                        issues.push({ path: `${stepPath}.char`, code: 'dialogue.char_not_string', message: 'Dialogue char must be string' });
                    break;
                case 'choice':
                    if (!Array.isArray(s.options) || s.options.length === 0) {
                        issues.push({ path: `${stepPath}.options`, code: 'choice.missing_options', message: 'Choice needs options' });
                        break;
                    }
                    s.options.forEach((o, oi) => validateChoiceOption(o, `${stepPath}.options[${oi}]`, (iss) => issues.push(iss)));
                    if (s.autoStrategy !== undefined && s.autoStrategy !== 'firstValid' && s.autoStrategy !== 'random' && s.autoStrategy !== 'highestWeight')
                        issues.push({ path: `${stepPath}.autoStrategy`, code: 'choice.autoStrategy_invalid', message: 'autoStrategy must be firstValid|random|highestWeight' });
                    if (s.autoSingle !== undefined && typeof s.autoSingle !== 'boolean')
                        issues.push({ path: `${stepPath}.autoSingle`, code: 'choice.autoSingle_not_boolean', message: 'autoSingle must be boolean' });
                    break;
                case 'background':
                    if (typeof s.src !== 'string')
                        issues.push({ path: `${stepPath}.src`, code: 'background.missing_src', message: 'Background needs src' });
                    break;
                case 'music':
                    if (typeof s.track !== 'string')
                        issues.push({ path: `${stepPath}.track`, code: 'music.missing_track', message: 'Music needs track' });
                    break;
                case 'sfx':
                    if (typeof s.track !== 'string')
                        issues.push({ path: `${stepPath}.track`, code: 'sfx.missing_track', message: 'SFX needs track' });
                    break;
                case 'spriteShow':
                case 'spriteSwap':
                    if (typeof s.id !== 'string' || typeof s.src !== 'string')
                        issues.push({ path: stepPath, code: 'spriteShow.missing_id_or_src', message: 'Sprite show/swap needs id and src' });
                    validateSpriteMotion(s, stepPath, (iss) => issues.push(iss));
                    break;
                case 'spriteHide':
                    if (typeof s.id !== 'string')
                        issues.push({ path: `${stepPath}.id`, code: 'spriteHide.missing_id', message: 'Sprite hide needs id' });
                    break;
                case 'flag':
                    if (typeof s.flag !== 'string')
                        issues.push({ path: `${stepPath}.flag`, code: 'flag.missing_flag', message: 'Flag step needs flag' });
                    if (s.value !== undefined && typeof s.value !== 'boolean')
                        issues.push({ path: `${stepPath}.value`, code: 'flag.value_not_boolean', message: 'Flag value must be boolean' });
                    break;
                case 'goto':
                    if (typeof s.scene !== 'string')
                        issues.push({ path: `${stepPath}.scene`, code: 'goto.missing_scene', message: 'Goto needs target scene id' });
                    break;
                case 'transition':
                    if (!TRANSITIONS.has(s.kind))
                        issues.push({ path: `${stepPath}.kind`, code: 'transition.invalid_kind', message: 'Transition kind must be fade|slide|zoom|shake|flash' });
                    if (s.duration !== undefined && typeof s.duration !== 'number')
                        issues.push({ path: `${stepPath}.duration`, code: 'transition.duration_not_number', message: 'Transition duration must be number' });
                    break;
                default:
                    issues.push({ path: stepPath, code: 'unknown_type', message: `Unknown step type: ${s.type}` });
            }
            steps.push(s);
        });
    }
    return issues.length > 0 ? { errors: issues } : { def: { id: raw.id, bg: raw.bg, music: raw.music, steps }, errors: [] };
}
// Legacy lightweight validator for backward compatibility
export function validateSceneDef(raw) {
    const { def, errors } = validateSceneDefStrict(raw);
    if (def)
        return { def };
    return { error: errors.map(e => e.code || e.message).join(';') };
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
export function validateScenesStrictCollection(raw) {
    const { scenes, errors } = loadSceneDefsStrict(raw);
    const linkIssues = validateSceneLinksStrict(scenes);
    return { scenes, errors: [...errors, ...linkIssues] };
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
export function loadSceneDefsStrict(arr) {
    const scenes = [];
    const errors = [];
    for (const raw of arr) {
        const { def, errors: errs } = validateSceneDefStrict(raw);
        if (def)
            scenes.push(def);
        if (errs.length)
            errors.push(...errs);
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
export function validateSceneLinksStrict(scenes) {
    const issues = [];
    const ids = new Set(scenes.map(s => s.id));
    for (const s of scenes) {
        s.steps.forEach((step, i) => {
            const base = `scene:${s.id}:step[${i}]`;
            if (step.type === 'goto' && step.scene && !ids.has(step.scene)) {
                issues.push({ path: `${base}.scene`, code: 'goto.unknown_scene', message: `Unknown scene "${step.scene}"` });
            }
            if (step.type === 'choice') {
                step.options.forEach((o, oi) => {
                    if (o.goto && !ids.has(o.goto)) {
                        issues.push({ path: `${base}.options[${oi}].goto`, code: 'choice.goto.unknown_scene', message: `Unknown scene "${o.goto}"` });
                    }
                });
            }
        });
    }
    return issues;
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
export function loadScenesFromJsonStrict(json) {
    const errors = [];
    try {
        const data = JSON.parse(json);
        if (Array.isArray(data))
            return validateScenesStrictCollection(data);
        if (data && typeof data === 'object')
            return validateScenesStrictCollection(Object.values(data));
        return { scenes: [], errors: [{ path: 'root', code: 'json_root_must_be_array_or_object', message: 'Root must be array or object of scenes' }] };
    }
    catch (e) {
        errors.push({ path: 'root', code: 'json_parse_error', message: e?.message || 'unknown' });
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
export async function loadScenesFromUrlStrict(url) {
    const errors = [];
    try {
        const res = await fetch(url);
        if (!res.ok)
            return { scenes: [], errors: [{ path: 'fetch', code: `http_${res.status}`, message: `HTTP ${res.status}` }] };
        const text = await res.text();
        return loadScenesFromJsonStrict(text);
    }
    catch (e) {
        errors.push({ path: 'fetch', code: 'fetch_error', message: e?.message || 'unknown' });
        return { scenes: [], errors };
    }
}
