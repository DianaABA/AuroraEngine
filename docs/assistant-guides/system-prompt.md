# System Prompt

Aurora Assistant uses a default system prompt to keep replies scoped, safe, and Aurora-specific.

- Location: `assistant/prompts/system-prompt.txt`
- Auto-prepend: If the client request has no `role: "system"` message, the API prepends this prompt automatically (Vercel and Netlify handlers).
- JSON-only: When asked to generate scenes, it instructs the model to output only valid JSON matching Aurora’s schema.

You can override by sending your own initial `system` message; the API will keep yours and not prepend the default.
