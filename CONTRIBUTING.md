# Contributing to AuroraEngine

Thanks for your interest in improving AuroraEngine! This guide is beginner-friendly and aims to help you contribute quickly and confidently.

## Getting Started
- Fork the repo and clone your fork
- Node.js LTS recommended (v18+)
- Install deps:
  ```bash
  npm ci
  ```
- Build (if needed):
  ```bash
  npm run build
  ```
- Run tests (if available):
  ```bash
  npm test
  ```

## Project Structure (high-level)
- `src/` — core engine (VN runtime, state, utils)
- `docs/` — documentation
- `tests/` — unit tests

## Workflow
1. Create a branch: `feat/your-idea` or `fix/issue-123`
2. Make focused changes with clear commits
3. Ensure `npm test` passes
4. Open a Pull Request (PR) with a concise description, screenshots or logs if relevant

## Commit Messages
Conventional style helps keep history readable:
- `feat: add transition fade` — new feature
- `fix: handle empty scene steps` — bug fix
- `docs: update README tutorial` — docs only
- `refactor: simplify expression parser` — refactor, no behavior change

## Issues
- Check existing issues before creating a new one
- Provide reproduction steps and expected behavior
- Use labels (see `ISSUE_LABELS.md`) to categorize

## Code Style
- Keep PRs small and focused
- Prefer readable code over cleverness
- Add or update docs/tests with behavior changes

## Local Development Tips
- Use the event bus to observe engine behavior (`vn:step`, `vn:transition`)
- Leverage `save.ts` helpers for quick save/load during testing

## Community
- Be kind and constructive
- Assume good intent
- We welcome first-time contributors

Thanks for making AuroraEngine better!
