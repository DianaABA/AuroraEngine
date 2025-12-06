# Workstreams → GitHub Issues

Use these suggested issue titles and checklists to create tracked issues in GitHub (recommended via GitHub CLI).

## How to create via CLI

```powershell
# Authenticate once
gh auth login

# Create issues (examples)
gh issue create --title "Assistant GA: BYOK proxy + Local model UX" --body-file docs/workstreams-issues.md --label enhancement
```

## Issue Seeds

### Assistant GA: BYOK proxy + Local model UX
- [ ] BYOK proxy: retry/backoff, rate-limit banners, model allowlist
- [ ] Local model: download progress, size warnings, cache controls
- [ ] Editor: "Ask Aurora" pane, JSON auto-validate, auto-apply toggles
- [ ] Safety caps: token limits, schema-guided generation modes, header redaction
- [ ] Docs: provider options, troubleshooting, caching behavior

### Observability v1: Event Inspector + Metrics
- [ ] Event inspector overlay: subscribe to `eventBus`, filter, pause/play
- [ ] Metrics counters: choices, scenes, autos, time-in-scene
- [ ] Export: quick-export JSON/CSV

### Starters Publish: Expo/Electron + CLI
- [ ] Publish Expo starter repo (+ CI + deploy buttons)
- [ ] Publish Electron starter repo (+ CI + deploy buttons)
- [ ] CLI `aurora create`: scaffold from template (name/id)

### Release Hygiene: publishConfig + `release:check`
- [ ] Add `publishConfig.registry` to `package.json`
- [ ] CI gate: run `npm run release:check`
- [ ] NPM token readiness: `NPM_TOKEN` present, `npm publish --dry-run`

### Docs & Media
- [ ] Assistant guide, BYOK/local setup
- [ ] Demo video/GIF (Start → Save → Gallery)
- [ ] Troubleshooting: local cache, provider errors
