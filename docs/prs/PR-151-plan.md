# PR-151: Alpine.js Plugin Package Setup

## Overview

This PR sets up the `@grimoire/yetzirah-alpine` package as an Alpine.js plugin. The package will provide Alpine.js integration for Yetzirah web components, enabling seamless use in Alpine.js applications and server-rendered frameworks like Rails, Laravel, and Django.

This PR focuses on **infrastructure setup only** - directives will be implemented in subsequent PRs (PR-152 through PR-155).

## Research Summary

### Alpine.js Plugin Architecture

Based on research from the [Alpine.js Extending documentation](https://alpinejs.dev/advanced/extending) and the [Alpine.js Plugin Template](https://github.com/markmead/alpinejs-plugin-template):

1. **Plugin Function Signature**: Plugins are functions that receive the `Alpine` global object:
   ```typescript
   export default function (Alpine: Alpine) {
     Alpine.directive('name', ...)
     Alpine.magic('name', ...)
   }
   ```

2. **Registration Methods**:
   - **NPM Module**: `Alpine.plugin(yetzirah)`
   - **Script Tag**: Wrap in `alpine:init` event listener

3. **TypeScript Support**:
   - Use `@types/alpinejs` for type definitions
   - `PluginCallback` type for plugin function signature
   - `Alpine` interface for the global object

### Existing Package Patterns in Yetzirah

The project uses consistent patterns across framework packages:
- **Build Tool**: tsup for most packages
- **Output Formats**: ESM and CJS (UMD for CDN)
- **TypeScript**: Extends root `tsconfig.json`
- **Dependencies**: Core package via `workspace:*`
- **Testing**: Vitest with happy-dom

---

## Package Directory Structure

```
packages/alpine/
├── package.json
├── tsconfig.json
├── tsup.config.ts
├── vitest.config.ts
├── README.md
├── src/
│   ├── index.ts              # Main entry point (re-exports plugin)
│   ├── plugin.ts             # Plugin registration function
│   ├── types.ts              # TypeScript type definitions
│   ├── utils/
│   │   └── element-helpers.ts # Utilities for working with Yetzirah elements
│   ├── directives/           # (PR-152+) Directive implementations
│   │   └── index.ts          # Placeholder for directive exports
│   ├── magics/               # (PR-154) Magic method implementations
│   │   └── index.ts          # Placeholder for magic exports
│   └── __tests__/
│       └── plugin.test.ts    # Plugin registration tests
└── dist/                     # Build output
```

---

## Implementation Details

### 1. package.json

```json
{
  "name": "@grimoire/yetzirah-alpine",
  "version": "0.1.0",
  "description": "Alpine.js plugin for Yetzirah Web Components",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    },
    "./cdn": {
      "import": "./dist/alpine-yetzirah.global.js"
    }
  },
  "files": [
    "dist"
  ],
  "scripts": {
    "build": "tsup",
    "build:cdn": "tsup --config tsup.cdn.config.ts",
    "dev": "tsup --watch",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  },
  "keywords": [
    "alpine",
    "alpinejs",
    "web-components",
    "ui",
    "accessibility",
    "grimoire",
    "yetzirah"
  ],
  "author": "Grimoire Intelligence",
  "license": "ISC",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/grimoire-intelligence/yetzirah.git",
    "directory": "packages/alpine"
  },
  "peerDependencies": {
    "alpinejs": ">=3.10.0"
  },
  "dependencies": {
    "@grimoire/yetzirah-core": "workspace:*"
  },
  "devDependencies": {
    "@types/alpinejs": "^3.13.0",
    "alpinejs": "^3.14.0",
    "happy-dom": "^18.0.1",
    "vitest": "^3.2.4"
  },
  "sideEffects": false
}
```

**Key Decisions**:
- `peerDependencies` on `alpinejs >=3.10.0` (minimum version with stable plugin API)
- CDN export for script tag usage without build step
- Standard devDependencies matching other packages

### 2. TypeScript Configuration (tsconfig.json)

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "declarationMap": true,
    "paths": {
      "@grimoire/yetzirah-core": ["../core/dist/index.d.ts"],
      "alpinejs": ["./node_modules/alpinejs/dist/module.esm.js"]
    }
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

### 3. Build Configuration (tsup.config.ts)

```typescript
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false,  // Single bundle for plugin
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: true,
  outDir: 'dist',
  external: ['alpinejs', '@grimoire/yetzirah-core'],
})
```

**CDN Build Configuration (tsup.cdn.config.ts)**:

```typescript
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['iife'],
  globalName: 'YetzirahAlpine',
  dts: false,
  splitting: false,
  sourcemap: true,
  clean: false,  // Don't clean - run after main build
  treeshake: true,
  minify: true,
  outDir: 'dist',
  outExtension: () => ({ js: '.global.js' }),
  // Bundle core, externalize Alpine (user provides it)
  external: ['alpinejs'],
  noExternal: ['@grimoire/yetzirah-core'],
  esbuildOptions(options) {
    options.footer = {
      js: `
        if (typeof window !== 'undefined' && window.Alpine) {
          document.addEventListener('alpine:init', () => {
            window.Alpine.plugin(YetzirahAlpine.default);
          });
        }
      `
    }
  }
})
```

### 4. Plugin Entry Point (src/index.ts)

```typescript
/**
 * @grimoire/yetzirah-alpine
 *
 * Alpine.js plugin for Yetzirah Web Components.
 * Provides seamless integration between Alpine.js and Yetzirah components.
 *
 * @packageDocumentation
 */

// Re-export core version for consistency
export { VERSION } from '@grimoire/yetzirah-core'

// Main plugin export
export { default, yetzirahPlugin } from './plugin'

// Type exports
export type * from './types'
```

### 5. Plugin Registration (src/plugin.ts)

```typescript
import type { Alpine, PluginCallback } from 'alpinejs'

// Import all Yetzirah core components to ensure they're registered
import '@grimoire/yetzirah-core'

/**
 * Yetzirah Alpine.js plugin.
 * 
 * Registers Yetzirah directives and magic methods with Alpine.
 * 
 * @example
 * // NPM Module Usage
 * import Alpine from 'alpinejs'
 * import yetzirah from '@grimoire/yetzirah-alpine'
 * 
 * Alpine.plugin(yetzirah)
 * Alpine.start()
 * 
 * @example
 * // CDN Usage (plugin auto-registers)
 * <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3/dist/cdn.min.js"></script>
 * <script src="https://cdn.jsdelivr.net/npm/@grimoire/yetzirah-alpine/dist/alpine-yetzirah.global.js"></script>
 */
const yetzirahPlugin: PluginCallback = (Alpine: Alpine) => {
  // Store reference to Alpine for internal use
  if (typeof window !== 'undefined') {
    (window as any).__yetzirah_alpine__ = Alpine
  }

  // Register directives (placeholder - implemented in PR-152)
  // registerDirectives(Alpine)

  // Register magic methods (placeholder - implemented in PR-154)
  // registerMagics(Alpine)

  // Auto-detect and enhance Yetzirah elements on page load
  queueMicrotask(() => {
    enhanceYetzirahElements(Alpine)
  })
}

/**
 * Auto-enhance all Yetzirah elements found in the DOM.
 * Called after Alpine initializes.
 */
function enhanceYetzirahElements(Alpine: Alpine): void {
  // Find all ytz-* elements
  const ytzElements = document.querySelectorAll('[class^="ytz-"], [class*=" ytz-"]')
  
  // Note: Full enhancement happens with directives in PR-152
  // For now, just log for debugging in development
  if (import.meta.env?.DEV) {
    console.debug(`[yetzirah-alpine] Found ${ytzElements.length} Yetzirah elements`)
  }
}

// Named export for explicit imports
export { yetzirahPlugin }

// Default export for Alpine.plugin() convenience
export default yetzirahPlugin
```

### 6. Type Definitions (src/types.ts)

```typescript
import type { Alpine, PluginCallback, DirectiveCallback, MagicUtilities } from 'alpinejs'

/**
 * Yetzirah Alpine plugin type.
 */
export type YetzirahPlugin = PluginCallback

/**
 * Alpine directive callback type with Yetzirah extensions.
 */
export type YetzirahDirectiveCallback = DirectiveCallback

/**
 * Options for x-ytz directive (implemented in PR-152).
 */
export interface XYtzOptions {
  /** Bridge event.detail.value to event.target.value */
  bridgeValue?: boolean
  /** Event types to bridge */
  events?: string[]
}

/**
 * Options for x-ytz:model directive (implemented in PR-153).
 */
export interface XYtzModelOptions {
  /** Debounce updates in milliseconds */
  debounce?: number
  /** Throttle updates in milliseconds */
  throttle?: number
  /** Custom event name to listen for */
  event?: string
}

/**
 * $ytz magic method interface (implemented in PR-154).
 */
export interface YtzMagic {
  /** Open a Dialog, Drawer, or Menu */
  open(selector: string | Element): void
  /** Close a Dialog, Drawer, or Menu */
  close(selector: string | Element): void
  /** Toggle open state */
  toggle(selector: string | Element): void
  /** Show a Snackbar with message */
  show(selector: string | Element, message?: string): void
  /** Get element by selector or return element */
  el(selector: string | Element): Element | null
}

/**
 * Yetzirah form element interface.
 * Common interface for components that emit value changes.
 */
export interface YetzirahFormElement extends HTMLElement {
  value?: unknown
  checked?: boolean
  disabled?: boolean
}

/**
 * Yetzirah dialog-like element interface.
 * Common interface for components with open/close behavior.
 */
export interface YetzirahDialogElement extends HTMLElement {
  open?: boolean
  show?(): void
  close?(): void
  toggle?(): void
}

/**
 * Extended Window interface with Yetzirah Alpine internals.
 */
declare global {
  interface Window {
    __yetzirah_alpine__?: Alpine
  }
}
```

### 7. Element Helpers (src/utils/element-helpers.ts)

```typescript
import type { YetzirahFormElement, YetzirahDialogElement } from '../types'

/**
 * Check if an element is a Yetzirah web component.
 */
export function isYetzirahElement(el: Element): boolean {
  return el.tagName.toLowerCase().startsWith('ytz-')
}

/**
 * Check if element is a Yetzirah form component (emits value changes).
 */
export function isYetzirahFormElement(el: Element): el is YetzirahFormElement {
  const formTags = ['ytz-select', 'ytz-autocomplete', 'ytz-toggle', 'ytz-slider', 'ytz-listbox']
  return formTags.includes(el.tagName.toLowerCase())
}

/**
 * Check if element is a Yetzirah dialog-like component (open/close behavior).
 */
export function isYetzirahDialogElement(el: Element): el is YetzirahDialogElement {
  const dialogTags = ['ytz-dialog', 'ytz-drawer', 'ytz-menu', 'ytz-popover', 'ytz-snackbar']
  return dialogTags.includes(el.tagName.toLowerCase())
}

/**
 * Get a Yetzirah element by selector or return the element if already an Element.
 */
export function getYetzirahElement(selectorOrElement: string | Element): Element | null {
  if (typeof selectorOrElement === 'string') {
    return document.querySelector(selectorOrElement)
  }
  return selectorOrElement
}

/**
 * Get value from a Yetzirah form element.
 * Handles different value representations across components.
 */
export function getYetzirahValue(el: YetzirahFormElement): unknown {
  const tagName = el.tagName.toLowerCase()
  
  switch (tagName) {
    case 'ytz-toggle':
      return el.hasAttribute('checked')
    case 'ytz-slider':
      return parseFloat(el.getAttribute('value') || '0')
    default:
      return el.getAttribute('value')
  }
}

/**
 * Set value on a Yetzirah form element.
 */
export function setYetzirahValue(el: YetzirahFormElement, value: unknown): void {
  const tagName = el.tagName.toLowerCase()
  
  switch (tagName) {
    case 'ytz-toggle':
      if (value) {
        el.setAttribute('checked', '')
      } else {
        el.removeAttribute('checked')
      }
      break
    default:
      if (value === null || value === undefined) {
        el.removeAttribute('value')
      } else {
        el.setAttribute('value', String(value))
      }
  }
}
```

### 8. Directive Placeholder (src/directives/index.ts)

```typescript
/**
 * Yetzirah Alpine directives.
 * 
 * Implemented in PR-152 (x-ytz), PR-153 (x-ytz:model).
 */

import type { Alpine } from 'alpinejs'

/**
 * Register all Yetzirah directives with Alpine.
 * Placeholder for PR-152 implementation.
 */
export function registerDirectives(_Alpine: Alpine): void {
  // x-ytz directive - PR-152
  // x-ytz:model directive - PR-153
}
```

### 9. Magic Placeholder (src/magics/index.ts)

```typescript
/**
 * Yetzirah Alpine magic methods.
 * 
 * Implemented in PR-154.
 */

import type { Alpine } from 'alpinejs'

/**
 * Register all Yetzirah magic methods with Alpine.
 * Placeholder for PR-154 implementation.
 */
export function registerMagics(_Alpine: Alpine): void {
  // $ytz magic - PR-154
}
```

### 10. Test Configuration (vitest.config.ts)

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    include: ['src/__tests__/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts'],
      exclude: ['src/__tests__/**', 'src/types.ts']
    }
  }
})
```

### 11. Plugin Tests (src/__tests__/plugin.test.ts)

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Alpine from 'alpinejs'
import yetzirahPlugin from '../plugin'

describe('yetzirahPlugin', () => {
  beforeEach(() => {
    // Reset Alpine state
    document.body.innerHTML = ''
    vi.clearAllMocks()
  })

  it('should be a function (PluginCallback signature)', () => {
    expect(typeof yetzirahPlugin).toBe('function')
  })

  it('should register with Alpine.plugin()', () => {
    // Should not throw
    expect(() => {
      Alpine.plugin(yetzirahPlugin)
    }).not.toThrow()
  })

  it('should store Alpine reference on window', () => {
    Alpine.plugin(yetzirahPlugin)
    expect((window as any).__yetzirah_alpine__).toBe(Alpine)
  })

  it('should export named yetzirahPlugin', async () => {
    const module = await import('../plugin')
    expect(module.yetzirahPlugin).toBe(module.default)
  })
})

describe('index exports', () => {
  it('should export VERSION from core', async () => {
    const module = await import('../index')
    expect(module.VERSION).toBeDefined()
    expect(typeof module.VERSION).toBe('string')
  })

  it('should export plugin as default', async () => {
    const module = await import('../index')
    expect(typeof module.default).toBe('function')
  })
})
```

### 12. README.md

```markdown
# @grimoire/yetzirah-alpine

Alpine.js plugin for [Yetzirah](https://github.com/grimoire-intelligence/yetzirah) Web Components.

## Installation

### NPM Module

\`\`\`bash
npm install @grimoire/yetzirah-alpine alpinejs
# or
pnpm add @grimoire/yetzirah-alpine alpinejs
\`\`\`

\`\`\`javascript
import Alpine from 'alpinejs'
import yetzirah from '@grimoire/yetzirah-alpine'

Alpine.plugin(yetzirah)
Alpine.start()
\`\`\`

### CDN (No Build Step)

\`\`\`html
<!-- Alpine.js -->
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3/dist/cdn.min.js"></script>

<!-- Yetzirah Alpine Plugin (auto-registers) -->
<script src="https://cdn.jsdelivr.net/npm/@grimoire/yetzirah-alpine/dist/alpine-yetzirah.global.js"></script>
\`\`\`

## Features

- **x-ytz** directive: Bridge Yetzirah events to Alpine
- **x-ytz:model** directive: Two-way data binding for form components
- **$ytz** magic: Imperative control of dialog-like components

## Usage

\`\`\`html
<div x-data="{ selected: null }">
  <ytz-select x-ytz:model="selected">
    <ytz-option value="a">Option A</ytz-option>
    <ytz-option value="b">Option B</ytz-option>
  </ytz-select>
  
  <p>Selected: <span x-text="selected"></span></p>
</div>
\`\`\`

## Documentation

See the [Yetzirah Alpine.js Guide](https://github.com/grimoire-intelligence/yetzirah/blob/main/docs/alpine.md) for detailed documentation.

## License

ISC
\`\`\`

---

## Files to Create

| File | Description |
|------|-------------|
| `packages/alpine/package.json` | Package configuration |
| `packages/alpine/tsconfig.json` | TypeScript configuration |
| `packages/alpine/tsup.config.ts` | Standard build config |
| `packages/alpine/tsup.cdn.config.ts` | CDN/IIFE build config |
| `packages/alpine/vitest.config.ts` | Test configuration |
| `packages/alpine/README.md` | Package documentation |
| `packages/alpine/src/index.ts` | Main entry point |
| `packages/alpine/src/plugin.ts` | Plugin registration |
| `packages/alpine/src/types.ts` | TypeScript type definitions |
| `packages/alpine/src/utils/element-helpers.ts` | Utility functions |
| `packages/alpine/src/directives/index.ts` | Directive placeholder |
| `packages/alpine/src/magics/index.ts` | Magic placeholder |
| `packages/alpine/src/__tests__/plugin.test.ts` | Plugin tests |

## Files to Modify

| File | Change |
|------|--------|
| `pnpm-workspace.yaml` | No change needed - already includes `packages/*` |

---

## Build Verification Steps

1. Run `pnpm install` from workspace root
2. Run `pnpm --filter @grimoire/yetzirah-alpine build`
3. Verify outputs in `packages/alpine/dist/`:
   - `index.js` (ESM)
   - `index.cjs` (CommonJS)
   - `index.d.ts` (TypeScript types)
4. Run `pnpm --filter @grimoire/yetzirah-alpine build:cdn`
5. Verify `packages/alpine/dist/alpine-yetzirah.global.js` exists
6. Run `pnpm --filter @grimoire/yetzirah-alpine test`
7. Verify all tests pass

---

## Acceptance Criteria Checklist

- [ ] Package builds with `pnpm build`
- [ ] Package produces ESM, CJS, and type definitions
- [ ] CDN build produces IIFE bundle
- [ ] Plugin registers with `Alpine.plugin(yetzirah)`
- [ ] Plugin auto-registers when included via CDN script
- [ ] Core Yetzirah components are imported and available
- [ ] TypeScript types exported for Alpine integration
- [ ] README documents installation and basic usage
- [ ] Tests pass for plugin registration

---

## Dependencies for Subsequent PRs

This PR creates the infrastructure for:

- **PR-152**: `x-ytz` directive implementation
  - Uses `src/directives/` structure
  - Uses `element-helpers.ts` utilities
  
- **PR-153**: `x-ytz:model` two-way binding
  - Uses `XYtzModelOptions` type
  - Uses value get/set helpers
  
- **PR-154**: `$ytz` magic methods
  - Uses `src/magics/` structure
  - Uses `YtzMagic` interface
  - Uses dialog element helpers

---

## References

- [Alpine.js Extending Documentation](https://alpinejs.dev/advanced/extending)
- [Alpine.js Plugin Template](https://github.com/markmead/alpinejs-plugin-template)
- [Alpine.js Official Plugins](https://alpinejs.dev/plugins)
- [@types/alpinejs](https://www.npmjs.com/package/@types/alpinejs)
