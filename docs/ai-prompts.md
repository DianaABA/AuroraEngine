# AI Prompt Examples (Draft)

Use these prompts as starting points. Tweak for your project.

## Write Scene

You are a VN writer. Create a short branching scene in AuroraEngine JSON format.
Constraints:
- Keep it under 10 lines of dialogue
- Include 1 choice with 2 options
- Scene id: "intro"
- Background: "lab.png"
- Music: "calm.mp3"

Output only JSON (no commentary).

## Fix My Error

You are a helpful VN engine assistant. I have this error:
```
<paste validation errors here>
```
Here is my JSON scene:
```
<paste scene JSON here>
```
Explain what's wrong and return a corrected JSON version that fixes the errors.

## Expand Branch

Take this scene and add a second branch with a different mood and a flag `metGuide` when the player chooses the friendly option. Keep ids consistent.

Scene:
```
<paste scene JSON>
```
