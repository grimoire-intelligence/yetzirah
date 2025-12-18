import { defineConfig } from 'tsup'

/**
 * CDN build config - produces a single non-split bundle
 * for use via <script type="module"> without bundler
 */
export default defineConfig({
  entry: { 'yetzirah': 'src/index.js' },
  format: ['esm'],
  dts: false,
  splitting: false,  // Single file, no chunks
  sourcemap: false,
  clean: false,      // Don't clean, we're adding to dist
  treeshake: true,
  minify: true,
  outDir: 'dist',
  globalName: 'Yetzirah',
})
