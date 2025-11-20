# UI Kit (Prototype)

`packages/ui` provides a tiny, framework-agnostic renderer you can drop into a plain HTML page or any frontend stack.

## Vanilla renderer

```ts
import { createEngine } from 'aurora-engine'
import { createVanillaRenderer, styles } from '@aurora-engine/ui'
import { on } from 'aurora-engine/dist/utils/eventBus'

const engine = createEngine({ autoEmit: true })
engine.loadScenes([{ id:'intro', steps:[ { type:'dialogue', text:'Hello' } ] }])
engine.start('intro')

// inject default styles
const style = document.createElement('style')
style.textContent = styles
document.head.appendChild(style)

const mount = document.getElementById('app')!
const ui = createVanillaRenderer({ engine, mount })

on('vn:step', ({ step }) => ui.render(step))
```

Default class names: `.ae-line`, `.ae-name`, `.ae-text`, `.ae-choices`, `.ae-next`. Override via `classes` in `createVanillaRenderer({ classes: { /* ... */ }})` and supply your own CSS.

Status: prototype, API may change. Publish-ready once the package is wired into root build/exports.
