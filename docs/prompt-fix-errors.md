# "Fix My Error" Guide

When the strict loader returns errors, paths include segments you can map directly:
```
[
  { path: "scene:intro:step[2].options", code: "choice.missing_options", segments:["scene","intro","step",2,"options"] },
  { path: "scene:intro:step[3].text", code: "dialogue.missing_text", segments:["scene","intro","step",3,"text"] }
]
```

Quick fixes:
- scene_missing_id: Add an `id` string to the scene.
- missing_steps: Ensure `steps` is an array.
- dialogue.missing_text: Add `text` to a dialogue step.
- choice.missing_options: Add `options: [{ label, goto }]`.
- choice.goto.unknown_scene / goto.unknown_scene: point `goto` to an existing scene id.
- background.missing_src / music.missing_track / sfx.missing_track: add required `src`/`track`.
- sprite.*_not_number / not_string: fix the offending field types (x/y/yPct/scale/move*).

Then re-run the loader. If errors persist, paste the JSON and error objects into an AI using the “Fix My Error” prompt from `docs/ai-prompts.md` (include assets/ids you expect to exist).
