import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
   base: "/sourcemaps-decode/"
  // build: {
  //   sourcemap: true // Enable sourcemaps for production build
  // }
})
