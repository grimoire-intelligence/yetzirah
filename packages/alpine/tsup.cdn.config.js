import { defineConfig } from 'tsup'

/**
 * CDN build config for Alpine.js plugin
 * 
 * Produces a self-contained bundle for direct browser usage.
 * Alpine.js is marked as external (users load it separately).
 * Yetzirah core is also external (loaded via CDN).
 */
export default defineConfig({
  entry: {
    'yetzirah-alpine': 'src/index.ts',
  },
  format: ['esm'],
  dts: false,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: true,
  outDir: 'cdn',
  // Both Alpine and yetzirah-core are external - users load them via CDN
  external: ['alpinejs', '@grimoire/yetzirah-core'],
})
