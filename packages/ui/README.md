# @aurora-engine/ui (prototype)

Lightweight, framework-agnostic rendering helpers for AuroraEngine.

## Vanilla renderer

```ts
import { createEngine } from 'aurora-engine'
import { createVanillaRenderer, styles } from '@aurora-engine/ui'

const engine = createEngine({ autoEmit: true })
engine.loadScenes([
  { id:'intro', steps:[ { type:'dialogue', char:'Guide', text:'Hello' } ] }
])
engine.start('intro')

const mount = document.getElementById('app')!
// Optional: inject default styles
const style = document.createElement('style')
style.textContent = styles
document.head.appendChild(style)

const ui = createVanillaRenderer({ engine, mount })

// Render on each engine step (wire to your own event bus or call manually)
import { on } from 'aurora-engine/dist/utils/eventBus'
on('vn:step', ({ step }) => ui.render(step))
```

The vanilla renderer is intentionally minimal: dialogue line, choices, and a Next button that calls `engine.next()`. Style it with your own classes; default markup uses `.ae-line`, `.ae-name`, `.ae-text`, `.ae-choices`, `.ae-next`.

## Status

Prototype; API may change. Not published to npm yet.*** End Patch
