import { defineConfig } from 'tsup'
import vue from 'esbuild-plugin-vue3'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: false, // Vue SFCs use their own type system with vue-tsc
  splitting: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: true,
  outDir: 'dist',
  external: ['vue', '@yetzirah/core'],
  esbuildPlugins: [vue()]
})
