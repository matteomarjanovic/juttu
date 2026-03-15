import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [tailwindcss(), sveltekit()],
    server: {
        allowedHosts: ['.ngrok-free.app', '.share.zrok.io'],
    },
    test: {
        include: ['src/**/*.test.ts'],
        environment: 'jsdom',
        globals: true,
        setupFiles: ['src/tests/setup.ts'],
        alias: [
            {
                find: /^svelte$/,
                replacement: path.resolve(__dirname, 'node_modules/svelte/src/index-client.js'),
            },
            {
                find: '$env/dynamic/public',
                replacement: path.resolve(__dirname, 'src/tests/env-dynamic-public-stub.ts'),
            },
        ],
    },
});
