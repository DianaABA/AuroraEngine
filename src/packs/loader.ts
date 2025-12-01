import type { PackEntry, PackManifest, PackRegistry, PackId } from './manifest'
import { loadScenesFromUrlStrict } from '../vn/sceneLoader'

export function createPackRegistry(manifest: PackManifest): PackRegistry {
  const map = new Map<PackId, PackEntry>()
  for (const p of manifest.packs) map.set(p.id, p)
  return {
    list: () => manifest.packs.slice(),
    get: (id: PackId) => map.get(id),
  }
}

export async function loadPackScenesStrict(entry: PackEntry) {
  return loadScenesFromUrlStrict(entry.scenesUrl)
}

export async function loadPackByIdStrict(registry: PackRegistry, id: PackId) {
  const entry = registry.get(id)
  if (!entry) return { scenes: [], errors: [ { path:'pack', code:'unknown_pack', message:`Unknown pack id ${id}` } ] }
  return loadPackScenesStrict(entry)
}
