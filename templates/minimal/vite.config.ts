import { defineConfig } from 'vite'

// Keep bundle sizes healthy for the demo template; split heavy deps.
export default defineConfig({
  server: { port: 5173 },
  build: {
    chunkSizeWarningLimit: 1024,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['aurora-engine'],
          ai: ['@mlc-ai/web-llm', 'openai'],
        },
      },
    },
  },
})
