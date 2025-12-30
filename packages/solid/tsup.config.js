import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: false, // Types are bundled separately
  splitting: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: true,
  outDir: 'dist',
  external: ['solid-js', '@grimoire/yetzirah-core'],
  esbuildOptions(options) {
    options.jsx = 'preserve'
    options.jsxImportSource = 'solid-js'
  },
})
