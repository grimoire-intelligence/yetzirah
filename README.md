# Yetzirah

Unstyled, accessible Web Components with framework wrappers for React, Vue, Svelte, and Angular. Behavior and accessibility without opinionated styling.

## Installation

### Vanilla HTML (Web Components)
```bash
npm install @yetzirah/core
```

### React
```bash
npm install @yetzirah/core @yetzirah/react
```

### Vue 3
```bash
npm install @yetzirah/core @yetzirah/vue
```

### Svelte
```bash
npm install @yetzirah/core @yetzirah/svelte
```

### Angular
```bash
npm install @yetzirah/core @yetzirah/angular
```

## Philosophy

- **Unstyled by default** - You bring your own CSS (Tachyons, custom styles, etc.)
- **Accessibility first** - Full ARIA compliance, keyboard navigation built-in
- **Web Components** - Framework-agnostic core, works anywhere
- **Framework wrappers** - Idiomatic APIs for React, Vue, Svelte, and Angular
- **Tiny bundles** - Tree-shakeable, no runtime CSS-in-JS

## Components

### Tier 1 (Core)

| Component | Web Component | React | Description |
|-----------|--------------|-------|-------------|
| Button | `<ytz-button>` | `<Button>` | Polymorphic button/link |
| Dialog | `<ytz-dialog>` | `<Dialog>` | Modal dialog with focus trap |
| Drawer | `<ytz-drawer>` | `<Drawer>` | Side panel overlay |
| Tabs | `<ytz-tabs>` | `<Tabs>` | Tabbed interface |
| Menu | `<ytz-menu>` | `<Menu>` | Dropdown menu |
| Accordion | `<ytz-accordion>` | `<Accordion>` | Collapsible sections |
| Disclosure | `<ytz-disclosure>` | `<Disclosure>` | Expandable content |
| Tooltip | `<ytz-tooltip>` | `<Tooltip>` | Hover/focus tooltip |
| Popover | `<ytz-popover>` | `<Popover>` | Positioned popup |
| Autocomplete | `<ytz-autocomplete>` | `<Autocomplete>` | Filterable combobox |
| Listbox | `<ytz-listbox>` | `<Listbox>` | Keyboard-navigable list |
| Select | `<ytz-select>` | `<Select>` | Dropdown select |

### Tier 2 (Extended)

| Component | Web Component | React | Vue | Svelte | Angular | Description |
|-----------|--------------|-------|-----|--------|---------|-------------|
| Toggle | `<ytz-toggle>` | `<Toggle>` | `<Toggle>` | `<Toggle>` | `<ytz-toggle>` | Switch with checkbox semantics |
| Chip | `<ytz-chip>` | `<Chip>` | `<Chip>` | `<Chip>` | `<ytz-chip>` | Deletable tag/label |
| IconButton | `<ytz-icon-button>` | `<IconButton>` | `<IconButton>` | `<IconButton>` | `<ytz-icon-button>` | Icon-only button with tooltip |
| Slider | `<ytz-slider>` | `<Slider>` | `<Slider>` | `<Slider>` | `<ytz-slider>` | Range input with keyboard support |
| DataGrid | `<ytz-datagrid>` | `<DataGrid>` | `<DataGrid>` | `<DataGrid>` | `<ytz-datagrid>` | Virtual-scrolling data table |
| ThemeToggle | `<ytz-theme-toggle>` | `<ThemeToggle>` | `<ThemeToggle>` | `<ThemeToggle>` | `<ytz-theme-toggle>` | Dark/light mode toggle |

> **Note:** Vue, Svelte, and Angular wrappers for Tier 2 components are in development. Tier 1 framework wrappers coming in a future release.

## Usage

### Web Components (Vanilla HTML)

```html
<script type="module">
  import '@yetzirah/core'
</script>

<ytz-dialog id="my-dialog">
  <div class="pa4 bg-white br3">
    <h2>Hello World</h2>
    <ytz-button onclick="this.closest('ytz-dialog').close()">
      Close
    </ytz-button>
  </div>
</ytz-dialog>

<ytz-button onclick="document.getElementById('my-dialog').open = true">
  Open Dialog
</ytz-button>
```

### React

```jsx
import { Dialog, Button, Toggle, Slider } from '@yetzirah/react'

function App() {
  const [open, setOpen] = useState(false)
  const [enabled, setEnabled] = useState(false)
  const [volume, setVolume] = useState(50)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Dialog</Button>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <div className="pa4 bg-white br3">
          <h2>Settings</h2>

          <label className="flex items-center mb3">
            <Toggle checked={enabled} onChange={setEnabled} />
            <span className="ml2">Enable notifications</span>
          </label>

          <label className="db mb3">
            <span className="db mb2">Volume: {volume}%</span>
            <Slider value={volume} onChange={setVolume} min={0} max={100} />
          </label>

          <Button onClick={() => setOpen(false)}>Close</Button>
        </div>
      </Dialog>
    </>
  )
}
```

### Vue 3

```vue
<script setup>
import { ref } from 'vue'
import { Toggle, Slider, ThemeToggle } from '@yetzirah/vue'

const enabled = ref(false)
const volume = ref(50)
</script>

<template>
  <label class="flex items-center mb3">
    <Toggle v-model:checked="enabled" />
    <span class="ml2">Enable notifications</span>
  </label>

  <label class="db mb3">
    <span class="db mb2">Volume: {{ volume }}%</span>
    <Slider v-model="volume" :min="0" :max="100" />
  </label>

  <ThemeToggle @themechange="(e) => console.log(e.detail.theme)" />
</template>
```

### Svelte

```svelte
<script>
  import { Toggle, Slider, ThemeToggle } from '@yetzirah/svelte'

  let enabled = false
  let volume = 50
</script>

<label class="flex items-center mb3">
  <Toggle bind:checked={enabled} />
  <span class="ml2">Enable notifications</span>
</label>

<label class="db mb3">
  <span class="db mb2">Volume: {volume}%</span>
  <Slider bind:value={volume} min={0} max={100} />
</label>

<ThemeToggle on:themechange={(e) => console.log(e.detail.theme)} />
```

### Angular

```typescript
// app.component.ts
import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { Toggle, Slider, ThemeToggle } from '@yetzirah/angular'

@Component({
  standalone: true,
  imports: [FormsModule, Toggle, Slider, ThemeToggle],
  template: `
    <label class="flex items-center mb3">
      <ytz-toggle [(ngModel)]="enabled"></ytz-toggle>
      <span class="ml2">Enable notifications</span>
    </label>

    <label class="db mb3">
      <span class="db mb2">Volume: {{ volume }}%</span>
      <ytz-slider [(ngModel)]="volume" [min]="0" [max]="100"></ytz-slider>
    </label>

    <ytz-theme-toggle (themeChange)="onThemeChange($event)"></ytz-theme-toggle>
  `
})
export class AppComponent {
  enabled = false
  volume = 50

  onThemeChange(event: CustomEvent) {
    console.log(event.detail.theme)
  }
}
```

## Styling

Yetzirah components are unstyled. Use utility classes or custom CSS:

```html
<!-- Tachyons -->
<ytz-button class="ph3 pv2 br2 bn white bg-blue pointer">
  Submit
</ytz-button>

<!-- Custom CSS -->
<style>
  .my-button {
    padding: 0.5rem 1rem;
    border-radius: 4px;
    background: blue;
    color: white;
  }
</style>
<ytz-button class="my-button">Submit</ytz-button>
```

### Optional CSS

```js
// Animation and positioning helpers
import '@yetzirah/core/button.css'     // Hover/click feedback
import '@yetzirah/core/dialog.css'     // Overlay positioning, fade-in
import '@yetzirah/core/disclosure.css' // Expand/collapse animation
import '@yetzirah/core/dark.css'       // Dark theme support
```

## Dark Mode

Use the ThemeToggle component for automatic dark mode support:

```html
<link rel="stylesheet" href="@yetzirah/core/dark.css">
<ytz-theme-toggle></ytz-theme-toggle>
```

Features:
- Reads `prefers-color-scheme` on init
- Persists preference to `localStorage`
- Sets `data-theme` attribute on `<html>`
- Dispatches `themechange` events

## MUI Migration

See the [MUI Rosetta Stone](demos/rosetta.html) for a complete migration guide from Material UI to Yetzirah.

## Demos

Open any demo file directly in a browser:

- [All Components](demos/index.html)
- [Button](demos/button.html)
- [Dialog](demos/dialog.html)
- [Toggle](demos/toggle.html)
- [Chip](demos/chip.html)
- [IconButton](demos/icon-button.html)
- [Slider](demos/slider.html)
- [DataGrid](demos/datagrid.html)
- [Theme Toggle](demos/theme-toggle.html)
- [MUI Rosetta Stone](demos/rosetta.html)

## Development

```bash
pnpm install
pnpm test
pnpm build
```

## License

MIT
