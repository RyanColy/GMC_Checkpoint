import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte(), tailwindcss()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
  resolve: process.env.VITEST ? { conditions: ['browser'] } : undefined,
})
