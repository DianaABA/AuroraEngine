# Persistence & Saves

Aurora keeps your story progress safe through quick saves, slot-based saves, and autosaves. The minimal template already exposes the UI (quick save/load buttons, continue/autosave, the three-slot panel with thumbnails, rename/delete controls, and shortcut keys) and is backed by the helpers listed below.

## Quick Save / Quick Load / Continue

- Quick Save (`saveBtn`) snapshots the current engine state and stores it under `aurora:minimal:quicksave`. Save metadata (`sceneId#index` plus the last character label) is written to `aurora:minimal:quicksave:meta` so the UI can show where you were.
- Quick Load (`loadBtn`) restores that snapshot and reports the formatted metadata back to the user.
- Continue (`continueBtn`) reads the autosave stored at `aurora:minimal:autosave` / `:meta` and is triggered on every step render plus tab hide/unload. The template writes `localStorage` timestamps (`aurora:minimal:autosave:ts`) so the UI can advertise when the autosave occurred.

## Slot Saves & Metadata

- Slots 1‑3 surface each save’s thumbnail (`:thumb`), timestamp (`:ts`), user label (`:label`), and formatted metadata (`:meta`) via `renderSaves()` + `readSlotInfo()`. `captureThumbnail()` generates a tiny canvas preview from the current background/sprites and persists it to `:thumb` for a visual cue.
- `saveToSlot(n)` adds optional overwrite confirmation and stores:
  - Snapshot under `aurora:minimal:slot<n>`
  - Timestamp `:ts`
  - Metadata `:meta`
  - Thumbnail `:thumb`
  - Optional friendly label `:label`
- The slot menu also exposes rename/delete controls, so creators can keep their saves organised without leaving the browser.

## Autosave & Manual Restore

- Autosaves happen frequently (`writeAutosave()`) and are tied to the Continue button. They also update `aurora:minimal:autosave:ts` and `:meta` so you can show context about what step the autosave captured.
- Manual restores are just `engine.restore(snapshot)`; the snapshot stores `sceneId`, `index`, `flags`, `vars`, `sprites`, `bg`, and `music` (see `SnapshotData` in `src/vn/sceneTypes.ts`).
- For integration inside your own UI, use the helpers from `aurora-engine/vn/save`:

```ts
import { createEngine } from 'aurora-engine'
import { saveSnapshotLS, loadSnapshotLS } from 'aurora-engine/vn/save'

const engine = createEngine({ scenes })
const key = 'myapp:v1:slot1'
saveSnapshotLS(key, engine.snapshot())

const snapshot = loadSnapshotLS(key)
if (snapshot) {
  engine.restore(snapshot)
}
```

- `saveSnapshotLS`/`loadSnapshotLS` wrap `localStorage` safely; they work with the template’s `engine.saveSnapshotLS()`/`engine.loadSnapshotLS()` calls as well.

## Gallery & Achievements

- Gallery unlocks (`gallery.unlock`) and achievements (`achievements.unlock`) are triggered by scene flags (e.g., the `"cg_intro"` flag seen in the minimal template) and are persisted separately in `localStorage`. When you load a snapshot, the recorded `flags` keep the `Gallery`/`Achievements` state aligned with your save.
- Because snapshots contain flags and the template’s unlock code runs when those flags first appear, loading from any slot preserves the CG/achievement badges you earned earlier.
- Scripts created via the converter can trigger the same flags/achievements, so the persistence UI automatically shows the right metadata + gallery entries regardless of whether you wrote your scene manually or generated it via `npx aurora convert`.

## Script Converter & Saves

- The `aurora convert` CLI (`npx aurora convert script.txt --output scenes/intro.json`) produces scenes with structured `sceneId`s, `steps`, and `choice` metadata. Load the resulting JSON into the template (`templates/minimal/public/scenes/*` or via your own loader), and the save UI (including thumbnails and metadata) works without any extra wiring.
- Scenes that unlock gallery entries or achievements via flags also work because snapshots carry those flags forward. When you switch between script-generated content and saves/snaps, the display remains coherent.

## Troubleshooting & Manual Data Recovery

- Need to restore a save from another computer? Copy the `localStorage` keys (`aurora:minimal:slotX`, `:thumb`, `:meta`, plus the gallery/ach storage keys) and paste them into the target environment before loading a slot.
- If you ever need to reason about a snapshot, you can inspect `engine.snapshot()` programmatically, tweak the JSON (schema is in `docs/scene-schema.json`), then call `engine.restore()` or `engine.loadSnapshotLS()` to force a manual recovery.

For canonical save/load guidance, see `docs/assistant-guides/noncoder-quickstart.md` (which links back here) and the `docs/standards/save-format.md` reference on schema versioning.
