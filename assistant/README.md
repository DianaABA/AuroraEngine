# Aurora Assistant Development

## Overview

The Aurora Assistant is an AI-powered helper that provides guidance on scene authoring, pack management, and general Aurora Engine questions.

## Quick Start

### 1. Start the Development Server

```bash
npm run assistant:dev
```

This will start a development server on `http://localhost:8787` with hot-reload support.

### 2. Test the Assistant

Open [test.html](./test.html) in your browser:

```bash
# Open directly in browser or use a simple HTTP server
npx serve assistant
# Then navigate to http://localhost:3000/test.html
```

## Project Structure

```
assistant/
├── api/
│   ├── aurora-assistant.ts    # Main API handler
│   └── README.md              # API documentation
├── components/
│   └── ChatBox.tsx            # React chat component (future)
├── config/
│   └── models.json            # AI model configurations
├── prompts/
│   ├── system-prompt.txt      # System instructions
│   └── author-faq.md          # FAQ for authors
├── assistant.css              # AAA-accessible styles
├── dev-server.ts              # Development server
├── test.html                  # Test page for development
└── README.md                  # This file
```

## Development Workflow

### Running the Server

The dev server uses `tsx` with watch mode, so it automatically reloads when you make changes:

```bash
npm run assistant:dev
```

The server listens on port `8787` by default. You can change this with the `PORT` environment variable:

```bash
PORT=3000 npm run assistant:dev
```

### Testing Changes

1. Make changes to any TypeScript file
2. The server automatically reloads
3. Refresh your test page to see the changes

### API Endpoint

**POST** `/api/assistant/chat`

Request body:
```json
{
  "messages": [
    { "role": "user", "content": "How do I create a choice?" }
  ],
  "mode": "local",
  "context": {
    "errors": "optional validation errors",
    "sceneData": "optional scene JSON"
  }
}
```

Response:
```json
{
  "ok": true,
  "reply": "To create a choice...",
  "usage": { "tokens": 100 }
}
```

## AI Modes

### Local Mode (Default)
- Uses `@mlc-ai/web-llm` for offline inference
- No API keys required
- Runs entirely in the browser
- Model: `Qwen2-0.5B` (lightweight)

### BYOK Mode (Bring Your Own Key)
- Supports OpenAI, Anthropic, Groq, DeepSeek
- Requires API key configuration
- Better quality responses
- Configurable in `config/models.json`

## Customization

### System Prompt

Edit [prompts/system-prompt.txt](./prompts/system-prompt.txt) to change the assistant's behavior and knowledge base.

### FAQ Content

Update [prompts/author-faq.md](./prompts/author-faq.md) to add new FAQ entries that the assistant can reference.

### Model Configuration

Edit [config/models.json](./config/models.json) to:
- Add new AI providers
- Change default models
- Adjust temperature/parameters

## Styling

The assistant uses the AAA-accessible design system from the main Aurora Engine:

- **Colors**: High contrast (7:1 ratio)
- **Touch Targets**: Minimum 44x44px
- **Focus States**: Visible 3px cyan outlines
- **Responsive**: Mobile-first design
- **Accessibility**: Reduced motion, high contrast mode support

See [assistant.css](./assistant.css) for the complete styles.

## Integration

### Embedding in Your App

```html
<!-- Include the CSS -->
<link rel="stylesheet" href="path/to/assistant.css">

<!-- Add the assistant markup -->
<div class="aurora-asst-overlay" id="assistantOverlay">
  <!-- See test.html for complete markup -->
</div>

<!-- Use the API -->
<script>
  async function chat(message) {
    const response = await fetch('http://localhost:8787/api/assistant/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: message }],
        mode: 'local'
      })
    });
    return await response.json();
  }
</script>
```

## Production Deployment

### Build for Production

```bash
npm run build
```

The compiled output will be in `dist/assistant/`.

### Deploy as Cloudflare Worker

The API is designed to work as a Cloudflare Worker:

```bash
# Install Wrangler CLI
npm install -g wrangler

# Deploy
wrangler deploy dist/assistant/aurora-assistant.js
```

### Environment Variables

Set these in your production environment:

- `ANTHROPIC_API_KEY`: For Claude models
- `OPENAI_API_KEY`: For OpenAI models
- `GROQ_API_KEY`: For Groq models

## Troubleshooting

### Server won't start

Make sure `tsx` is installed:
```bash
npm install --save-dev tsx
```

### CORS errors in browser

The dev server includes CORS headers. If you still see errors, check that:
- The server is running on the expected port
- Your browser isn't blocking localhost requests

### Assistant not responding

Check the browser console for errors. Common issues:
- API endpoint URL is incorrect
- Request body format is wrong
- Network request is blocked

## Contributing

When adding new features:

1. Update the system prompt if needed
2. Add tests in `../tests/`
3. Update this README
4. Follow the AAA design system guidelines

## Resources

- [Aurora Engine Docs](https://github.com/DianaABA/AuroraEngine#readme)
- [Assistant Guides](../docs/assistant-guides/)
- [Design System](../DESIGN_SYSTEM.md)
- [API Documentation](./api/README.md)

---

**Version**: 1.0.0
**Last Updated**: December 2025
**Maintainer**: Aurora Engine Team
