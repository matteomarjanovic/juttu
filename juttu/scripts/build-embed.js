import { build } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

await build({
    configFile: false,
    build: {
        lib: {
            entry: resolve(__dirname, '../src/embed/juttu-embed.ts'),
            name: 'JuttuEmbed',
            fileName: () => 'juttu-embed.min.js',
            formats: ['iife']
        },
        outDir: resolve(__dirname, '../static/embed'),
        emptyOutDir: true,
        minify: 'esbuild'
    }
});

console.log('✓ Built embed script to static/embed/juttu-embed.min.js');
