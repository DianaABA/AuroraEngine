# Sprite Motion Timelines (Draft)

AuroraEngine supports simple per-step motion hints:
- `moveMs`: duration (ms)
- `moveEase`: easing name/string
- `moveTo`: `{ x?, y?, ms?, ease? }`

### New: timeline moves

You can chain multiple moves on a sprite step with `moves`:

```json
{
  "type": "spriteSwap",
  "id": "hero",
  "src": "hero_happy.png",
  "moves": [
    { "type": "move", "x": 40, "ms": 400, "ease": "easeOutBack" },
    { "type": "move", "y": -10, "ms": 300, "ease": "easeInOutSine" }
  ]
}
```

Validation:
- `moves` must be an array of objects.
- Fields allowed: `type` (optional, must be "move" if present), `x`, `y`, `ms`, `ease`.

Current template behavior:
- Moves beyond the first are not yet animated separately (template applies the last move target). Use for authoring clarity; future iterate to animate sequences.
