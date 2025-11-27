# Packaging & Export (v1.5+)

Goal: make it easy to ship AuroraEngine projects to the web and desktop.

## Web deploy (static)
- **Netlify/Vercel/GitHub Pages**: the minimal template builds to static assets.
  1. `npm run build` (root), then `cd templates/minimal && npm run build`.
  2. Publish `templates/minimal/dist` to your host (Netlify publish dir, Vercel output, or gh-pages branch).
  3. If hosting in a subpath, set `base` in `templates/minimal/vite.config.ts`.

## One-click buttons (Netlify)
- Use the Deploy Button in `templates/minimal/README.md`, or create your own with:
  - Repo URL
  - Base: `templates/minimal`
  - Build: `npm run build`
  - Publish: `templates/minimal/dist`

## Vercel
- New Project → import repo/fork.
- Framework preset: Vite.
- Build command: `npm run build`.
- Output directory: `templates/minimal/dist`.

## GitHub Pages
- `npm run build` (root) and `cd templates/minimal && npm run build`.
- Push `templates/minimal/dist` to `gh-pages` branch (or use `npm run deploy` with your preferred gh-pages script).
- Set Pages source to `gh-pages`.

## Desktop reference (Electron/Tauri)
- **Electron**: Wrap `templates/minimal/dist` in an Electron shell (serve `index.html` from `dist`). Suggested repo layout:
  - `/electron/main.js` loads `file://.../templates/minimal/dist/index.html`.
  - Add preload for IPC if you need file dialogs/saves outside browser storage.
- **Tauri**: Point the Tauri `distDir` to `templates/minimal/dist` and build the app; useful for small binaries.
- Keep engine data-driven: bundle scenes/assets in app resources; avoid hard-coded paths.
- **Reference snippets:**
  - Electron `main.js` minimal:
    ```js
    const { app, BrowserWindow } = require('electron')
    const path = require('path')
    const create = () => {
      const win = new BrowserWindow({ width: 1280, height: 720 })
      win.loadFile(path.join(__dirname, '../templates/minimal/dist/index.html'))
    }
    app.whenReady().then(create)
    ```
  - Tauri `tauri.conf.json` (excerpt):
    ```json
    {
      "build": { "distDir": "../templates/minimal/dist", "devPath": "http://localhost:5173" },
      "package": { "productName": "AuroraEngine" }
    }
    ```

## Dedicated starter repo (suggested layout)
- Create `aurora-engine-starter` with:
  - `templates/minimal` copied as `/app`.
  - Scripts: `npm run dev`, `npm run build`, `npm test` (proxy to engine if needed), `npm run lint:scenes`.
  - CI: run `npm ci && npm run build` and scene-lint on `public/scenes/*.json`.
  - Deploy buttons (Netlify/Vercel) preconfigured to use `/app/dist`.
- Expo stub: see `starters/expo/App.js` for a minimal RN/Expo integration (loads a dialogue and advances with Next).
- Electron stub: see `starters/electron/main.js` to wrap `templates/minimal/dist` in a desktop shell.

## Checklist before packaging
- `npm run release:check` (build/test/template-build/scene-lint/dist guard).
- Confirm `dist/state/modules/*` exists (CI guard).
- If using textId/RTL/theme, test both Night/Sand and en/es/ar quickly in the template.
