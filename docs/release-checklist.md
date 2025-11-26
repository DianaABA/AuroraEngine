# Release Checklist

Fast path for cutting a stable release without missing steps.

1) Prep
- `npm ci`
- `npm run build`
- `npm test`
- `npm run build:ui`
- `cd templates/minimal && npm ci && npm run build`
- `npm run scenes:lint -- --file templates/minimal/public/scenes/example.json`

2) Sanity
- Confirm `dist/state/modules/*` exists (CI guard will fail otherwise).
- Smoke-run `npm run template:minimal:dev` and load Example/Achievements/Expressions packs.
- Check `docs/scene-schema.json` is current if scene format changed.

3) Notes/Version
- Update `CHANGELOG.md` entry.
- Bump version in `package.json` (and lockfile if needed).

4) Publish/Tag
- `npm publish` (or dry-run first).
- `git tag vX.Y.Z && git push --tags`.
- If doing a canary, publish with `--tag next` and note in CHANGELOG.
