# Lightweight Scene Editor

The browser template (`templates/minimal`) includes a small form-based scene editor for quick authoring/testing.

## What it supports
- Scene metadata: `id`, optional `bg`, optional `music`.
- Steps:
  - `dialogue` (char?, text)
  - `choice` (label|goto per line input)
  - `background`
  - `spriteShow`
  - `spriteSwap`
  - `music`
  - `flag` (boolean toggle via text: "false" disables)
  - `transition` (fade|slide|zoom|shake|flash)
- Live JSON preview updates as you add steps.

## Usage
1) Open the template in the browser (local dev or netlify preview).
2) Find the “Lightweight Scene Editor” panel.
3) Enter scene id/bg/music (optional).
4) Pick a step type, fill the inputs, and click “Add Step.”
5) Click “Build & Run” to strict-validate and start the engine from your authored scene.

Validation uses the same strict schema as the engine; errors show path/code/message. This is a helper for quick iteration—not a full authoring tool. Save the JSON output into your real `scenes/*.json` once happy.
