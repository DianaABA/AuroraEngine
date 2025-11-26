# AI Prompt Examples

Use these as starting points. Always paste your current JSON, mention assets you have, and keep IDs stable.

## Write Scene

You are a VN writer. Produce AuroraEngine JSON scenes. Constraints:
- Under 12 dialogue lines total
- 1 choice with 2 options
- Scene id: "intro"
- Background: "lab.png", Music: "calm.mp3"
- Use `spriteShow/spriteSwap` for character expressions (ids: hero, guide)

Output JSON only (no commentary). Validate it would pass strict loader.

## Fix My Error

You are a helpful VN engine assistant. I have this error:
```
<paste validation errors here>
```
Here is my JSON scene:
```
<paste scene JSON here>
```
Explain what is wrong, referencing the error codes/paths. Return a corrected JSON version that fixes the errors. Keep scene ids and gotos intact. Use defaults if unsure (e.g., background/missing text) and call out assumptions.

## Expand Branch

Take this scene and add a second branch with a different mood and a flag `metGuide` when the player chooses the friendly option. Keep ids consistent.

Scene:
```
<paste scene JSON>
```

## Codex Entry Batch

You are documenting the VN world. Create 3 codex entries (Characters, Locations, Items). Output as an array of objects: `{ id, title, body, category }`. Keep bodies under 80 words. Categories must be one of: Characters, Locations, Items. IDs must be lowercase with underscores.
