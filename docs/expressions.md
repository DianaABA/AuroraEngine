# Character Expressions

Map named expressions (neutral, happy, angry) to sprite image files and generate steps.

Usage:

```ts
import { stepShowExpression, stepSwapExpression, stepHideExpression } from 'aurora-engine'

const MAP = {
  hero: {
    neutral: 'hero_neutral.png',
    happy: 'hero_happy.png',
    angry: 'hero_angry.png',
  }
}

// Show character with expression
const show = stepShowExpression('hero', 'neutral', MAP)
// Later, swap to a new expression
const swap = stepSwapExpression('hero', 'happy', MAP)
// Hide character
const hide = stepHideExpression('hero')
```

Validation:
- Missing character id throws `expression:character_not_found:<id>`
- Missing expression variant throws `expression:variant_not_found:<id>:<expr>`

Tips:
- Keep expression keys consistent across characters.
- Use with the preloader: all sprite sources from `spriteShow`/`spriteSwap` are detected.
