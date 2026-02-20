import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [tailwindcss(), sveltekit()],
    server: {
        allowedHosts: ['.ngrok-free.app'],
    },
    test: {
        include: ['src/**/*.test.ts'],
        environment: 'jsdom',
        globals: true,
        setupFiles: ['src/tests/setup.ts'],
    },
});
