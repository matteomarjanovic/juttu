// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
    integrations: [
        starlight({
            title: 'Juttu',
            components: {
                SiteTitle: './src/components/SiteTitle.astro',
            },
            customCss: [
                './src/styles/global.css',
            ],
            social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/matteomarjanovic/juttu' }],
            sidebar: [
                { label: 'Why Juttu', link: '/why-juttu' },
                { label: 'Getting Started', autogenerate: { directory: 'getting-started' } },
                { label: 'Self-Hosting', link: '/self-hosting' },
            ],
            favicon: 'favicon.ico',
        }),
    ],

    vite: {
        plugins: [tailwindcss()],
    },
});