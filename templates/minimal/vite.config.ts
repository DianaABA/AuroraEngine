import { defineConfig } from 'vite'

// Keep bundle sizes healthy for the demo template; split heavy deps.
export default defineConfig({
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8787',
        changeOrigin: true,
      },
    },
  },
  build: {
    sourcemap: false,
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
  optimizeDeps: {
    esbuildOptions: {
      sourcemap: false, // avoid parsing problematic sourcemaps from dependencies
    },
  },
})
