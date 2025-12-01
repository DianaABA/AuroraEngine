# Packs Manifest (packs.json)

- Define available packs with `id`, `name`, `description`, and `url`.
- The template loads `packs.json` and lets you switch packs at runtime.
- CI validates `packs.json` via `npm run validate:packs`.

Minimal example:
```json
[
  { "id": "example", "name": "Example", "url": "/scenes/example.json" }
]
```
