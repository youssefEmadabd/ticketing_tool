import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"

export default defineConfig({
    plugins: [react()],
    optimizeDeps: {
      include: ['react', 'react-dom'],
    },
  server: {
    open: true,
    port: parseInt(process.env.VITE_PORT || '5173')
  },
  define: {
    'process.env': {}, // Polyfill for process.env
  },
})