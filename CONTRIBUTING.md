
# Contributing to AuroraEngine

Thank you for your interest in making AuroraEngine better! We welcome everyone—beginners, writers, artists, testers, and coders. You don’t need to be a developer to help out.

---

## 🚩 Your First Issue

Want to get started? Look for issues labeled **"good first issue"** or **"help wanted"** in the Issues tab. These are perfect for beginners and non-coders!

You can also:
- Suggest a new feature or improvement
- Report a bug or typo
- Help test new features
- Improve documentation or tutorials
- Share feedback on usability

---

## 🐞 How to Submit a Bug

1. Go to the Issues tab and click **New Issue**
2. Choose **Bug report**
3. Fill in:
  - What you expected to happen
  - What actually happened
  - Steps to reproduce (if possible)
  - Screenshots or error messages (if any)
4. Add the **type:bug** label if you can, or mention "bug" in your title/description

---

## 💡 How to Suggest a Feature

1. Go to the Issues tab and click **New Issue**
2. Choose **Feature request**
3. Describe your idea and why it would help
4. Add the **type:feat** label if you can

---

## 🏷️ Issue Labels

We use labels like **good first issue**, **help wanted**, **type:bug**, and **type:feat** to organize issues. See `ISSUE_LABELS.md` for the full list and what they mean.

If you’re not sure which label to use, don’t worry—a maintainer will help!

---

## 🛠️ Getting Started (for Coders)

1. Fork the repo and clone your fork
2. Node.js LTS recommended (v18+)
3. Install dependencies:
  ```bash
  npm ci
  ```
4. Build (if needed):
  ```bash
  npm run build
  ```
5. Run tests (if available):
  ```bash
  npm test
  ```

---

## 🗂️ Project Structure (high-level)
- `src/` — core engine (VN runtime, state, utils)
- `docs/` — documentation
- `tests/` — unit tests

---

## 📝 Workflow (for Pull Requests)
1. Create a branch: `feat/your-idea` or `fix/issue-123`
2. Make focused changes with clear commits
3. Ensure `npm test` passes
4. Open a Pull Request (PR) with a clear description, screenshots or logs if relevant

---

## ✍️ Commit Messages
Use a clear, conventional style:
- `feat: add transition fade` — new feature
- `fix: handle empty scene steps` — bug fix
- `docs: update README tutorial` — docs only
- `refactor: simplify expression parser` — refactor, no behavior change

---

## 🧑‍🤝‍🧑 Community
- Be kind and constructive
- Assume good intent
- We welcome first-time contributors and non-coders

Thank you for making AuroraEngine better!
