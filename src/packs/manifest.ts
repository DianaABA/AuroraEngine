export type PackId = string

export interface PackEntry {
  id: PackId
  name: string
  description?: string
  // URL to a scenes JSON file (array or object of scenes)
  scenesUrl: string
  // Optional assets root to help UIs show previews or preloads
  assetsBaseUrl?: string
  // Arbitrary metadata for UIs
  meta?: Record<string, any>
}

export interface PackManifest {
  packs: PackEntry[]
}

export interface PackRegistry {
  list(): PackEntry[]
  get(id: PackId): PackEntry | undefined
}
