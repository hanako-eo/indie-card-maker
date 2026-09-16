import { svelte } from "@sveltejs/vite-plugin-svelte"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  base: process.env.NODE_ENV == "production" ? "https://hanako-eo.github.io/indie-card-maker/" : "",
});
