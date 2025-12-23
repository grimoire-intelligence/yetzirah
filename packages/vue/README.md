# @yetzirah/vue

Vue 3 wrappers for Yetzirah Web Components.

## Installation

```bash
npm install @yetzirah/vue
# or
pnpm add @yetzirah/vue
# or
yarn add @yetzirah/vue
```

## Requirements

- Vue 3.3.0 or higher (for `defineModel` support)

## Usage

Yetzirah provides Vue 3 components that wrap the underlying Web Components with Vue-idiomatic APIs, including:

- Full TypeScript support with type definitions
- v-model support for two-way data binding
- Vue-specific event handling
- Composable integration
- Tree-shakeable imports

### Basic Example

```vue
<script setup lang="ts">
import { YtzButton, YtzDialog } from '@yetzirah/vue'
import { ref } from 'vue'

const isOpen = ref(false)
</script>

<template>
  <YtzButton @click="isOpen = true">
    Open Dialog
  </YtzButton>

  <YtzDialog v-model:open="isOpen">
    <h2>Dialog Title</h2>
    <p>Dialog content goes here.</p>
  </YtzDialog>
</template>
```

### Tree-Shaking

All components are exported as named exports, enabling tree-shaking:

```typescript
// Only imports the specific components you need
import { YtzButton, YtzDialog } from '@yetzirah/vue'
```

## Components

Components will be added in subsequent PRs. This package currently provides:

- Package infrastructure
- Shared TypeScript types
- Build configuration

Upcoming components:
- Button
- Dialog
- Disclosure
- Tooltip
- Tabs
- Menu
- Autocomplete
- Listbox
- Select
- Accordion
- Drawer
- Popover
- Toggle
- Chip
- IconButton
- Slider
- DataGrid
- ThemeToggle

## Development

```bash
# Install dependencies
pnpm install

# Build the package
pnpm build

# Watch mode for development
pnpm dev
```

## TypeScript

This package includes full TypeScript definitions. The types are automatically exported and available when using TypeScript in your Vue project.

```typescript
import type { YetzirahComponentProps, ValueProps } from '@yetzirah/vue'
```

## Architecture

The Vue wrappers are thin adapters around Yetzirah's Web Components, providing:

1. **Native Web Component Integration**: Uses Vue's custom element support
2. **v-model Support**: Two-way binding using Vue 3.3's `defineModel`
3. **Type Safety**: Full TypeScript definitions for props, events, and slots
4. **Performance**: Minimal overhead, tree-shakeable builds

## License

ISC

## Repository

[GitHub - Yetzirah](https://github.com/grimoire-intelligence/yetzirah)
