🛠️ Contributing to Aurora Engine

Thank you for your interest in contributing to Aurora Engine!
Aurora is built for creators — writers, educators, developers — and your contribution helps make storytelling more accessible for everyone.

This guide explains how to contribute, coding standards, workflow, and ways non-technical contributors can help.

If anything is unclear or you need support, please open a Discussion.
We’re friendly. 😊

🌟 Ways You Can Contribute

Aurora welcomes all kinds of contributions:

💻 Code Contributions

- Engine improvements
- Fixing bugs
- Improving error messages
- Adding new step types
- Performance optimizations
- AI Mode integrations (Local + BYOK)

🎨 Design & UX

- UI templates
- Character art packs
- Background packs
- Themes for visual novels
- Icons & logos
- UX improvements for editors

📚 Documentation

- Tutorials
- Examples
- Clarifications
- Guides for writers or teachers
- Explaining best practices
- Fixing typos or adding missing details

🎭 Story & Creator Contributions

- Sample visual novels
- Script examples (script mode)
- Scene templates
- AI prompt packs
- Gamified education examples
- Learning flows & branching structures

🧪 Testing

- Reporting bugs
- Testing on various browsers
- Mobile/React Native compatibility
- Stress testing editor or AI tools

🧱 Project Structure (Quick Overview)
```
/packages
  engine-core/        → Core engine logic
  ui/                 → UI components for projects
  ai/                 → AI Mode (Local + BYOK client)
  utils/              → Shared helpers

/templates
  minimal/            → Starter template (React)
  rn-template/        → React Native template (planned)

/docs                → Documentation & guides
```

🧭 Development Workflow

1. Fork the Repository

Click Fork and create your copy.

2. Clone Your Fork
```bash
git clone https://github.com/YOUR_USERNAME/AuroraEngine
cd AuroraEngine
```

3. Install Dependencies
```bash
npm install
```

4. Run the Engine Template
```bash
cd templates/minimal
npm run dev
```

5. Create a Feature Branch
```bash
git checkout -b feature/my-improvement
```

6. Make Your Changes

Follow the coding guidelines below.

7. Test Your Work

- Run the minimal template
- Test scenes
- Ensure no breaking changes
- Validate editor behavior (if relevant)

8. Commit with Clear Messages
```bash
git commit -m "feat(engine): add new step handler"
git commit -m "fix: scene validation error"
```

9. Push to Your Fork
```bash
git push origin feature/my-improvement
```

10. Open a Pull Request

Please include:

- What you changed
- Why you changed it
- Screenshots or code snippets (if UI/AI-related)
- Any breaking changes

We’ll review it as quickly as possible.

🧩 Coding Guidelines

**TypeScript Only**

Aurora uses TypeScript for core engine modules.

**Follow the Public API Contract**

Avoid exposing new top-level APIs without discussion.

**Document New Features**

Anything added should include:

- JSDoc comments
- A quick usage example
- Updated docs if needed

**Keep Engine Core Minimal**

If you add:

- custom effects
- editor UI
- extra utilities

Please put them in appropriate packages, not engine-core.

**Prefer Composition Over Special Cases**

Example:
✔ Add a generic “step handler registry”
✘ Hardcode a new step type inside core

🌐 AI Mode Contribution Guidelines

Aurora supports two modes:

- Local AI Mode (browser-based LLM)
- BYOK Mode (OpenAI/Anthropic/Groq)

If contributing to AI Mode:

✔ Keep abstraction unified

- Use the shared AIClient interface.

✔ No API keys in repo

- Users provide keys in their local project.

✔ Consider resource usage

Local models should be:

- lightweight
- quantized
- browser-friendly

✔ Provide test prompts

Any new prompt should include examples.

🖼 Asset Contribution Guidelines

If adding art (optional):

- Must be licensed CC0 / MIT / your own
- No copyrighted characters or logos
- Prefer PNG/WebP
- Optimize images under 2–3MB each

Please add assets to `/examples` or `/docs/static`.

🐞 Reporting Issues

Please include:

- Steps to reproduce
- Engine version
- Browser or device info
- Scene JSON or script snippet
- Expected vs actual behavior

Template:

**Describe the bug**
A clear and concise description...

**To Reproduce**
1. Run...
2. Load scene...
3. Click...

**Expected behavior**
I expected…

**Screenshots**
If applicable…

**Environment**
- Browser:
- OS:
- Engine version:

🔧 Feature Suggestions

We love ideas, especially:

- New step types
- Editor UX improvements
- AI-assisted writing tools
- Scene visualization tools
- Deployment helpers
- React Native expansions

Please open a feature request with:

**Problem**
What problem does this solve?

**Proposal**
How would this work?

**Examples**
Scene examples, screenshots, or flow diagrams.

**Advantages**
What creators get out of it?

💬 Setup Help & Discussions

If you're unsure where to start:

👉 Open a Discussion
👉 Ask for guidance
👉 Share your VN ideas
👉 Contribute story examples
👉 Show your work-in-progress

We welcome both technical & non-technical help.

🤝 Code of Conduct

- Be kind.
- Be respectful.
- Help others learn.

Aurora is for creators of all skill levels — beginners, writers, teachers, devs.
Keep the community inclusive and positive.

⭐ Final Notes

Thank you for helping shape Aurora Engine.
Every improvement — code, art, docs, story examples — helps someone build their first game, publish their first story, or create a new learning experience.

Let’s build something beautiful together. ✨
