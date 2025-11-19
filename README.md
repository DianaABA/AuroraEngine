# AuroraEngine

Welcome to AuroraEngine – a modular Visual Novel (VN) engine monorepo!

## What is this?
AuroraEngine is a clean, open-source foundation for building your own visual novels. It is designed for learning, rapid prototyping, and real projects. This repo is structured for use in Udemy courses and for anyone who wants to create their own VN episodes.

## Structure
- `/packages/engine` – The core VN engine (add your engine code here)
- `/packages/episode-01` to `/packages/episode-06` – Empty episode packages (add your own scripts, assets, and logic)

## How to use
1. Clone this repo or download it.
2. Add your VN scripts and assets to one of the episode folders.
3. Implement your engine logic in `/packages/engine`.
4. Use a monorepo tool (like Yarn or npm workspaces) to manage dependencies.

## Getting Started
- This repo is intentionally empty. You can:
  - Add your own engine code to `/packages/engine`
  - Add new episodes/scripts to `/packages/episode-01` through `/packages/episode-06`
- See the `TODO.md` for a suggested contributor roadmap.

## Build & Exports
- Install dependencies at the repo root:

  ```powershell
  npm install
  ```

- Build all workspaces (engine + episodes):

  ```powershell
  npm run build
  ```

- Build a single workspace (example: episode-01):

  ```powershell
  npm run build --workspace @auroraengine/episode-01
  ```

### Package outputs
Each package builds to `dist/` and ships dual CJS/ESM + types:

- `exports` → `require: ./dist/index.cjs`, `import: ./dist/index.mjs`, `types: ./dist/index.d.ts`
- `main` points to CJS, `module` points to ESM, `types` points to DTS

If the engine package contains unfinished code, its build may fail. You can still build episodes individually as shown above.

## For Udemy Students
- Follow along with the course to implement your own VN features.
- Use the episode folders to organize your story content.
- Ask questions and share your progress!

## Contributing
- Fork the repo and submit pull requests.
- See `CONTRIBUTING.md` for guidelines (to be added).

---
Happy creating!
