// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/React-Planner/', // 👈 This MUST match your GitHub repo name
  plugins: [react()],
})
