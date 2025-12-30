# PR-147: Solid.js Package Setup - Implementation Plan

## Summary

This PR sets up the `@grimoire/yetzirah-solid` package infrastructure for Solid.js framework wrappers. The package will follow established patterns from existing framework packages (React, Vue, Svelte, Angular) while leveraging Solid.js-specific features like signals for reactive state management.

---

## 1. Package Directory Structure

```
packages/solid/
├── package.json              # Package configuration with Solid.js dependencies
├── tsconfig.json             # TypeScript config for Solid JSX
├── vite.config.ts            # Vite build configuration for Solid library mode
├── vitest.config.ts          # Vitest test configuration
├── vitest.setup.ts           # Test setup with customElements mock
├── vitest.mock.ts            # Mock for @grimoire/yetzirah-core
└── src/
    ├── index.ts              # Main entry point with exports
    ├── types.ts              # Shared TypeScript types
    ├── utils/
    │   ├── index.ts          # Utility exports
    │   ├── create-wrapper.ts # Wrapper factory utility
    │   └── event-bridge.ts   # Event handler bridging utility
    └── __tests__/
        └── setup.test.ts     # Basic package setup tests
```

---

## 2. Package.json Configuration

Based on the patterns from `packages/react/package.json` and `packages/vue/package.json`:

**Key Configuration Points:**
- **Name**: `@grimoire/yetzirah-solid`
- **Type**: `module` (ESM)
- **Entry Points**: ESM and CJS builds with TypeScript declarations
- **Build Tool**: Vite in library mode with `vite-plugin-solid`
- **Peer Dependencies**: `solid-js >= 1.8.0`
- **Dependencies**: `@grimoire/yetzirah-core: workspace:*`

**Dev Dependencies:**
- `solid-js: ^1.9.0`
- `vite: ^5.0.0`
- `vite-plugin-solid: ^2.10.0`
- `vitest: ^3.2.4`
- `@solidjs/testing-library: ^0.8.0`
- `happy-dom: ^18.0.1`
- `typescript: ^5.4.5`

**Scripts:**
```json
{
  "build": "vite build",
  "dev": "vite build --watch",
  "test": "vitest run",
  "test:watch": "vitest",
  "test:coverage": "vitest run --coverage"
}
```

**Exports Configuration:**
```json
{
  ".": {
    "types": "./dist/index.d.ts",
    "import": "./dist/index.js",
    "require": "./dist/index.cjs"
  }
}
```

---

## 3. TypeScript Configuration

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "preserve",
    "jsxImportSource": "solid-js",
    "declaration": true,
    "declarationMap": true,
    "strict": true,
    "skipLibCheck": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "outDir": "./dist",
    "rootDir": "./src",
    "paths": {
      "@grimoire/yetzirah-core": ["../core/dist/index.d.ts"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.tsx"],
  "exclude": ["node_modules", "dist", "**/*.test.ts", "**/*.test.tsx"]
}
```

Key: `jsxImportSource: "solid-js"` enables Solid's JSX transformation.

---

## 4. Build Setup (Vite Library Mode)

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import { resolve } from 'path'

export default defineConfig({
  plugins: [solid()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`
    },
    rollupOptions: {
      external: ['solid-js', '@grimoire/yetzirah-core'],
    },
  },
})
```

---

## 5. Test Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import solid from 'vite-plugin-solid'
import { resolve } from 'path'

export default defineConfig({
  plugins: [solid()],
  test: {
    environment: 'happy-dom',
    globals: true,
    include: ['src/__tests__/**/*.test.ts', 'src/__tests__/**/*.test.tsx'],
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      exclude: ['src/__tests__/**', 'src/index.ts']
    },
    deps: {
      inline: ['@grimoire/yetzirah-core']
    }
  },
  resolve: {
    alias: {
      '@grimoire/yetzirah-core': resolve(__dirname, './vitest.mock.ts')
    },
    conditions: ['browser']
  }
})
```

---

## 6. Export Structure

```typescript
// src/index.ts
/**
 * @grimoire/yetzirah-solid
 *
 * Solid.js wrappers for Yetzirah Web Components.
 * Native signal integration for reactive state management.
 */

export { VERSION } from '@grimoire/yetzirah-core'
export { createYetzirahWrapper } from './utils/create-wrapper'
export { createEventBridge } from './utils/event-bridge'
export type * from './types'

// Note: Component wrappers will be added in PR-148
```

---

## 7. Shared Utilities

### 7.1 `src/types.ts` - Shared TypeScript Types

```typescript
import type { JSX, Accessor } from 'solid-js'

export interface YetzirahComponentProps {
  class?: string
  style?: JSX.CSSProperties | string
  ref?: (el: HTMLElement) => void
}

export interface DisablableProps {
  disabled?: boolean
}

export interface OpenableProps {
  open?: boolean | Accessor<boolean>
  onOpen?: () => void
  onClose?: () => void
}

export interface ValueProps<T = any> {
  value?: T | Accessor<T>
  onChange?: (value: T) => void
}
```

### 7.2 `src/utils/create-wrapper.ts` - Wrapper Factory

Factory for creating consistent wrapper components with:
- Boolean/attribute prop syncing via createEffect
- Event bridging with automatic cleanup
- Signal resolution helper (`resolveValue`)

### 7.3 `src/utils/event-bridge.ts` - Event Bridging

Utilities for:
- `createEventBridge` - Bridge CustomEvent.detail to callbacks
- `bridgeEvents` - Bridge multiple events at once
- `createTwoWayBinding` - Two-way binding between attributes and signals

---

## 8. Implementation Steps

1. Create package directory: `packages/solid/`
2. Create `package.json` with dependencies and configuration
3. Create `tsconfig.json` with Solid JSX settings
4. Create `vite.config.ts` for library build
5. Create `vitest.config.ts` for testing
6. Create test support files: `vitest.setup.ts`, `vitest.mock.ts`
7. Create `src/types.ts` with shared TypeScript interfaces
8. Create `src/utils/create-wrapper.ts` with wrapper factory
9. Create `src/utils/event-bridge.ts` with event bridging utilities
10. Create `src/utils/index.ts` to export utilities
11. Create `src/index.ts` main entry point
12. Create `src/__tests__/setup.test.ts` for basic validation
13. Run `pnpm install` from root to link workspace
14. Run `pnpm --filter @grimoire/yetzirah-solid build` to verify build
15. Run `pnpm --filter @grimoire/yetzirah-solid test` to verify tests

---

## 9. Acceptance Criteria

| Criterion | Implementation |
|-----------|----------------|
| Package builds with `pnpm build` | Vite library mode with `vite-plugin-solid` |
| TypeScript configured for Solid JSX | `jsxImportSource: "solid-js"` in tsconfig |
| Vite configured for Solid library mode | `vite.config.ts` with lib options |
| Shared `createYetzirahWrapper` utility | `src/utils/create-wrapper.ts` |
| Signal-based state management helper | `resolveValue()` function handles signals |
| Event handler bridging utility | `src/utils/event-bridge.ts` |

---

## 10. Critical Reference Files

- `packages/react/package.json` - Template for package.json structure
- `packages/vue/tsconfig.json` - TypeScript configuration pattern
- `packages/svelte/vitest.config.ts` - Test configuration pattern
- `packages/vue/src/types.ts` - Shared types pattern to adapt for Solid signals
