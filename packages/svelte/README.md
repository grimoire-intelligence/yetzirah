# @grimoire/yetzirah-svelte

Svelte wrappers for Yetzirah Web Components.

## Installation

```bash
pnpm add @grimoire/yetzirah-svelte @grimoire/yetzirah-core
```

## Usage

Svelte has excellent Web Component support out of the box. These wrappers provide:
- TypeScript definitions
- Svelte-idiomatic component APIs
- Reactive property bindings

### Direct Web Component Usage

You can use Yetzirah Web Components directly in Svelte:

```svelte
<script>
  import '@grimoire/yetzirah-core/button'
</script>

<ytz-button on:click={() => console.log('clicked')}>
  Click me
</ytz-button>
```

### Using Svelte Wrappers

Or use the Svelte wrappers for better type safety:

```svelte
<script>
  import { Button } from '@grimoire/yetzirah-svelte'
</script>

<Button on:click={() => console.log('clicked')}>
  Click me
</Button>
```

## Why Thin Wrappers?

Svelte's compiler has first-class Web Component support:
- Automatic event forwarding
- Two-way data binding with custom elements
- No runtime overhead

Our wrappers are intentionally minimal, primarily providing TypeScript definitions and following Svelte conventions.

## Available Components (Tier 2)

The following Tier 2 components are available with Svelte-idiomatic bindings:

| Component | Import | Binding Support |
|-----------|--------|-----------------|
| Toggle | `Toggle` | `bind:checked` |
| Chip | `Chip` | - |
| IconButton | `IconButton` | - |
| Slider | `Slider` | `bind:value` |
| DataGrid | `DataGrid`, `DataGridColumn` | - |
| ThemeToggle | `ThemeToggle` | - |

## Component API

### Toggle

```svelte
<script>
  import { Toggle } from '@grimoire/yetzirah-svelte'
  let enabled = false
</script>

<Toggle bind:checked={enabled} disabled={false} on:change={(e) => console.log(e)} />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `checked` | `boolean` | `false` | Two-way bindable checked state |
| `disabled` | `boolean` | `false` | Disables the toggle |

| Event | Detail | Description |
|-------|--------|-------------|
| `change` | `Event` | Fires when checked state changes |

### Chip

```svelte
<script>
  import { Chip } from '@grimoire/yetzirah-svelte'
</script>

<Chip deletable on:delete={() => console.log('deleted')}>Tag Name</Chip>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `deletable` | `boolean` | `false` | Shows delete button |
| `disabled` | `boolean` | `false` | Disables the chip |

| Event | Detail | Description |
|-------|--------|-------------|
| `delete` | `Event` | Delete button clicked |

### IconButton

```svelte
<script>
  import { IconButton } from '@grimoire/yetzirah-svelte'
</script>

<IconButton aria-label="Close" tooltip="Close dialog" on:click={() => console.log('clicked')}>
  <svg><!-- icon --></svg>
</IconButton>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `aria-label` | `string` | *required* | Accessible label |
| `tooltip` | `string` | - | Tooltip text |
| `disabled` | `boolean` | `false` | Disables the button |

### Slider

```svelte
<script>
  import { Slider } from '@grimoire/yetzirah-svelte'
  let volume = 50
</script>

<Slider bind:value={volume} min={0} max={100} step={1} />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | `0` | Two-way bindable value |
| `min` | `number` | `0` | Minimum value |
| `max` | `number` | `100` | Maximum value |
| `step` | `number` | `1` | Step increment |
| `disabled` | `boolean` | `false` | Disables the slider |

| Event | Detail | Description |
|-------|--------|-------------|
| `input` | `Event` | Live value change during drag |
| `change` | `Event` | Committed value change on release |

### DataGrid

```svelte
<script>
  import { DataGrid, DataGridColumn } from '@grimoire/yetzirah-svelte'

  const data = [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' }
  ]
</script>

<DataGrid {data} rowHeight={40} on:sort={(e) => console.log(e.detail)} on:rowselect={(e) => console.log(e.detail)}>
  <DataGridColumn field="id" header="ID" width={80} />
  <DataGridColumn field="name" header="Name" sortable />
  <DataGridColumn field="email" header="Email" />
</DataGrid>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `any[]` | `[]` | Row data array |
| `columns` | `Column[]` | `[]` | Column definitions (alternative to children) |
| `rowHeight` | `number` | `40` | Row height in pixels |

| Event | Detail | Description |
|-------|--------|-------------|
| `sort` | `{ column, direction }` | Sort requested |
| `rowselect` | `{ row, index }` | Row selected |
| `rowactivate` | `{ row, index }` | Row double-clicked |

### ThemeToggle

```svelte
<script>
  import { ThemeToggle } from '@grimoire/yetzirah-svelte'
</script>

<ThemeToggle storageKey="my-app-theme" on:themechange={(e) => console.log(e.detail)} />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `storageKey` | `string` | `'theme'` | localStorage key (maps to storage-key) |
| `noPersist` | `boolean` | `false` | Disable persistence (maps to no-persist) |

| Event | Detail | Description |
|-------|--------|-------------|
| `themechange` | `{ theme, isDark }` | Theme changed |

## Development

```bash
# Build the package
pnpm build

# Watch for changes
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

Tests use [Vitest](https://vitest.dev/) with [@testing-library/svelte](https://testing-library.com/docs/svelte-testing-library/intro/) and [happy-dom](https://github.com/capricorn86/happy-dom) for DOM simulation.

## License

ISC
