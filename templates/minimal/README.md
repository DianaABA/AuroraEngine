# Aurora Minimal Template

A tiny Vite app that runs AuroraEngine in the browser and renders dialogue/choices.
Now includes:
- Start Example / Start Expressions buttons
- Gallery panel (unlocks on a scene flag)
- Achievements panel (unlocks "First CG" from Expressions)
- Backlog panel (shows persisted dialogue history)
 - Settings panel (Skip Seen Text + Clear Seen)
 - Slot thumbnails (auto-generated from background + sprites)
- Codex panel (unlocks entries via scene flags; persisted)
- Saves panel listing slots with thumbnails and timestamps
- Basic i18n (English/Spanish) for key UI labels
- Auto / Auto-Choose toggles, and Skip FX toggle
- Music controls (Play/Pause) with status
- Drag-and-drop asset helper (local preview for images/audio; copy object URLs)
- Codex pins/favorites with filters and badges
- In-browser “Load Custom Scenes” (paste JSON, strict-validated)
- Locale/theme: en/es/ar (RTL) with string table support for `textId`; Theme toggle (Night/Sand) via CSS vars.
- Lightweight Scene Editor: add/edit/reorder steps, strict validation/link checks, branch map with SVG nodes/edges (broken link badge), local save/load, JSON import/export, and a lint button for custom scenes.

## Example Packs
- Start buttons: Example (branching), Expressions (sprite expressions + CG unlock), Achievements (achievement + CG unlock path).
- Or pick a pack in the dropdown and press Load Pack.
- Extra packs: RTL/TextId demo (switch language to Arabic to see RTL) and BYOK demo (walks you through BYOK AI mode).
- Use these to see features without editing JSON.

## Scene Editor walkthrough
- Open the “Lightweight Scene Editor” panel.
- Enter `scene id`, optional `bg`/`music`, and add steps. Edit/reorder/delete inline.
- Build & Run validates strictly (schema + links) and starts from your scene.
- Save/Load buttons persist the editor state to localStorage.
- Branch map shows scene nodes and goto/choice edges (red badge for broken links) plus a mini SVG graph.
- Hover over nodes/edges in the SVG for tooltips; broken links are summarized above the list.
- Custom JSON area has a Lint button (strict + link checks) and uses the error overlay on failures.

## One-click Starts
- **StackBlitz:** `https://stackblitz.com/github/DianaABA/AuroraEngine?file=templates/minimal/src/main.ts&terminal=dev`
- **Netlify Deploy:** From your fork, set publish directory to `templates/minimal/dist` (after `npm run build`).
- **Deploy Button:** [![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/DianaABA/AuroraEngine&base=templates/minimal&build_command=npm%20run%20build&publish=templates/minimal/dist)

## Local Run
```powershell
# From the repo root, build the engine first (generates dist/)
npm run build

# Then inside the template
cd templates/minimal
npm install
# Either dev or start (both run Vite)
npm run dev
# or
npm start
```
Then open http://localhost:5173

## How it works
- Loads `/scenes/example.json` by default (button switches to `/scenes/expressions.json`)
- Starts the engine at `intro`
- Listens for `vn:step` events and updates the DOM
- Unlocks a demo CG when the expressions scene sets `flag: "cg_intro"` (see `public/scenes/expressions.json`)
- Gallery panel shows unlocked CGs (`public/cgs/*`)
- Achievements panel lists unlocked achievements
- Backlog panel collects each dialogue line after render and persists it in
	`localStorage` (`aurora:minimal:backlog`) with a cap of ~200 entries
 - Settings: stores prefs in `localStorage` (`aurora:minimal:prefs`)
 - Skip Seen Text: fast-forwards dialogue lines previously seen (tracked in
	 `localStorage` as `aurora:minimal:seen`)
 - Save slots include thumbnails stored as data URLs in `localStorage`
	 (`aurora:minimal:slot{n}:thumb`), rendered next to the slot buttons
 - Saves panel shows 3 slots with thumbnail, timestamp, and Save/Load actions
 - i18n: switch language in Settings (English/Spanish) affecting key controls
- Sprite positioning: per-step `pos` (left/center/right) or custom `x` `%` and `scale`; optional `z` ordering
- Scene defaults: per-scene `spriteDefaults` provide default `pos/x/scale/z` for sprite IDs
- Auto/Auto-Choose control engine flow at runtime; Skip FX hides transition visuals (faster testing)
- Music strip uses `Jukebox` and engine `music:*` events for status

## Starter CLI (experimental)
- Copy the minimal template into a new folder: `node starters/cli/index.js my-game`
- Add `--install` to run `npm install` automatically.
- Planned: npx package + flags for BYOK/RTL packs.

## Deploy (Netlify)
Deploy with one click:

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/DianaABA/AuroraEngine&base=templates/minimal&build_command=npm%20run%20build&publish=templates/minimal/dist)

Manual:
1. Push your fork of this repo to GitHub
2. In Netlify, create a new site from Git and select your fork
3. Build command: `npm run build`
4. Publish directory: `templates/minimal/dist`

(Alternatively, open the template in a new repo and deploy that repo.)
