import { defineConfig } from 'tsup'
import sveltePlugin from 'esbuild-svelte'
import sveltePreprocess from 'svelte-preprocess'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: false, // Svelte components use their own type system
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: true,
  outDir: 'dist',
  external: ['svelte', '@grimoire/yetzirah-core'],
  esbuildPlugins: [
    sveltePlugin({
      preprocess: sveltePreprocess(),
      compilerOptions: {
        css: 'injected'
      }
    })
  ]
})
