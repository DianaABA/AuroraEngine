# 📘 Aurora Engine

**AI-powered visual novel & interactive storytelling engine for the modern web.**

Creator-friendly. Lightweight. No coding required. React & React Native ready.

Aurora is a lightweight, modular, open-source engine designed to help writers, educators, creators, and developers build interactive stories, visual novels, and gamified learning experiences — with or without coding.

Aurora focuses on being:

- Simple for beginners
- Powerful for developers
- AI-assisted for everyone

If you can write a story, you can build a game.

---

🌟 Features

✔ Modern Visual Novel Engine

- Scene-based storytelling
- Dialogue, choices, expressions
- Branching narratives
- Conditions, flags, metrics
- Save / load snapshots
- Gallery, CG unlocks, achievements (planned)

✔ AI-Powered Creator Tools (Phase 2)

Two modes:

🟩 Local AI Mode (free & offline)

Uses small browser-run models to:

- Convert simple script → JSON
- Fix grammar
- Detect missing fields in scenes
- No account required

🟦 BYOK Mode (Bring Your Own API Key)

Supports:

- OpenAI
- Anthropic
- Groq
- DeepSeek
- Any OpenAI-compatible LLM

Enables:

- Scene generation
- Dialogue enhancement
- Branch suggestions
- Character behavior modeling
- Story structure coaching

✔ Made for Creators

- Zero-tech workflow
- Script format support (natural writing)
- Automated scene linting
- Prompts & templates
- Works with Midjourney art & Suno music
- Easy deployment to web & mobile

✔ Made for Developers

- React + React Native integration
- Modular architecture
- Event-based engine core
- Stable public API
- Works with bundlers (Vite, Webpack, Expo)

---

## Quick Start (React Template)

```bash
git clone https://github.com/yourname/AuroraEngine
cd AuroraEngine/templates/minimal
npm install
npm run dev
```

Visit:

http://localhost:5173

Your first visual novel is live.

📱 React Native (Expo) Quick Start

```bash
npx create-expo-app my-vn
npm install aurora-engine
```

Add:

```javascript
import { createEngine } from "aurora-engine";
```

Run on device:

```bash
npx expo start
```

---

✨ Scene Format (JSON)

Aurora uses an intuitive, structured scene format:

```json
{
  "id": "intro",
  "steps": [
    { "type": "dialogue", "character": "Mia", "text": "It’s beautiful today." },
    { "type": "choice", "choices": [
      { "text": "Explore", "target": "explore" },
      { "text": "Stay cautious", "target": "caution" }
    ]}
  ]
}
```

✍️ Script Writing Mode (No JSON Needed)

Write like this:

```plaintext
#scene intro
BG forest_day
Mia: It’s beautiful today.
? What should we do?
- Explore → explore
- Stay cautious → caution
```

Aurora converts it automatically into valid scene JSON via:

```bash
npx aurora convert script.txt
```

With AI Mode, you can also use natural language:

```plaintext
“Mia and Ethan arrive at a forest. Mia is excited. Player must choose whether to explore the sound or stay careful.”
```

---

🤖 AI Mode (Phase 2)

🟩 Local AI (Free & Offline)

- Uses WebLLM / Transformers.js
- Runs in the browser
- Perfect for quick tasks & beginners

🟦 BYOK AI (High-Quality Generation)

Paste API key → generate:

- full scenes
- dialogue expansion
- branching paths
- character personality writing
- story logic checks

Safe. Keys never touch your servers.

---

🧩 Core API Overview

```javascript
import { createEngine } from "aurora-engine";

const engine = createEngine({
  scenes,
  onEvent: (event) => console.log(event),
});

engine.start("intro");
```

Also available:

- `engine.choose(index)`
- `engine.loadScenes()`
- `engine.saveSnapshotLS()`
- `engine.loadSnapshotLS()`
- Event system (`vn:step`, `vn:scene_end`, …)

---

## Roadmap

- **Phase 1 — Core Engine Stabilization ✔**
  - API surface finalized
  - Scene schema v1
  - Linting & validation
  - Snapshot system
  - React + RN integration
  - Template improvements

- **Phase 2 — AI-Powered Creator Platform (Current)**
  - Local AI integration
  - BYOK support
  - Script → JSON converter
  - Scene Builder AI
  - Dialogue Enhancer AI
  - Branch Generator AI
  - Story Coach AI
  - Visual Scene Map
  - Block-based editor

- **Phase 3 — Deployment & Publishing**
  - One-click web deploy
  - Expo iOS/Android export
  - Itch.io & desktop builds
  - Theming engine
  - Asset packs & presets

---

🎨 Midjourney + Suno Integration

Aurora works seamlessly with AI-generated assets:

- **Midjourney**:
  - Character art
  - Expressions
  - Backgrounds
  - UI themes
  - CG scenes

- **Suno**:
  - Background music
  - Character themes
  - Ambient loops
  - Sound effects

Guides & prompt packs included.

---

📚 Use Cases

🎒 Gamified Education

- Turn lessons into interactive learning apps.

✍️ Writer Tools

- Build branching stories, character arcs, and prototypes.

🎮 Visual Novels

- Create your own games — share or publish.

👨‍💻 Student Projects

- Learn React/React Native with story-based development.

🏢 Corporate Training

- Engaging simulations for onboarding & skill development.

---

🤝 Contributing

We welcome:

- feature PRs
- docs improvements
- bug fixes
- templates & examples
- AI prompt packs
- community assets

See `CONTRIBUTING.md`.

---

📜 License

MIT — open, free, and creator-friendly.

---

💬 Community & Support

- Discussions (GitHub)
- Issues & feature requests
- Examples & templates
- Discord (coming soon)

---

🪄 Final Words

Aurora is built for creators first — writers, teachers, devs, and dreamers.

You bring the story.
Aurora brings it to life.

---

🌐 Live Demo

- Novel demo built on AuroraEngine: https://chakrahearts.netlify.app/

