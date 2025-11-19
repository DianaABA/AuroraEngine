export function evaluateTruth(v) { if (v == null)
    return false; if (typeof v === 'boolean')
    return v; if (typeof v === 'number')
    return v !== 0; if (typeof v === 'string')
    return v.length > 0; if (Array.isArray(v))
    return v.length > 0; if (typeof v === 'object')
    return Object.keys(v).length > 0; return false; }
export function evaluateLogic(node, ctx = {}) { if (node == null)
    return null; if (typeof node !== 'object')
    return node; const op = node.op; const args = node.args || []; switch (op) {
    case 'var': return ctx[node.name];
    case 'and': return args.every((a) => evaluateTruth(evaluateLogic(a, ctx)));
    case 'or': return args.some((a) => evaluateTruth(evaluateLogic(a, ctx)));
    case 'eq': return evaluateLogic(args[0], ctx) === evaluateLogic(args[1], ctx);
    default: return null;
} }
