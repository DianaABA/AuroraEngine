const SPRITE_POS = new Set(['left', 'center', 'right']);
const TRANSITIONS = new Set(['fade', 'slide', 'zoom', 'shake', 'flash']);
function toSegments(path) {
    const flat = path.replace(/:/g, '.');
    const parts = [];
    const re = /([^[\].]+)|\[(\d+)\]/g;
    let m;
    while ((m = re.exec(flat))) {
        if (m[1])
            parts.push(m[1]);
        else if (m[2])
            parts.push(Number(m[2]));
    }
    return parts;
}
function validateChoiceOption(raw, path, push) {
    if (!raw || typeof raw !== 'object') {
        push(path, 'choice.option.invalid_object', 'Choice option must be an object');
        return null;
    }
    const hasLabel = typeof raw.label === 'string';
    const hasTextId = typeof raw.textId === 'string';
    if (!hasLabel && !hasTextId)
        push(path, 'choice.option.missing_label', 'Choice option needs label or textId');
    if (raw.textId !== undefined && typeof raw.textId !== 'string')
        push(`${path}.textId`, 'choice.option.textId_not_string', 'Choice option textId must be a string');
    if (raw.goto !== undefined && typeof raw.goto !== 'string')
        push(`${path}.goto`, 'choice.option.goto_not_string', 'Choice option goto must be a string');
    if (raw.setFlag !== undefined && typeof raw.setFlag !== 'string')
        push(`${path}.setFlag`, 'choice.option.setFlag_not_string', 'Choice option setFlag must be a string');
    if (raw.condition !== undefined && typeof raw.condition !== 'string')
        push(`${path}.condition`, 'choice.option.condition_not_string', 'Choice option condition must be a string');
    if (raw.weight !== undefined && typeof raw.weight !== 'number')
        push(`${path}.weight`, 'choice.option.weight_not_number', 'Choice option weight must be a number');
    return raw;
}
function validateSpriteMotion(raw, path, push) {
    const placement = {};
    if (raw.pos !== undefined && !SPRITE_POS.has(raw.pos))
        push(`${path}.pos`, 'sprite.pos_invalid', 'Sprite pos must be left/center/right');
    if (raw.x !== undefined && typeof raw.x !== 'number')
        push(`${path}.x`, 'sprite.x_not_number', 'Sprite x must be a number (percentage)');
    if (raw.y !== undefined && typeof raw.y !== 'number')
        push(`${path}.y`, 'sprite.y_not_number', 'Sprite y must be a number (percentage offset)');
    if (raw.yPct !== undefined && typeof raw.yPct !== 'number')
        push(`${path}.yPct`, 'sprite.yPct_not_number', 'Sprite yPct must be a number (percentage offset)');
    if (raw.z !== undefined && typeof raw.z !== 'number')
        push(`${path}.z`, 'sprite.z_not_number', 'Sprite z must be a number');
    if (raw.scale !== undefined && typeof raw.scale !== 'number')
        push(`${path}.scale`, 'sprite.scale_not_number', 'Sprite scale must be a number');
    if (raw.moveMs !== undefined && typeof raw.moveMs !== 'number')
        push(`${path}.moveMs`, 'sprite.moveMs_not_number', 'moveMs must be a number');
    if (raw.moveEase !== undefined && typeof raw.moveEase !== 'string')
        push(`${path}.moveEase`, 'sprite.moveEase_not_string', 'moveEase must be a string');
    if (raw.moveTo !== undefined) {
        if (typeof raw.moveTo !== 'object') {
            push(`${path}.moveTo`, 'sprite.moveTo_not_object', 'moveTo must be an object');
        }
        else {
            if (raw.moveTo.x !== undefined && typeof raw.moveTo.x !== 'number')
                push(`${path}.moveTo.x`, 'sprite.moveTo.x_not_number', 'moveTo.x must be a number');
            if (raw.moveTo.y !== undefined && typeof raw.moveTo.y !== 'number')
                push(`${path}.moveTo.y`, 'sprite.moveTo.y_not_number', 'moveTo.y must be a number');
            if (raw.moveTo.yPct !== undefined && typeof raw.moveTo.yPct !== 'number')
                push(`${path}.moveTo.yPct`, 'sprite.moveTo.yPct_not_number', 'moveTo.yPct must be a number');
            if (raw.moveTo.ms !== undefined && typeof raw.moveTo.ms !== 'number')
                push(`${path}.moveTo.ms`, 'sprite.moveTo.ms_not_number', 'moveTo.ms must be a number');
            if (raw.moveTo.ease !== undefined && typeof raw.moveTo.ease !== 'string')
                push(`${path}.moveTo.ease`, 'sprite.moveTo.ease_not_string', 'moveTo.ease must be a string');
        }
    }
    if (raw.moves !== undefined && Array.isArray(raw.moves)) {
        raw.moves.forEach((mv, mi) => {
            const mp = `${path}.moves[${mi}]`;
            if (!mv || typeof mv !== 'object') {
                push(mp, 'sprite.moves.invalid_object', 'move must be an object');
                return;
            }
            if (mv.type && mv.type !== 'move')
                push(mp, 'sprite.moves.invalid_type', 'move type must be "move"');
            if (mv.x !== undefined && typeof mv.x !== 'number')
                push(`${mp}.x`, 'sprite.moves.x_not_number', 'move.x must be number');
            if (mv.y !== undefined && typeof mv.y !== 'number')
                push(`${mp}.y`, 'sprite.moves.y_not_number', 'move.y must be number');
            if (mv.yPct !== undefined && typeof mv.yPct !== 'number')
                push(`${mp}.yPct`, 'sprite.moves.yPct_not_number', 'move.yPct must be number');
            if (mv.ms !== undefined && typeof mv.ms !== 'number')
                push(`${mp}.ms`, 'sprite.moves.ms_not_number', 'move.ms must be number');
            if (mv.ease !== undefined && typeof mv.ease !== 'string')
                push(`${mp}.ease`, 'sprite.moves.ease_not_string', 'move.ease must be string');
        });
    }
    else if (raw.moves !== undefined && !Array.isArray(raw.moves)) {
        push(`${path}.moves`, 'sprite.moves_not_array', 'moves must be an array');
    }
    return raw;
}
export function validateSceneDefStrict(raw) {
    const issues = [];
    const pushIssue = (path, code, message) => issues.push({ path, code, message, segments: toSegments(path), sceneId: raw?.id ?? null });
    const ctx = (k) => `scene:${raw?.id ?? '?'}:${k}`;
    if (!raw || typeof raw !== 'object')
        return { errors: [{ path: 'scene', code: 'invalid_scene_object', message: 'Scene must be an object', segments: toSegments('scene'), sceneId: raw?.id ?? null }] };
    if (typeof raw.id !== 'string' || !raw.id.trim())
        pushIssue('scene:id', 'scene_missing_id', 'Scene id is required');
    if (!Array.isArray(raw.steps))
        pushIssue(ctx('steps'), 'missing_steps', 'Scene is missing steps[]');
    const steps = [];
    if (Array.isArray(raw.steps)) {
        raw.steps.forEach((s, i) => {
            const sp = `step[${i}]`;
            const stepPath = ctx(sp);
            if (!s || typeof s !== 'object') {
                pushIssue(stepPath, 'step.invalid_object', 'Step must be an object');
                return;
            }
            if (typeof s.type !== 'string') {
                pushIssue(stepPath, 'step.missing_type', 'Step is missing type');
                return;
            }
            switch (s.type) {
                case 'dialogue':
                    if (typeof s.text !== 'string' && typeof s.textId !== 'string')
                        pushIssue(`${stepPath}.text`, 'dialogue.missing_text', 'Dialogue needs text or textId');
                    if (s.char !== undefined && typeof s.char !== 'string')
                        pushIssue(`${stepPath}.char`, 'dialogue.char_not_string', 'Dialogue char must be string');
                    break;
                case 'choice':
                    if (!Array.isArray(s.options) || s.options.length === 0) {
                        pushIssue(`${stepPath}.options`, 'choice.missing_options', 'Choice needs options');
                        break;
                    }
                    s.options.forEach((o, oi) => validateChoiceOption(o, `${stepPath}.options[${oi}]`, (p, c, m) => pushIssue(p, c, m)));
                    if (s.autoStrategy !== undefined && s.autoStrategy !== 'firstValid' && s.autoStrategy !== 'random' && s.autoStrategy !== 'highestWeight')
                        pushIssue(`${stepPath}.autoStrategy`, 'choice.autoStrategy_invalid', 'autoStrategy must be firstValid|random|highestWeight');
                    if (s.autoSingle !== undefined && typeof s.autoSingle !== 'boolean')
                        pushIssue(`${stepPath}.autoSingle`, 'choice.autoSingle_not_boolean', 'autoSingle must be boolean');
                    break;
                case 'background':
                    if (typeof s.src !== 'string')
                        pushIssue(`${stepPath}.src`, 'background.missing_src', 'Background needs src');
                    break;
                case 'music':
                    if (typeof s.track !== 'string')
                        pushIssue(`${stepPath}.track`, 'music.missing_track', 'Music needs track');
                    break;
                case 'sfx':
                    if (typeof s.track !== 'string')
                        pushIssue(`${stepPath}.track`, 'sfx.missing_track', 'SFX needs track');
                    break;
                case 'spriteShow':
                case 'spriteSwap':
                    if (typeof s.id !== 'string' || typeof s.src !== 'string')
                        pushIssue(stepPath, 'spriteShow.missing_id_or_src', 'Sprite show/swap needs id and src');
                    if (s.role !== undefined && typeof s.role !== 'string')
                        pushIssue(`${stepPath}.role`, 'sprite.role_not_string', 'Sprite role must be string');
                    validateSpriteMotion(s, stepPath, (p, c, m) => pushIssue(p, c, m));
                    break;
                case 'spriteHide':
                    if (typeof s.id !== 'string')
                        pushIssue(`${stepPath}.id`, 'spriteHide.missing_id', 'Sprite hide needs id');
                    break;
                case 'flag':
                    if (typeof s.flag !== 'string')
                        pushIssue(`${stepPath}.flag`, 'flag.missing_flag', 'Flag step needs flag');
                    if (s.value !== undefined && typeof s.value !== 'boolean')
                        pushIssue(`${stepPath}.value`, 'flag.value_not_boolean', 'Flag value must be boolean');
                    break;
                case 'goto':
                    if (typeof s.scene !== 'string')
                        pushIssue(`${stepPath}.scene`, 'goto.missing_scene', 'Goto needs target scene id');
                    break;
                case 'transition':
                    if (!TRANSITIONS.has(s.kind))
                        pushIssue(`${stepPath}.kind`, 'transition.invalid_kind', 'Transition kind must be fade|slide|zoom|shake|flash');
                    if (s.duration !== undefined && typeof s.duration !== 'number')
                        pushIssue(`${stepPath}.duration`, 'transition.duration_not_number', 'Transition duration must be number');
                    break;
                default:
                    pushIssue(stepPath, 'unknown_type', `Unknown step type: ${s.type}`);
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
// Optional helper: map authoring "role" placeholders to concrete sprite ids using scene.roles
export function remapRoles(scenes) {
    return scenes.map((s) => {
        const roles = s.roles;
        if (!roles)
            return s;
        const copy = JSON.parse(JSON.stringify(s));
        copy.steps = (copy.steps || []).map((st) => {
            if (st && typeof st === 'object' && (st.type === 'spriteShow' || st.type === 'spriteSwap' || st.type === 'spriteHide')) {
                const role = st.role;
                if (role && roles[role]) {
                    st.id = roles[role];
                }
                delete st.role;
            }
            return st;
        });
        return copy;
    });
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
                const path = `${base}.scene`;
                issues.push({ path, code: 'goto.unknown_scene', message: `Unknown scene "${step.scene}"`, segments: toSegments(path), sceneId: s.id });
            }
            if (step.type === 'choice') {
                step.options.forEach((o, oi) => {
                    if (o.goto && !ids.has(o.goto)) {
                        const path = `${base}.options[${oi}].goto`;
                        issues.push({ path, code: 'choice.goto.unknown_scene', message: `Unknown scene "${o.goto}"`, segments: toSegments(path), sceneId: s.id });
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
