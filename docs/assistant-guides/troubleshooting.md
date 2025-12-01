# Troubleshooting (Common Errors)

- scene_validation_failed: Check unknown `goto` or broken links; run `npm run scenes:lint`.
- Missing textId: Add `text` or `textId` to dialogue/choices per schema.
- EPERM unlink (Windows): prefer `npm install` in template before build.
- Packs manifest invalid: run `npm run validate:packs` and fix fields.
