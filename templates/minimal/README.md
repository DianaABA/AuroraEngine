# Aurora Minimal Template

A tiny Vite app that runs AuroraEngine in the browser and renders dialogue/choices.

## Local Run
```powershell
# From the repo root, build the engine first (generates dist/)
npm run build

# Then inside the template
cd templates/minimal
npm install
npm run dev
```
Then open http://localhost:5173

## How it works
- Loads `/scenes/example.json`
- Starts the engine at `intro`
- Listens for `vn:step` events and updates the DOM

## Deploy (Netlify)
Deploy with one click:

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/DianaABA/AuroraEngine&base=templates/minimal&build_command=npm%20run%20build&publish=templates/minimal/dist)

Manual:
1. Push your fork of this repo to GitHub
2. In Netlify, create a new site from Git and select your fork
3. Build command: `npm run build`
4. Publish directory: `templates/minimal/dist`

(Alternatively, open the template in a new repo and deploy that repo.)
