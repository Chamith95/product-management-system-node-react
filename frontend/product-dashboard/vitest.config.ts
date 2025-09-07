import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'

export default defineConfig({
	plugins: [
		tanstackRouter({ target: 'react', autoCodeSplitting: true }),
		react(),
		tailwindcss(),
	],
	test: {
		globals: true,
		environment: 'jsdom',
	},
	resolve: {
		alias: {
			'@': '/src',
		},
	},
})
