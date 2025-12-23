import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'happy-dom',
    globals: true,
    include: ['src/__tests__/**/*.test.ts'],
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.vue'],
      exclude: ['src/__tests__/**']
    },
    deps: {
      inline: ['@yetzirah/core']
    }
  },
  resolve: {
    alias: {
      '@yetzirah/core': resolve(__dirname, './vitest.mock.ts')
    }
  }
})
