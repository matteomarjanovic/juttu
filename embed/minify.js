import { build } from 'esbuild';
import { statSync, readFileSync } from 'fs';
import { gzipSync } from 'zlib';

await build({
	entryPoints: ['juttu-embed.ts'],
	bundle: true,
	minify: true,
	format: 'iife',
	globalName: 'JuttuEmbed',
	outfile: 'juttu-embed.js',
});

const content = readFileSync('juttu-embed.js');
const minified = content.length;
const gzipped = gzipSync(content).length;

console.log(`✓ Built juttu-embed.js  ${(minified / 1024).toFixed(2)} kB │ gzip: ${(gzipped / 1024).toFixed(2)} kB`);