# ADR 0001: Scene Schema Versioning and Compatibility

Date: 2025-12-01

## Status
Accepted

## Context
Scene JSON is the core authoring artifact. As features expand (i18n, roles, motion), we must evolve the schema without breaking existing projects or confusing authors.

## Decision
- Maintain a canonical JSON Schema in `docs/scene-schema.json` with strict validation.
- Adopt semantic versioning for the schema aligned to the engine version line.
- Introduce compatibility aliases via loader normalization (e.g., `jump` → `goto`) only in minor versions.
- Emit structured validation issues with paths/codes for editor tooling.

## Consequences
- Authors get predictable upgrades and actionable errors.
- Tooling (linters, editors) can rely on a stable contract.
- We can onboard creators from other VN engines with minimal friction.

## Alternatives Considered
- Hard breaks with migration scripts: higher friction, deferred.
- No schema: faster short‑term, worse DX/QA long‑term.
