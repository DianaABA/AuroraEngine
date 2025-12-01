# Scene Format – Quick Reference

- Use `id`, optional `bg` and `music`, and `steps` list.
- Dialogue step: `{ "type": "dialogue", "char": "Ava", "text": "Hi" }`
- Choice step: `{ "type": "choice", "options": [{ "label": "Go", "goto": "next" }] }`
- Goto step: `{ "type": "goto", "scene": "next" }`
- Use `textId` for localization-ready lines. See docs/scene-format.md.
