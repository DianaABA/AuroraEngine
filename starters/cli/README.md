# Aurora Starter CLI (stub)

Lightweight helper to copy `templates/minimal` into a new folder.

Usage:
```
node starters/cli/index.js my-game
# or to auto-install dependencies after copy
node starters/cli/index.js my-game --install
```

What it does:
- Copies the minimal template (excluding `node_modules`/`dist`) into `./my-game`.
- Optionally runs `npm install` if you pass `--install`.

Planned:
- Publish as `npx create-aurora` once the API stabilizes.
- Add flags for `--template expressions`, `--byok`, and `--rtl` to pre-seed packs.
- Prompt for project name and package metadata.
