export const ok = (value) => ({ ok: true, value });
export const err = (code, message) => ({ ok: false, code, message });
const wrap = (k) => k.startsWith('aurora_') ? k : `aurora_${k}`;
export const AsyncStore = {
    async getItem(key) { try {
        return ok(localStorage.getItem(wrap(key)));
    }
    catch (e) {
        return err('unknown', e?.message);
    } },
    async setItem(key, value) { try {
        localStorage.setItem(wrap(key), value);
        return ok(undefined);
    }
    catch (e) {
        return err('unknown', e?.message);
    } },
    async getJSON(key) { const r = await this.getItem(key); if (!r.ok)
        return r; if (!r.value)
        return ok(null); try {
        return ok(JSON.parse(r.value));
    }
    catch {
        return err('transient', 'json');
    } },
    async setJSON(key, v) { try {
        return await this.setItem(key, JSON.stringify(v));
    }
    catch (e) {
        return err('unknown', e?.message);
    } }
};
