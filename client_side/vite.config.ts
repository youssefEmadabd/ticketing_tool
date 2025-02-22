import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"

export default defineConfig({
    plugins: [react()],
    optimizeDeps: {
      include: ['react', 'react-dom'],
    },
  server: {
    open: true,
    port: 3000, // Adjust as needed
  },
  define: {
    'process.env': {}, // Polyfill for process.env
  },
})