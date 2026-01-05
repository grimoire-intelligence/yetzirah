import { defineConfig } from 'tsup'
import { solidPlugin } from 'esbuild-plugin-solid'

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
  esbuildPlugins: [solidPlugin({ solid: { generate: 'dom' } })],
})
