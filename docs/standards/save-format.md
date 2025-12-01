# Save/Load Format

Aurora snapshots are compact JSON structures designed for durability and forward compatibility.

## Snapshot Shape (current)
- `sceneId`: current scene id
- `index`: step index within the scene
- `flags`: set of unlocked flags
- `vars`: arbitrary variables map
- `sprites`: visible sprite id → src map
- `bg` (optional): current background src
- `music` (optional): current track id
- `saveVersion` (optional): integer matching `SAVE_SCHEMA_VERSION`
- `engineVersion` (optional): engine version string when available

See `src/vn/sceneTypes.ts` `SnapshotData` for the type.

## Versioning
- Code exposes `SAVE_SCHEMA_VERSION` (currently 1). Increment on breaking changes to snapshot shape.
- Snapshots may include `saveVersion` to enable migrations when loading older saves.
- Engine version is optional; surface it when available to aid support.

## Persistence Helpers
- `encodeSnapshot` / `decodeSnapshot` for JSON round‑trip
- `saveSnapshotLS` / `loadSnapshotLS` for localStorage demos
- `withSaveMetadata(snapshot)` helper adds `saveVersion` from engine constants

## Migration Policy
- Minor/patch: add fields only; treat missing fields with safe defaults.
- Major: when shape changes, bump `SAVE_SCHEMA_VERSION` and supply a migration path.

This approach matches professional VN engines: stable saves by default, with explicit versioning for longevity.
