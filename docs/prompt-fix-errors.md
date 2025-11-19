# "Fix My Error" Guide

When the loader returns errors like:
```
scene:intro:step[2].choice.missing_options;scene:intro:step[3].dialogue.missing_text
```
Use this checklist:

- scene_missing_id: Add an `id` string to the scene
- missing_steps: Ensure `steps` is an array
- dialogue.missing_text: Add `text` to a dialogue step
- choice.missing_options: Add `options: [{ label, goto }]`
- goto.missing_scene: Set `goto` to an existing scene id
- background.missing_src: Set `src` for background steps
- music.missing_track: Set `track` for music steps

Then re-run the loader. If errors persist, copy your scene JSON and the error output into an issue or ask an AI with the prompt in `docs/ai-prompts.md`.
