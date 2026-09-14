import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
	plugins: [svelte()],
	base: "https://hanako-eo.github.io/indie-card-maker/",
})
