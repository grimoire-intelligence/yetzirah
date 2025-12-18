import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.js'],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: true,
  outDir: 'dist',
  external: ['react', 'react-dom', '@yetzirah/core'],
  esbuildOptions(options) {
    options.loader = { '.js': 'jsx' }
  },
})
