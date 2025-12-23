# @grimoire/yetzirah-vue

Vue 3 wrappers for Yetzirah Web Components.

## Installation

```bash
npm install @grimoire/yetzirah-vue
# or
pnpm add @grimoire/yetzirah-vue
# or
yarn add @grimoire/yetzirah-vue
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
import { YtzButton, YtzDialog } from '@grimoire/yetzirah-vue'
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
import { Button, Dialog, Select } from '@grimoire/yetzirah-vue'
```

## Available Components (Tier 1)

All Tier 1 core components are available with full Vue 3 support:

| Component | Import | v-model Support |
|-----------|--------|-----------------|
| Button | `Button` | - |
| Dialog | `Dialog` | `v-model:open` |
| Drawer | `Drawer` | `v-model:open` |
| Tabs | `Tabs`, `TabList`, `Tab`, `TabPanel` | - |
| Menu | `Menu`, `MenuItem`, `MenuTrigger` | - |
| Accordion | `Accordion`, `AccordionItem` | - |
| Disclosure | `Disclosure` | `v-model:open` |
| Tooltip | `Tooltip` | - |
| Popover | `Popover` | `v-model:open` |
| Autocomplete | `Autocomplete`, `AutocompleteOption` | `v-model` |
| Listbox | `Listbox`, `ListboxOption` | `v-model` |
| Select | `Select`, `SelectOption` | `v-model` |

### Dialog

```vue
<script setup>
import { Dialog, Button } from '@grimoire/yetzirah-vue'
import { ref } from 'vue'

const isOpen = ref(false)
</script>

<template>
  <Button @click="isOpen = true">Open Dialog</Button>

  <Dialog v-model:open="isOpen">
    <div class="pa4 bg-white br3">
      <h2>Dialog Title</h2>
      <p>Dialog content goes here.</p>
      <Button @click="isOpen = false">Close</Button>
    </div>
  </Dialog>
</template>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | `false` | v-model:open binding |
| `static` | `boolean` | `false` | Prevent backdrop dismiss |

### Select

```vue
<script setup>
import { Select, SelectOption } from '@grimoire/yetzirah-vue'
import { ref } from 'vue'

const selected = ref('')
</script>

<template>
  <Select v-model="selected" placeholder="Choose an option...">
    <SelectOption value="1">Option 1</SelectOption>
    <SelectOption value="2">Option 2</SelectOption>
    <SelectOption value="3">Option 3</SelectOption>
  </Select>
</template>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string \| string[]` | `''` | v-model binding |
| `multiple` | `boolean` | `false` | Enable multi-select |
| `disabled` | `boolean` | `false` | Disable the select |
| `placeholder` | `string` | - | Placeholder text |

### Tabs

```vue
<script setup>
import { Tabs, TabList, Tab, TabPanel } from '@grimoire/yetzirah-vue'
</script>

<template>
  <Tabs>
    <TabList>
      <Tab>Tab 1</Tab>
      <Tab>Tab 2</Tab>
      <Tab>Tab 3</Tab>
    </TabList>
    <TabPanel>Content for Tab 1</TabPanel>
    <TabPanel>Content for Tab 2</TabPanel>
    <TabPanel>Content for Tab 3</TabPanel>
  </Tabs>
</template>
```

### Menu

```vue
<script setup>
import { Menu, MenuTrigger, MenuItem, Button } from '@grimoire/yetzirah-vue'
</script>

<template>
  <Menu>
    <MenuTrigger>
      <Button>Open Menu</Button>
    </MenuTrigger>
    <MenuItem @click="handleEdit">Edit</MenuItem>
    <MenuItem @click="handleDelete">Delete</MenuItem>
  </Menu>
</template>
```

### Autocomplete

```vue
<script setup>
import { Autocomplete, AutocompleteOption } from '@grimoire/yetzirah-vue'
import { ref } from 'vue'

const value = ref('')
const options = ['Apple', 'Banana', 'Cherry', 'Date']
</script>

<template>
  <Autocomplete v-model="value" placeholder="Search fruits...">
    <AutocompleteOption
      v-for="option in options"
      :key="option"
      :value="option"
    >
      {{ option }}
    </AutocompleteOption>
  </Autocomplete>
</template>
```

## Available Components (Tier 2)

The following Tier 2 components are available with full Vue 3 support:

| Component | Import | v-model Support |
|-----------|--------|-----------------|
| Toggle | `Toggle` | `v-model:checked` |
| Chip | `Chip` | - |
| IconButton | `IconButton` | - |
| Slider | `Slider` | `v-model` |
| DataGrid | `DataGrid`, `DataGridColumn` | - |
| ThemeToggle | `ThemeToggle` | - |

## Component API

### Toggle

```vue
<script setup>
import { Toggle } from '@grimoire/yetzirah-vue'
import { ref } from 'vue'

const enabled = ref(false)
</script>

<template>
  <Toggle v-model:checked="enabled" :disabled="false" @change="(e) => console.log(e)" />
</template>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `checked` | `boolean` | `false` | v-model:checked binding |
| `disabled` | `boolean` | `false` | Disables the toggle |

| Event | Payload | Description |
|-------|---------|-------------|
| `update:checked` | `boolean` | v-model update |
| `change` | `Event` | Native change event |

### Chip

```vue
<script setup>
import { Chip } from '@grimoire/yetzirah-vue'
</script>

<template>
  <Chip deletable @delete="handleDelete">Tag Name</Chip>
</template>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `deletable` | `boolean` | `false` | Shows delete button |
| `disabled` | `boolean` | `false` | Disables the chip |

| Event | Payload | Description |
|-------|---------|-------------|
| `delete` | `Event` | Delete button clicked |

### IconButton

```vue
<script setup>
import { IconButton } from '@grimoire/yetzirah-vue'
</script>

<template>
  <IconButton aria-label="Close" tooltip="Close dialog" @click="handleClick">
    <svg><!-- icon --></svg>
  </IconButton>
</template>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `aria-label` | `string` | *required* | Accessible label |
| `tooltip` | `string` | - | Tooltip text |
| `disabled` | `boolean` | `false` | Disables the button |

### Slider

```vue
<script setup>
import { Slider } from '@grimoire/yetzirah-vue'
import { ref } from 'vue'

const volume = ref(50)
</script>

<template>
  <Slider v-model="volume" :min="0" :max="100" :step="1" />
</template>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `number` | `0` | v-model binding |
| `min` | `number` | `0` | Minimum value |
| `max` | `number` | `100` | Maximum value |
| `step` | `number` | `1` | Step increment |
| `disabled` | `boolean` | `false` | Disables the slider |

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `number` | v-model update |
| `input` | `Event` | Live value change |
| `change` | `Event` | Committed value change |

### DataGrid

```vue
<script setup>
import { DataGrid, DataGridColumn } from '@grimoire/yetzirah-vue'
import { ref } from 'vue'

const data = ref([
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' }
])
</script>

<template>
  <DataGrid :data="data" :row-height="40" @sort="handleSort" @rowselect="handleSelect">
    <DataGridColumn field="id" header="ID" :width="80" />
    <DataGridColumn field="name" header="Name" sortable />
    <DataGridColumn field="email" header="Email" />
  </DataGrid>
</template>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `any[]` | `[]` | Row data array |
| `columns` | `Column[]` | `[]` | Column definitions (alternative to children) |
| `rowHeight` | `number` | `40` | Row height in pixels |

| Event | Payload | Description |
|-------|---------|-------------|
| `sort` | `{ column, direction }` | Sort requested |
| `rowselect` | `{ row, index }` | Row selected |
| `rowactivate` | `{ row, index }` | Row double-clicked |

### ThemeToggle

```vue
<script setup>
import { ThemeToggle } from '@grimoire/yetzirah-vue'
</script>

<template>
  <ThemeToggle storage-key="my-app-theme" @themechange="(e) => console.log(e.detail)" />
</template>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `storageKey` | `string` | `'theme'` | localStorage key |
| `noPersist` | `boolean` | `false` | Disable persistence |

| Event | Payload | Description |
|-------|---------|-------------|
| `themechange` | `{ theme, isDark }` | Theme changed |

## Development

```bash
# Install dependencies
pnpm install

# Build the package
pnpm build

# Watch mode for development
pnpm dev
```

## Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run with coverage
pnpm test:coverage
```

Tests use [Vitest](https://vitest.dev/) with [@vue/test-utils](https://test-utils.vuejs.org/) and [happy-dom](https://github.com/capricorn86/happy-dom) for DOM simulation.

## TypeScript

This package includes full TypeScript definitions. The types are automatically exported and available when using TypeScript in your Vue project.

```typescript
import type { YetzirahComponentProps, ValueProps } from '@grimoire/yetzirah-vue'
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
