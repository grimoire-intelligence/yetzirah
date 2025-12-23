import { defineConfig } from 'vitest/config'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    svelte({
      hot: false,
      compilerOptions: {
        // Tell the compiler to generate browser code rather than SSR code
        generate: 'dom'
      }
    })
  ],
  test: {
    environment: 'happy-dom',
    globals: true,
    include: ['src/__tests__/**/*.test.ts'],
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.svelte'],
      exclude: ['src/__tests__/**']
    },
    alias: {
      // Make sure svelte uses the browser build, not server
      svelte: 'svelte'
    }
  },
  resolve: {
    alias: {
      '@grimoire/yetzirah-core': resolve(__dirname, './vitest.mock.ts')
    },
    conditions: ['browser']
  },
  ssr: {
    noExternal: ['@testing-library/svelte']
  }
})
