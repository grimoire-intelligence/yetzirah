# @grimoire/yetzirah-alpine

Alpine.js plugin for Yetzirah Web Components.

## Installation

```bash
npm install @grimoire/yetzirah-alpine
# or
pnpm add @grimoire/yetzirah-alpine
# or
yarn add @grimoire/yetzirah-alpine
```

## Requirements

- Alpine.js 3.0 or higher

## Usage

Register the plugin with Alpine before calling `Alpine.start()`:

```js
import Alpine from 'alpinejs'
import { yetzirahPlugin } from '@grimoire/yetzirah-alpine'

Alpine.plugin(yetzirahPlugin)
Alpine.start()
```

### Basic Example

```html
<div x-data="{ dialogOpen: false, volume: 50 }">
  <ytz-button @click="dialogOpen = true">Open Settings</ytz-button>

  <ytz-dialog x-ytz-dialog="dialogOpen">
    <h2>Settings</h2>
    <ytz-slider x-ytz-slider="volume"></ytz-slider>
    <p>Volume: <span x-text="volume"></span></p>
    <ytz-button @click="dialogOpen = false">Close</ytz-button>
  </ytz-dialog>
</div>
```

### Using $ytz Magic

The plugin provides a `$ytz` magic for programmatic component control:

```html
<div x-data>
  <ytz-button @click="$ytz.open('#my-dialog')">Open Dialog</ytz-button>
  <ytz-button @click="$ytz.toggleTheme()">Toggle Theme</ytz-button>

  <ytz-dialog id="my-dialog">
    <p>Dialog content</p>
    <ytz-button @click="$ytz.close('#my-dialog')">Close</ytz-button>
  </ytz-dialog>
</div>
```

## Directives Reference

The plugin registers directives for two-way binding with Yetzirah components.

### Component Directives

| Directive | Component | Synced Attribute | Events |
|-----------|-----------|------------------|--------|
| `x-ytz-dialog` | `<ytz-dialog>` | `open` | `close` |
| `x-ytz-drawer` | `<ytz-drawer>` | `open` | `close` |
| `x-ytz-tabs` | `<ytz-tabs>` | `default-tab` | `change` |
| `x-ytz-toggle` | `<ytz-toggle>` | `checked` | `change` |
| `x-ytz-slider` | `<ytz-slider>` | `value` | `change` |
| `x-ytz-select` | `<ytz-select>` | `value` | `change` |
| `x-ytz-disclosure` | `<ytz-disclosure>` | `open` | `toggle` |
| `x-ytz-accordion-item` | `<ytz-accordion-item>` | `open` | `toggle` |
| `x-ytz-popover` | `<ytz-popover>` | `open` | `toggle` |
| `x-ytz-autocomplete` | `<ytz-autocomplete>` | `value` | `input`, `select` |
| `x-ytz-listbox` | `<ytz-listbox>` | `value` | `change` |
| `x-ytz-menu` | `<ytz-menu>` | `open` | `close` |
| `x-ytz-progress` | `<ytz-progress>` | `value` | - |
| `x-ytz-snackbar` | `<ytz-snackbar>` | `open` | `close` |
| `x-ytz-chip` | `<ytz-chip>` | - | `remove` |
| `x-ytz-badge` | `<ytz-badge>` | `count` | - |
| `x-ytz-init` | Any | - | `ytz:ready` |

### Directive Modifiers

| Modifier | Description | Supported Directives |
|----------|-------------|---------------------|
| `.once` | Only sync initial value, no reactive updates | All directives |
| `.lazy` | Debounce updates (150ms) | `x-ytz-slider`, `x-ytz-autocomplete` |
| `.number` | Coerce value to number | `x-ytz-slider`, `x-ytz-progress`, `x-ytz-badge` |

### Examples

#### Dialog

```html
<div x-data="{ isOpen: false }">
  <ytz-button @click="isOpen = true">Open</ytz-button>
  <ytz-dialog x-ytz-dialog="isOpen">
    <p>Dialog content</p>
  </ytz-dialog>
</div>
```

#### Toggle

```html
<div x-data="{ enabled: false }">
  <ytz-toggle x-ytz-toggle="enabled"></ytz-toggle>
  <span x-text="enabled ? 'On' : 'Off'"></span>
</div>
```

#### Slider with Modifiers

```html
<div x-data="{ volume: 50 }">
  <!-- Debounce updates and ensure numeric value -->
  <ytz-slider x-ytz-slider.lazy.number="volume"></ytz-slider>
  <span x-text="volume"></span>
</div>
```

#### Tabs

```html
<div x-data="{ activeTab: 'tab-1' }">
  <ytz-tabs x-ytz-tabs="activeTab">
    <ytz-tab-list>
      <ytz-tab value="tab-1">Tab 1</ytz-tab>
      <ytz-tab value="tab-2">Tab 2</ytz-tab>
    </ytz-tab-list>
    <ytz-tab-panel value="tab-1">Content 1</ytz-tab-panel>
    <ytz-tab-panel value="tab-2">Content 2</ytz-tab-panel>
  </ytz-tabs>
</div>
```

#### Init Callback

```html
<div x-data="{ ready: false }">
  <ytz-slider x-ytz-init="ready = true"></ytz-slider>
  <span x-show="ready">Slider is ready!</span>
</div>
```

## x-ytz:model Directive

The `x-ytz:model` directive provides unified two-way binding that auto-detects the component type:

```html
<div x-data="{ volume: 50, enabled: false, query: '' }">
  <!-- Auto-detects ytz-slider, binds to value -->
  <ytz-slider x-ytz:model="volume"></ytz-slider>

  <!-- Auto-detects ytz-toggle, binds to checked -->
  <ytz-toggle x-ytz:model="enabled"></ytz-toggle>

  <!-- Auto-detects ytz-autocomplete, binds to value -->
  <ytz-autocomplete x-ytz:model="query"></ytz-autocomplete>
</div>
```

### Supported Components

| Component | Bound Attribute | Events Listened |
|-----------|-----------------|-----------------|
| `ytz-slider` | `value` | `change` |
| `ytz-select` | `value` | `change` |
| `ytz-toggle` | `checked` | `change` |
| `ytz-autocomplete` | `value` | `input`, `select` |
| `ytz-listbox` | `value` | `change` |
| `ytz-dialog` | `open` | `close` |
| `ytz-drawer` | `open` | `close` |
| `ytz-disclosure` | `open` | `toggle` |
| `ytz-popover` | `open` | `toggle` |
| `ytz-accordion-item` | `open` | `toggle` |
| `ytz-tabs` | `default-tab` | `change` |
| `ytz-progress` | `value` | - |
| `ytz-badge` | `count` | - |
| `ytz-snackbar` | `open` | `close` |
| `ytz-menu` | `open` | `close` |

### Modifiers

| Modifier | Description |
|----------|-------------|
| `.lazy` | Debounce updates (150ms) |
| `.number` | Coerce value to number |
| `.trim` | Trim whitespace from string values |

```html
<!-- Debounced slider updates -->
<ytz-slider x-ytz:model.lazy="volume"></ytz-slider>

<!-- Trimmed autocomplete input -->
<ytz-autocomplete x-ytz:model.trim="query"></ytz-autocomplete>

<!-- Multiple modifiers -->
<ytz-slider x-ytz:model.lazy.number="volume"></ytz-slider>
```

## $ytz Magic Methods

The `$ytz` magic provides utilities for programmatic component control.

### Methods

| Method | Description |
|--------|-------------|
| `open(target)` | Open a dialog, drawer, menu, or popover |
| `close(target)` | Close a component |
| `toggle(target)` | Toggle component open state |
| `show(target, message?)` | Show a snackbar, optionally with a message |
| `snackbar(message, options?)` | Create and show a programmatic snackbar |
| `openDialog(target)` | Open a dialog (alias) |
| `closeDialog(target)` | Close a dialog (alias) |
| `openDrawer(target)` | Open a drawer (alias) |
| `closeDrawer(target)` | Close a drawer (alias) |
| `getTheme()` | Get current theme ('light' or 'dark') |
| `setTheme(theme)` | Set theme to 'light' or 'dark' |
| `toggleTheme()` | Toggle between light and dark theme |

### Usage Examples

```html
<div x-data>
  <!-- Open/close by selector -->
  <ytz-button @click="$ytz.open('#my-dialog')">Open</ytz-button>
  <ytz-button @click="$ytz.close('#my-dialog')">Close</ytz-button>
  <ytz-button @click="$ytz.toggle('#my-drawer')">Toggle Drawer</ytz-button>

  <!-- Theme control -->
  <ytz-button @click="$ytz.toggleTheme()">Toggle Theme</ytz-button>
  <span x-text="$ytz.getTheme()"></span>

  <!-- Programmatic snackbar -->
  <ytz-button @click="$ytz.snackbar('Item saved!', { duration: 3000 })">
    Save
  </ytz-button>

  <!-- Show existing snackbar with message -->
  <ytz-button @click="$ytz.show('#notification', 'New message!')">
    Notify
  </ytz-button>

  <ytz-dialog id="my-dialog">...</ytz-dialog>
  <ytz-drawer id="my-drawer">...</ytz-drawer>
  <ytz-snackbar id="notification"></ytz-snackbar>
</div>
```

### Snackbar Options

```typescript
interface SnackbarOptions {
  duration?: number // Auto-dismiss time in ms
  position?: 'top' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}
```

## Configuration

### Custom Prefix

Use a custom directive prefix instead of the default `ytz`:

```js
Alpine.plugin((Alpine) => yetzirahPlugin(Alpine, { prefix: 'custom' }))
```

This registers directives as `x-custom-dialog`, `x-custom:model`, etc.

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

Tests use [Vitest](https://vitest.dev/) with happy-dom for DOM simulation.

## TypeScript

This package includes full TypeScript definitions:

```typescript
import type { YtzMagic, SnackbarOptions, YetzirahAlpineOptions } from '@grimoire/yetzirah-alpine'
```

## Architecture

The Alpine plugin provides three integration layers:

1. **Component Directives** (`x-ytz-*`): Individual directives for each component type with specific attribute and event bindings.

2. **Model Directive** (`x-ytz:model`): Unified two-way binding that auto-detects the component type and applies appropriate bindings.

3. **Magic Methods** (`$ytz`): Programmatic utilities for controlling components from Alpine expressions.

### How Directives Work

Directives use Alpine's reactive system:
- `effect()` - Syncs Alpine state to component attributes
- Event listeners - Sync component events back to Alpine state
- `cleanup()` - Removes event listeners when component is destroyed

```js
// Simplified directive implementation
Alpine.directive('ytz-dialog', (el, { expression }, { evaluate, effect, cleanup }) => {
  // Sync state → attribute
  effect(() => {
    const isOpen = evaluate(expression)
    if (isOpen) el.setAttribute('open', '')
    else el.removeAttribute('open')
  })

  // Sync event → state
  const handler = () => Alpine.evaluate(el, `${expression} = false`)
  el.addEventListener('close', handler)
  cleanup(() => el.removeEventListener('close', handler))
})
```

## License

ISC

## Repository

[GitHub - Yetzirah](https://github.com/grimoire-intelligence/yetzirah)
