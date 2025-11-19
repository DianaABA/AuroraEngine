export class GameProgressionModule {
    constructor(_get, _set) {
        Object.defineProperty(this, "_get", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: _get
        });
        Object.defineProperty(this, "_set", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: _set
        });
        Object.defineProperty(this, "plugins", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        const snapshot = this._get();
        this._set(snapshot);
    }
    registerPlugin(plugin) {
        if (!this.plugins.find(p => p.id === plugin.id)) {
            this.plugins.push(plugin);
            try {
                plugin.onInit?.(this._get());
            }
            catch { }
        }
    }
    tick() {
        const state = this._get();
        for (const p of this.plugins) {
            try {
                p.onTick?.(state);
            }
            catch { }
        }
    }
    canNavigateToEpisode(id) {
        const state = this._get();
        for (const p of this.plugins) {
            try {
                const res = p.canNavigateToEpisode?.(id, state);
                if (res === false)
                    return false;
            }
            catch { }
        }
        return !!id;
    }
    getEpisodeTitle(id) {
        const state = this._get();
        for (const p of this.plugins) {
            try {
                const title = p.getEpisodeTitle?.(id, state);
                if (title)
                    return title;
            }
            catch { }
        }
        return id;
    }
    debugSnapshot() { return { episode: this._get().currentEpisode, pluginCount: this.plugins.length }; }
}
export default GameProgressionModule;
