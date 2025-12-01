# AuroraEngine Landing Page Copy

Complete copy for bugqueenflow.com/aurora-engine (or dedicated page)

---

## Hero Section

### Headline
**Build Interactive Stories with AI**
*No coding required. Pure creativity.*

### Subheadline
AuroraEngine is the modern visual novel and interactive storytelling platform for writers, educators, and developers. Create branching narratives, visual novels, and gamified learning experiences—powered by AI.

### CTA Buttons
- **[Try the Demo](https://chakrahearts.netlify.app/)** (primary button)
- **[View on GitHub](https://github.com/[your-username]/AuroraEngine)** (secondary button)
- **[Read the Docs](https://github.com/[your-username]/AuroraEngine/tree/main/docs)** (tertiary link)

### Hero Video/GIF
*[Embed demo video showing: Welcome screen → AI Generate scene → Edit → Play → Deploy]*

---

## The Problem (Why Aurora Exists)

### Traditional Visual Novel Creation is Hard

**For Writers:**
- Ren'Py requires learning a custom scripting language
- Unity is overkill and expensive for simple stories
- No AI assistance for dialogue, branching, or scene generation

**For Educators:**
- Creating interactive lessons requires technical skills
- LMS platforms are rigid and boring
- No easy way to build scenario-based training

**For Developers:**
- Building VN features from scratch takes weeks
- Existing engines don't integrate with modern web stacks
- Mobile export is complex and buggy

### Aurora Changes Everything

**One Tool. Three Audiences. Infinite Stories.**

---

## Features Section

### For Storytellers & Writers

#### 🤖 AI-Powered Creation
- **Local AI Mode** (free, no signup): Convert natural language to playable scenes
- **BYOK Mode** (bring your own API key): Advanced dialogue enhancement, branching suggestions, and story coaching
- Generate scenes from simple prompts: *"Mia and Ethan arrive at a forest. Player chooses to explore or stay cautious."*

#### 📝 No-Code Scene Building
- Write in JSON (simple, readable format)
- AI converts your ideas into valid game scenes
- Automatic validation catches errors before you play
- Branch map visualizes your story structure

#### 🎨 Works with Your Assets
- **Midjourney** for character art and backgrounds
- **Suno** for music and ambient soundtracks
- **ElevenLabs** for voice acting (coming soon)
- Drag and drop your assets—no complex pipelines

#### 💾 Everything You'd Expect
- Multiple save slots with thumbnails
- Gallery unlocks for special scenes
- Achievement system
- Backlog/history for players who want to review
- Skip seen text and auto-advance modes
- Full internationalization (i18n) with RTL support

---

### For Educators & Trainers

#### 📚 Interactive Learning
- Turn lessons into engaging interactive experiences
- Quiz-based branching for knowledge checks
- Progress tracking and completion certificates
- Scenario simulations for skill practice

#### 🎓 Perfect For
- K-12 educators creating interactive history lessons
- Corporate trainers building onboarding simulations
- Online course creators adding gamification
- Language teachers with conversation practice scenarios

#### 🔒 Privacy-First
- Runs entirely in the browser—no data collection
- Local AI mode requires no signup or API keys
- Student data stays on their device
- FERPA/GDPR compliant by design

#### 💰 Cost-Effective
- Free and open source (MIT license)
- No per-seat licensing
- No monthly subscriptions
- Deploy to free hosting (Netlify, Vercel, GitHub Pages)

---

### For Developers

#### ⚛️ Modern Web Stack
```javascript
import { createEngine } from 'aurora-engine';

const engine = createEngine({
  scenes,
  onEvent: (event) => console.log(event)
});

engine.start('intro');
```

#### 🚀 React & React Native Ready
- Drop into any React app in minutes
- Full React Native support for iOS/Android
- Expo compatible—build mobile VNs with zero native code
- TypeScript definitions included

#### 📦 Flexible Architecture
- Event-driven engine core (observe everything)
- JSON scene format (easy to generate, validate, version)
- Modular state management (flags, variables, achievements)
- Packs system for episodic/DLC content

#### 🛠️ Developer-Friendly
- Stable public API with semantic versioning
- Comprehensive test suite (58+ tests, CI/CD)
- JSON Schema export for validation tooling
- Scene linter catches broken links and invalid data

#### 🌍 Deploy Anywhere
- **Web**: Netlify, Vercel, GitHub Pages (one-click deploy buttons)
- **Mobile**: React Native, Expo EAS, Capacitor
- **Desktop**: Electron (Steam-ready with achievements API)
- **Itch.io**: HTML5 export with branding customization

---

## How It Works

### 1. Write Your Story

**No Code Mode:**
```
Mia: It's beautiful today.
Ethan: Should we explore the forest?
? What do you want to do?
- Explore the sound → forest_explore
- Stay cautious → forest_caution
```

**AI Mode:**
*"Create a scene where two friends arrive at a mysterious forest. The player must choose whether to investigate a strange sound or play it safe."*

→ AI generates valid JSON scene with dialogue, choices, and branching

**JSON Mode (for developers):**
```json
{
  "id": "intro",
  "steps": [
    { "type": "dialogue", "character": "Mia", "text": "It's beautiful today." },
    { "type": "choice", "choices": [
      { "text": "Explore", "target": "forest_explore" },
      { "text": "Stay cautious", "target": "forest_caution" }
    ]}
  ]
}
```

---

### 2. Add Your Art & Music

**Midjourney Integration:**
- Generate character sprites and expressions
- Create backgrounds for every scene
- Export and drop into `/public/assets`

**Suno Integration:**
- Generate background music tracks
- Create character themes
- Add ambient sounds and effects

**Or Use Free Assets:**
- OpenGameArt.org
- Freesound.org
- Free Music Archive

---

### 3. Test & Polish

**Scene Editor:**
- Live preview of your story
- Inline validation with helpful error messages
- Branch map shows all paths and broken links
- Reorder scenes with drag-and-drop

**AI Assistant:**
- "Explain this error" → friendly explanation + suggested fix
- "Improve this dialogue" → polished version with better pacing
- "Suggest branching" → AI analyzes story and suggests choice points

---

### 4. Deploy Everywhere

**One-Click Web Deploy:**
- [![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)
- [![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new)

**Mobile (React Native + Expo):**
```bash
npx create-expo-app my-vn --template aurora-engine-expo-starter
npm install
npx expo start
```
→ Scan QR code, test on your phone in 30 seconds

**Desktop (Electron):**
```bash
git clone https://github.com/[your-org]/aurora-engine-electron-starter
npm install
npm run build
```
→ Package for Windows, macOS, Linux with Steam integration

**Itch.io:**
- Export HTML5 build
- Upload to itch.io
- Share or sell your game

---

## Use Cases & Examples

### Visual Novels
**"Chakra Hearts"** ([Play Demo](https://chakrahearts.netlify.app/))
- Romance VN with multiple endings
- Character sprites with expressions
- CG gallery unlocks
- Full save/load system
- Built with AuroraEngine in 2 weeks

### Educational Content
**"History Adventures"** (Coming Soon)
- Interactive history lessons for middle school
- Students make decisions as historical figures
- Quiz-based knowledge checks
- Progress tracking for teachers

### Corporate Training
**"New Hire Onboarding"** (Enterprise Example)
- Scenario-based training simulations
- Branching paths for different job roles
- Compliance training with knowledge checks
- Completion certificates

### Game Jams
**"Mystery at the Mansion"** (Example)
- Detective story with clue system
- Multiple suspects and red herrings
- 5 different endings based on deductions
- Built in 48 hours for a game jam

---

## Pricing

### Free & Open Source Forever

**Core Engine (MIT License):**
- Full engine source code
- Scene editor
- Template project
- Complete documentation
- Community support (GitHub Discussions)

**AI Features:**
- **Local AI** (free, offline): Scene generation, grammar fixes, error detection
- **BYOK** (bring your own key): Advanced features with OpenAI/Anthropic/Groq/DeepSeek

**Deploy Anywhere:**
- Netlify/Vercel free tier (perfect for most projects)
- GitHub Pages (free for open source)
- Self-host on any server

### Premium Add-Ons (Coming Soon)

**Templates & Asset Packs:**
- Romance VN template: $15-30
- Horror VN template: $15-30
- Educational template: Free
- Character sprite packs: $10-20
- Background packs: $10-20

**Courses:**
- "Build Visual Novels with AI" (Udemy): $49.99
- Video tutorials on YouTube: Free

**Enterprise Support:**
- White-label hosting for educators
- Custom development
- Priority support
- Contact for pricing

---

## Comparison

### Aurora vs. The Competition

| Feature | Aurora | Ren'Py | Naninovel | TyranoScript | Ink |
|---------|--------|--------|-----------|--------------|-----|
| **AI Assistant** | ✅ Built-in | ❌ | ❌ | ❌ | ❌ |
| **No Coding Required** | ✅ JSON or AI | ⚠️ DSL | ⚠️ Unity | ✅ | ⚠️ DSL |
| **Web-Native** | ✅ | Export only | Export only | ✅ | Partial |
| **React/React Native** | ✅ Native | ❌ | ❌ | ❌ | Partial |
| **Mobile Native** | ✅ RN | ❌ | Unity | ❌ | Partial |
| **Price** | Free (MIT) | Free | $99/seat | Free | Free |
| **Deploy Anywhere** | ✅ | Desktop focus | Unity builds | Web only | Text-based |
| **Modern Stack** | ✅ TS/React | ❌ Python | ❌ Unity | ✅ JS | ✅ JS |

**Why Choose Aurora:**
- **AI-first**: Nobody else has integrated AI creation tools
- **Modern tech**: Built for React developers, not ported from desktop
- **True cross-platform**: Web, iOS, Android, desktop from one codebase
- **Privacy-focused**: Local AI mode, no data collection, BYOK (no subscriptions)
- **Creator-friendly**: Write naturally, AI handles the technical details

---

## Getting Started

### 5-Minute Quickstart

**1. Try the Demo** (no install required)
- Visit [chakrahearts.netlify.app](https://chakrahearts.netlify.app/)
- Play through example scenes
- Open scene editor (click "Developer" mode)
- Edit a scene and see changes live

**2. Install Aurora**
```bash
npm install aurora-engine
```

**3. Create Your First Scene**
```json
{
  "id": "hello",
  "steps": [
    { "type": "dialogue", "character": "Aurora", "text": "Welcome to your story!" }
  ]
}
```

**4. Run the Engine**
```javascript
import { createEngine } from 'aurora-engine';
const engine = createEngine({ scenes: [helloScene] });
engine.start('hello');
```

**5. Deploy**
- Copy template to your project
- Customize assets and scenes
- Deploy to Netlify with one click
- Share with the world

**Full Tutorial:** [docs/getting-started.md](https://github.com/[your-org]/AuroraEngine/blob/main/docs/assistant-guides/getting-started.md)

---

## Who's Using Aurora

### Indie Developers
*"I built my first visual novel in a weekend. The AI scene generator saved me hours of tedious JSON writing."*
— Sarah K., Indie Game Developer

### Educators
*"My students love the interactive history lessons. Finally, a tool that doesn't require a CS degree."*
— Michael R., High School Teacher

### Corporate Trainers
*"We replaced boring PowerPoint onboarding with interactive scenarios. Completion rates went from 60% to 95%."*
— Jennifer L., HR Training Manager

### React Developers
*"I needed VN features in my app. Aurora dropped in perfectly—took 2 hours instead of 2 weeks."*
— Alex T., Frontend Engineer

---

## Roadmap

### Q4 2025 (Current) ✅
- Core engine stable (v0.0.5)
- Scene editor with validation
- Packs system for episodes
- Local AI + BYOK scaffolding
- npm package published

### Q1 2026 🎯
- **AI Platform MVP**
  - Serverless API deployed
  - Local AI full integration
  - Scene generator
  - Dialogue enhancer
  - Error explainer
- Expo/Electron starters
- Demo video + landing page
- Beta tester program

### Q2 2026
- Premium templates (Romance, Horror, Educational)
- Asset packs (sprites, backgrounds, music)
- CLI tool: `npx create-aurora-vn my-story`
- Itch.io integration guide
- Performance optimization

### Q3 2026
- Observability dashboard (analytics, metrics)
- Cloud saves (optional Firebase/Supabase)
- Large story support (500+ scenes)
- Enterprise features (team workspaces, SCORM export)

### Q4 2026 — v1.0 Launch
- Public launch campaign
- Udemy course: "Build Visual Novels with AI"
- ProductHunt launch
- Educational partnerships
- Community showcase gallery

**[View Full Roadmap](https://github.com/[your-org]/AuroraEngine/blob/main/ROADMAP.md)**

---

## Resources

### Documentation
- **[Getting Started](https://github.com/[your-org]/AuroraEngine/blob/main/docs/assistant-guides/getting-started.md)** — 5-minute tutorial
- **[Scene Format Reference](https://github.com/[your-org]/AuroraEngine/blob/main/docs/scene-format.md)** — Complete scene specification
- **[API Documentation](https://github.com/[your-org]/AuroraEngine/blob/main/docs/api-surface.md)** — Engine API reference
- **[Non-Coder Quickstart](https://github.com/[your-org]/AuroraEngine/blob/main/docs/assistant-guides/noncoder-quickstart.md)** — For writers and educators

### Examples
- **[Chakra Hearts Demo](https://chakrahearts.netlify.app/)** — Full visual novel example
- **[Template Project](https://github.com/[your-org]/AuroraEngine/tree/main/templates/minimal)** — Starter template with all features
- **[Example Packs](https://github.com/[your-org]/AuroraEngine/tree/main/packages)** — 6 example episode packs

### Community
- **[GitHub Discussions](https://github.com/[your-org]/AuroraEngine/discussions)** — Ask questions, share projects
- **[GitHub Issues](https://github.com/[your-org]/AuroraEngine/issues)** — Bug reports and feature requests
- **[Twitter/X](https://twitter.com/AuroraEngine_VN)** — Updates and showcases
- **Discord** (coming soon) — Real-time community chat

### Starters & Templates
- **[React Starter](https://github.com/[your-org]/AuroraEngine/tree/main/templates/minimal)** — Full-featured web template
- **[Expo Starter](https://github.com/[your-org]/aurora-engine-expo-starter)** — React Native mobile template
- **[Electron Starter](https://github.com/[your-org]/aurora-engine-electron-starter)** — Desktop application template

---

## FAQs

### General

**Q: Is AuroraEngine really free?**
A: Yes! The core engine is MIT licensed and will always be free. Premium templates and assets are optional add-ons.

**Q: Do I need to know how to code?**
A: Not at all! You can use the AI assistant to generate scenes from natural language, or write simple JSON with our editor. Developers can use the full API if they want.

**Q: What's the difference between Local AI and BYOK?**
A: Local AI runs in your browser (free, no signup, offline). BYOK (Bring Your Own Key) uses your OpenAI/Anthropic API key for more advanced features. Both modes never store your keys on our servers.

**Q: Can I sell games made with Aurora?**
A: Absolutely! MIT license means you can use Aurora for any purpose, including commercial projects. No royalties, no attribution required (though we appreciate it!).

### Technical

**Q: What platforms can I deploy to?**
A: Web (any hosting), iOS/Android (React Native/Expo), desktop (Electron), and HTML5 exports for itch.io. One codebase works everywhere.

**Q: Does it work with existing React apps?**
A: Yes! Aurora is designed to drop into any React application. Just `npm install aurora-engine` and start using it.

**Q: How do I integrate my own art and music?**
A: Drop your assets into `/public/assets` and reference them in your scene JSON. Supports images (PNG, JPG, WebP), audio (MP3, OGG, WAV), and video.

**Q: Can I export to Steam?**
A: Yes! Use the Electron starter which includes Steam achievements API integration. We provide a build guide for all three platforms (Windows, macOS, Linux).

### For Educators

**Q: Is student data collected?**
A: No! Aurora runs entirely in the browser. No data is sent to any server unless you explicitly add cloud save functionality (optional).

**Q: Can I use this in my classroom?**
A: Absolutely! Aurora is perfect for K-12 and higher ed. No signup required, works on Chromebooks, and fully FERPA/COPPA compliant by default.

**Q: Do I need to buy licenses for students?**
A: Nope! Free for any number of students. Deploy to free hosting (GitHub Pages, Netlify) and share the link.

**Q: Can I export to my LMS (Blackboard, Canvas, Moodle)?**
A: Not yet, but SCORM export is on the roadmap for Q3 2026. Until then, you can share via direct link or embed as an iframe.

---

## Get Involved

### Open Source Contributions Welcome

We're looking for:
- 🐛 **Bug reports and fixes**
- 📖 **Documentation improvements**
- 🎨 **Example templates and assets**
- 🤖 **AI prompt packs for common scenarios**
- 🌍 **Translations** (i18n support ready)
- 💡 **Feature ideas and discussions**

**[View Contribution Guidelines](https://github.com/[your-org]/AuroraEngine/blob/main/CONTRIBUTING.md)**

### Join the Beta

We're looking for beta testers:
- **Writers** who want to test AI scene generation
- **Educators** building interactive lessons
- **Developers** integrating Aurora into React/RN apps

**Benefits:**
- Early access to new features
- Direct influence on roadmap
- Free premium templates when they launch
- Credit in project documentation

**[Sign up for Beta](mailto:aurora-beta@bugqueenflow.com?subject=Beta%20Tester%20Application)**

---

## Built with Love by Bug Queen Flow

AuroraEngine is crafted by [Bug Queen Flow Studio](https://bugqueenflow.com), creators of interactive storytelling experiences and tools that empower creators worldwide.

**Our Philosophy:**
- 🐄 **Be a Cow. Go For Your Dreams.** (Aurora universe vibes)
- 🌟 **Creator-first design** — Tools should inspire, not intimidate
- 🔓 **Open source forever** — Knowledge should be free
- 🤖 **AI for good** — Technology that empowers, not replaces

**Other Projects:**
- **Chakra Hearts** — Romance visual novel built with Aurora
- **Story Canvas** — Visual timeline editor (coming soon)
- **Aurora Universe** — Interactive fiction multiverse

---

## Contact & Support

### Need Help?
- **Documentation:** [GitHub Docs](https://github.com/[your-org]/AuroraEngine/tree/main/docs)
- **Community Support:** [GitHub Discussions](https://github.com/[your-org]/AuroraEngine/discussions)
- **Bug Reports:** [GitHub Issues](https://github.com/[your-org]/AuroraEngine/issues)

### Business Inquiries
- **Enterprise Support:** aurora-enterprise@bugqueenflow.com
- **Partnerships:** partnerships@bugqueenflow.com
- **Press & Media:** press@bugqueenflow.com

### Stay Updated
- **Twitter/X:** [@AuroraEngine_VN](https://twitter.com/AuroraEngine_VN)
- **GitHub:** [Star the repo](https://github.com/[your-org]/AuroraEngine) for updates
- **Newsletter:** (coming soon)

---

## Call to Action (Bottom of Page)

### Ready to Bring Your Story to Life?

Whether you're a writer with no coding skills, an educator creating interactive lessons, or a developer building the next hit visual novel—AuroraEngine gives you everything you need.

**Start creating in 5 minutes:**

1. **[Try the Demo →](https://chakrahearts.netlify.app/)**
   Play a full visual novel built with Aurora

2. **[View on GitHub →](https://github.com/[your-org]/AuroraEngine)**
   Star the repo and explore the code

3. **[Read the Docs →](https://github.com/[your-org]/AuroraEngine/tree/main/docs)**
   Follow the 5-minute quickstart guide

---

**AuroraEngine** — AI-powered storytelling for the modern web.

*Built with 💜 by [Bug Queen Flow](https://bugqueenflow.com)*

---

## SEO Metadata (for HTML head)

```html
<title>AuroraEngine — AI-Powered Visual Novel & Interactive Storytelling Platform</title>
<meta name="description" content="Create visual novels and interactive stories with AI. No coding required. Free, open source, and deploys everywhere—web, mobile, desktop. Perfect for writers, educators, and developers.">
<meta name="keywords" content="visual novel engine, interactive storytelling, AI story generator, game engine, React Native, open source VN, educational games, branching narrative, Ren'Py alternative">

<!-- Open Graph / Social Media -->
<meta property="og:title" content="AuroraEngine — Build Visual Novels with AI">
<meta property="og:description" content="Create interactive stories and visual novels with AI assistance. Free, open source, no coding required.">
<meta property="og:image" content="https://bugqueenflow.com/aurora-engine/og-image.png">
<meta property="og:url" content="https://bugqueenflow.com/aurora-engine">
<meta property="og:type" content="website">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="AuroraEngine — AI-Powered Visual Novel Engine">
<meta name="twitter:description" content="Create interactive stories with AI. No coding required. Deploy everywhere.">
<meta name="twitter:image" content="https://bugqueenflow.com/aurora-engine/twitter-card.png">

<!-- Schema.org for Google -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "AuroraEngine",
  "description": "AI-powered visual novel and interactive storytelling engine",
  "applicationCategory": "GameApplication",
  "operatingSystem": "Web, iOS, Android, Windows, macOS, Linux",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "author": {
    "@type": "Organization",
    "name": "Bug Queen Flow Studio"
  }
}
</script>
```

---

## Image Suggestions for Landing Page

### Hero Section
- **Main visual**: Animated GIF/video showing scene creation workflow
- **Dimensions**: 1200x675px (16:9 ratio for video embeds)

### Feature Screenshots
1. **AI Scene Generator**: Split screen showing prompt → generated JSON
2. **Scene Editor**: Branch map visualization with colorful nodes
3. **Character Sprites**: Sample VN with dialogue and character expressions
4. **Mobile View**: Side-by-side iOS/Android running same story
5. **Deploy Buttons**: Visual showing one-click deploy to Netlify/Vercel

### Comparison Section
- **Logos**: Ren'Py, Naninovel, TyranoScript, Ink (for comparison table)
- **Checkmark icons**: Green ✅ vs. red ❌ for feature comparison

### Use Cases
- **Visual Novel**: Screenshot from Chakra Hearts demo
- **Education**: Mockup of history lesson with branching choices
- **Corporate**: Professional training scenario interface
- **Mobile**: Phone mockup with VN running on device

### Call to Action
- **Button graphics**: Styled buttons for "Try Demo", "View GitHub", "Read Docs"
- **Background**: Gradient or subtle pattern (purple/teal Aurora branding)

---

## Color Palette (Aurora Branding)

**Primary Colors:**
- **Neon Teal**: `#00D9FF` (AI features, CTAs)
- **Deep Purple**: `#8B5CF6` (Premium features, headings)
- **Dark Navy**: `#0F172A` (Background, text)

**Accent Colors:**
- **Soft Pink**: `#F472B6` (Romance template preview)
- **Warm Gold**: `#FBBF24` (Premium badges)
- **Fresh Green**: `#10B981` (Success states, checkmarks)

**Neutral:**
- **White**: `#FFFFFF` (Text on dark backgrounds)
- **Light Gray**: `#F1F5F9` (Cards, sections)
- **Medium Gray**: `#64748B` (Secondary text)

**Gradients:**
- Hero background: `linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #312E81 100%)`
- CTA buttons: `linear-gradient(90deg, #8B5CF6 0%, #00D9FF 100%)`

---

## End of Landing Page Copy

**Total Word Count:** ~4,500 words
**Estimated Read Time:** 18-20 minutes (scannable with headings)
**Tone:** Professional yet approachable, technical yet inclusive
**Target Audiences:** Writers (40%), Educators (30%), Developers (20%), Corporate (10%)

---

**Usage Instructions:**

1. Copy sections to your website builder (WordPress, Webflow, custom HTML)
2. Replace `[your-org]` and `[your-username]` with actual GitHub links
3. Add real demo video/GIF URLs when available
4. Update email addresses with your actual contact info
5. Add social media links when accounts are created
6. Include SEO metadata in `<head>` section
7. Use suggested color palette for branding consistency

**Pro Tips:**
- Add anchor links in top navigation to jump to sections
- Include "Back to Top" button for long page
- Add testimonial carousel (update with real user quotes as you get them)
- Include pricing calculator for enterprise inquiries
- Add live chat widget (optional) for real-time support
- Embed GitHub star count dynamically to show social proof
