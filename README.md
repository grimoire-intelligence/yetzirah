# Yetzirah

**AI is going to write your frontend. This is the component library for that.**

A single MUI icon is 16KB gzipped. Yetzirah is under 15KB. Twenty-one components, full ARIA, no runtime CSS.

Your AI reads the whole thing—every component, every prop, every implementation detail. No hallucinated APIs. No guessing.

When something's wrong? The output is `bg-blue white ph3 pv2 br2`, not a theme object four levels deep.

**One library. React, Vue, Svelte, Angular, Solid, Alpine, vanilla HTML.**

---

## Who's This For?

**MUI refugees.** Same components, fraction of the bundle.
**AI-first teams.** Haiku gets it right.
**Multi-framework shops.** One library, every framework.
**Low-bandwidth apps.** Under 15KB on the wire.

### Alternatives

| | MUI | Radix | Shoelace | Yetzirah |
|---|-----|-------|----------|----------|
| Size | >250KB | >40KB | >75KB | <15KB |
| Frameworks | React | React | All | All |
| AI-ready | ✗ | partial | partial | ✓ |

---

## Why Unstyled?

Your AI writes the styles. That's the point.

Themed libraries force your AI to learn theme objects, design tokens, and `sx` props. When it hallucinates, you're debugging JavaScript. Yetzirah components are bare behavior—your AI writes `bg-blue white ph3 pv2 br2`. When it's wrong, you change a class name.

We recommend [Tachyons](https://tachyons.io/)—close enough to raw CSS that even Haiku gets it right, small enough to fit in any context window.

**Want consistent styling across AI sessions?** Put your conventions in `AGENTS.md`. Plain text, read once, applied everywhere. Zero runtime cost.

### Example: Button Conventions for AGENTS.md

```markdown
Use Tachyons classes based on button intent:

| Intent | Classes | Hover |
|--------|---------|-------|
| Primary | `bg-blue white bn ph3 pv2 br2 pointer` | `hover-bg-dark-blue` |
| Secondary | `bg-transparent blue ba b--blue ph3 pv2 br2 pointer` | `hover-bg-lightest-blue` |
| Destructive | `bg-dark-red white bn ph3 pv2 br2 pointer` | `hover-bg-red` |
| Disabled | Add `o-50 not-allowed` to any variant | — |
```

---

## Quick Start

One script tag. No npm. No build step. Working components in 10 seconds:

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@grimoire/yetzirah-core@latest/cdn/core.js"></script>

<ytz-dialog id="my-dialog">
  <div class="dialog-content">
    <h2>Hello World</h2>
    <ytz-button onclick="this.closest('ytz-dialog').close()">Close</ytz-button>
  </div>
</ytz-dialog>

<ytz-button onclick="document.getElementById('my-dialog').showModal()">
  Open Dialog
</ytz-button>
```

## Installation

### React (18+)
```bash
npm install @grimoire/yetzirah-react
```

### Vue (3.3+)
```bash
npm install @grimoire/yetzirah-vue
```
> Requires Vue 3.3+ for `defineModel` support

### Svelte (4+)
```bash
npm install @grimoire/yetzirah-svelte
```
> Supports Svelte 4 and 5

### Angular (16+)
```bash
npm install @grimoire/yetzirah-angular
```
> Requires Angular 16+ for standalone components

### Solid
```bash
npm install @grimoire/yetzirah-solid
```
> Primitive wrappers with reactive props

### Alpine
```bash
npm install @grimoire/yetzirah-alpine
```
> Directives for `x-model` binding and attribute sync

### Vanilla HTML (Web Components)
```bash
npm install @grimoire/yetzirah-core
```
> Framework packages automatically include the core, so you only need to install `@grimoire/yetzirah-core` directly when using vanilla HTML without a framework.

### No Wrapper Needed

These frameworks have excellent Web Component interop and work with Yetzirah out of the box:

| Framework | Notes |
|-----------|-------|
| **Lit** | Built on Web Components—Yetzirah elements compose naturally |
| **HTMX** | HTML-centric; Yetzirah elements work like any HTML element |
| **Stencil** | Web Components compiler; native interop with `<ytz-*>` elements |

Just import `@grimoire/yetzirah-core` and use the elements directly.

## Philosophy

- **AI-native** - Entire codebase fits in one context window for cheaper, faster AI-assisted development
- **Unstyled by default** - You bring your own CSS (Tachyons, custom styles, etc.)
- **Accessibility first** - Full ARIA compliance, keyboard navigation built-in
- **Web Components** - Framework-agnostic core, works anywhere
- **Framework wrappers** - Idiomatic APIs for React, Vue, Svelte, Angular, Solid, and Alpine
- **Tiny bundles** - Tree-shakeable, no runtime CSS-in-JS

## AI Economics

MUI requires expensive models. Its API surface is massive, version-dependent, and offers multiple patterns—`sx`, `styled()`, theme overrides, component slots. Your AI guesses which one your codebase uses.

Yetzirah works with cheap models. The entire framework is ground truth, not training data fragments. One way to do things. Haiku gets it right.

**Model pricing (December 2025):**

| Model | Input/1M | Output/1M |
|-------|----------|-----------|
| Claude Haiku 3 | $0.25 | $1.25 |
| GPT-4.1-mini | $0.40 | $1.60 |
| Claude Sonnet 4.5 | $3.00 | $15.00 |
| Claude Opus 4.5 | $5.00 | $25.00 |

**Daily cost for frontend work (~500K input, ~100K output):**

| Stack | Model Required | Daily Cost |
|-------|----------------|------------|
| MUI + Tailwind | Sonnet / Opus | $2–4 |
| Yetzirah + Tachyons | Haiku / 4.1-mini | $0.15–0.30 |

**Annual savings per developer: $500–1,000**

Beyond cost: cheap models respond faster. Lower token counts mean longer conversations before context overflow. Predictable outputs mean less time debugging AI mistakes.

MUI can't shrink. Tailwind keeps growing. They're locked into expensive models. Yetzirah fits in the *cheap* context.

## Bundle Sizes

| Package | Gzipped |
|---------|---------|
| **@grimoire/yetzirah-core** (CDN) | 12.73 KB |
| @grimoire/yetzirah-react | 2.53 KB |
| @grimoire/yetzirah-vue | 3.91 KB |
| @grimoire/yetzirah-svelte | 0.51 KB |
| @grimoire/yetzirah-angular | 11.69 KB |
| @grimoire/yetzirah-solid | 3.48 KB |
| @grimoire/yetzirah-alpine | 2.41 KB |

Individual components range from 0.50 KB (button) to 3.01 KB (datagrid) gzipped.

## Components

| Component | Web Component | React | Vue | Svelte | Angular | Solid | Alpine |
|-----------|--------------|-------|-----|--------|---------|-------|--------|
| Accordion | `<ytz-accordion>` | `<Accordion>` | `<Accordion>` | `<Accordion>` | `<ytz-accordion>` | `<Accordion>` | `<ytz-accordion>` |
| Autocomplete | `<ytz-autocomplete>` | `<Autocomplete>` | `<Autocomplete>` | `<Autocomplete>` | `<ytz-autocomplete>` | `<Autocomplete>` | `<ytz-autocomplete>` |
| Badge | `<ytz-badge>` | `<Badge>` | `<Badge>` | `<Badge>` | `<ytz-badge>` | `<Badge>` | `<ytz-badge>` |
| Button | `<ytz-button>` | `<Button>` | `<Button>` | `<Button>` | `<ytz-button>` | `<Button>` | `<ytz-button>` |
| Chip | `<ytz-chip>` | `<Chip>` | `<Chip>` | `<Chip>` | `<ytz-chip>` | `<Chip>` | `<ytz-chip>` |
| DataGrid | `<ytz-datagrid>` | `<DataGrid>` | `<DataGrid>` | `<DataGrid>` | `<ytz-datagrid>` | `<DataGrid>` | `<ytz-datagrid>` |
| Dialog | `<ytz-dialog>` | `<Dialog>` | `<Dialog>` | `<Dialog>` | `<ytz-dialog>` | `<Dialog>` | `<ytz-dialog>` |
| Disclosure | `<ytz-disclosure>` | `<Disclosure>` | `<Disclosure>` | `<Disclosure>` | `<ytz-disclosure>` | `<Disclosure>` | `<ytz-disclosure>` |
| Drawer | `<ytz-drawer>` | `<Drawer>` | `<Drawer>` | `<Drawer>` | `<ytz-drawer>` | `<Drawer>` | `<ytz-drawer>` |
| IconButton | `<ytz-icon-button>` | `<IconButton>` | `<IconButton>` | `<IconButton>` | `<ytz-icon-button>` | `<IconButton>` | `<ytz-icon-button>` |
| Listbox | `<ytz-listbox>` | `<Listbox>` | `<Listbox>` | `<Listbox>` | `<ytz-listbox>` | `<Listbox>` | `<ytz-listbox>` |
| Menu | `<ytz-menu>` | `<Menu>` | `<Menu>` | `<Menu>` | `<ytz-menu>` | `<Menu>` | `<ytz-menu>` |
| Popover | `<ytz-popover>` | `<Popover>` | `<Popover>` | `<Popover>` | `<ytz-popover>` | `<Popover>` | `<ytz-popover>` |
| Progress | `<ytz-progress>` | `<Progress>` | `<Progress>` | `<Progress>` | `<ytz-progress>` | `<Progress>` | `<ytz-progress>` |
| Select | `<ytz-select>` | `<Select>` | `<Select>` | `<Select>` | `<ytz-select>` | `<Select>` | `<ytz-select>` |
| Slider | `<ytz-slider>` | `<Slider>` | `<Slider>` | `<Slider>` | `<ytz-slider>` | `<Slider>` | `<ytz-slider>` |
| Snackbar | `<ytz-snackbar>` | `<Snackbar>` | `<Snackbar>` | `<Snackbar>` | `<ytz-snackbar>` | `<Snackbar>` | `<ytz-snackbar>` |
| Tabs | `<ytz-tabs>` | `<Tabs>` | `<Tabs>` | `<Tabs>` | `<ytz-tabs>` | `<Tabs>` | `<ytz-tabs>` |
| ThemeToggle | `<ytz-theme-toggle>` | `<ThemeToggle>` | `<ThemeToggle>` | `<ThemeToggle>` | `<ytz-theme-toggle>` | `<ThemeToggle>` | `<ytz-theme-toggle>` |
| Toggle | `<ytz-toggle>` | `<Toggle>` | `<Toggle>` | `<Toggle>` | `<ytz-toggle>` | `<Toggle>` | `<ytz-toggle>` |
| Tooltip | `<ytz-tooltip>` | `<Tooltip>` | `<Tooltip>` | `<Tooltip>` | `<ytz-tooltip>` | `<Tooltip>` | `<ytz-tooltip>` |

## Usage

### Web Components (Vanilla HTML)

```html
<script type="module">
  import '@grimoire/yetzirah-core'
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
import { Dialog, Button, Toggle, Slider } from '@grimoire/yetzirah-react'

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
import { Toggle, Slider, ThemeToggle } from '@grimoire/yetzirah-vue'

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
  import { Toggle, Slider, ThemeToggle } from '@grimoire/yetzirah-svelte'

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
import { Toggle, Slider, ThemeToggle } from '@grimoire/yetzirah-angular'

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

### Solid

```tsx
import { createSignal } from 'solid-js'
import { Toggle, Slider, ThemeToggle } from '@grimoire/yetzirah-solid'

function App() {
  const [enabled, setEnabled] = createSignal(false)
  const [volume, setVolume] = createSignal(50)

  return (
    <>
      <label class="flex items-center mb3">
        <Toggle checked={enabled()} onChange={setEnabled} />
        <span class="ml2">Enable notifications</span>
      </label>

      <label class="db mb3">
        <span class="db mb2">Volume: {volume()}%</span>
        <Slider value={volume()} onChange={setVolume} min={0} max={100} />
      </label>

      <ThemeToggle onThemeChange={(e) => console.log(e.detail.theme)} />
    </>
  )
}
```

### Alpine

```html
<script type="module">
  import Alpine from 'alpinejs'
  import { yetzirahPlugin } from '@grimoire/yetzirah-alpine'

  Alpine.plugin(yetzirahPlugin)
  Alpine.start()
</script>

<div x-data="{ enabled: false, volume: 50 }">
  <label class="flex items-center mb3">
    <ytz-toggle x-ytz:model="enabled"></ytz-toggle>
    <span class="ml2">Enable notifications</span>
  </label>

  <label class="db mb3">
    <span class="db mb2">Volume: <span x-text="volume"></span>%</span>
    <ytz-slider x-ytz:model="volume" min="0" max="100"></ytz-slider>
  </label>

  <ytz-theme-toggle @themechange="console.log($event.detail.theme)"></ytz-theme-toggle>
</div>
```

## Styling

### Material-style Buttons

```html
<ytz-button class="ph3 pv2 br2 bn white bg-blue pointer shadow-1 hover-shadow-2">
  Submit
</ytz-button>

<ytz-button class="ph3 pv2 br2 ba b--blue blue bg-transparent pointer">
  Cancel
</ytz-button>
```

See the [MUI Rosetta Stone](demos/rosetta.html) for a complete guide to replicating Material Design with Tachyons. For anything Tachyons doesn't cover, your AI knows how to write CSS.

### Optional CSS

```js
// Animation and positioning helpers
import '@grimoire/yetzirah-core/button.css'     // Hover/click feedback
import '@grimoire/yetzirah-core/dialog.css'     // Overlay positioning, fade-in
import '@grimoire/yetzirah-core/disclosure.css' // Expand/collapse animation
import '@grimoire/yetzirah-core/dark.css'       // Dark theme support
```

## Dark Mode

Use the ThemeToggle component for automatic dark mode support:

```html
<link rel="stylesheet" href="@grimoire/yetzirah-core/dark.css">
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
- [CDN Demo](demos/cdn/index.html) - All components loaded via CDN
- [Import Map Demo](demos/cdn/importmap.html) - npm-like imports without build step
- [Button](demos/button.html)
- [Dialog](demos/dialog.html)
- [Toggle](demos/toggle.html)
- [Chip](demos/chip.html)
- [IconButton](demos/icon-button.html)
- [Slider](demos/slider.html)
- [DataGrid](demos/datagrid.html)
- [Theme Toggle](demos/theme-toggle.html)
- [MUI Rosetta Stone](demos/rosetta.html)

## Component API Reference

### Toggle

Two-state switch with checkbox semantics.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `checked` | `boolean` | `false` | Current checked state |
| `disabled` | `boolean` | `false` | Disables the toggle |

| Event | Detail | Description |
|-------|--------|-------------|
| `change` | `{ checked: boolean }` | Fires when checked state changes |

**Framework bindings:**
- **Vue:** `v-model:checked`
- **Svelte:** `bind:checked`
- **Angular:** `[(ngModel)]` with `ControlValueAccessor`

### Chip

Deletable tag/label component.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `deletable` | `boolean` | `false` | Shows delete button |
| `disabled` | `boolean` | `false` | Disables the chip |

| Event | Detail | Description |
|-------|--------|-------------|
| `delete` | - | Fires when delete button clicked |

### IconButton

Icon-only button with tooltip support.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `aria-label` | `string` | *required* | Accessible label |
| `tooltip` | `string` | - | Tooltip text |
| `disabled` | `boolean` | `false` | Disables the button |

### Slider

Range input with keyboard support.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | `0` | Current value |
| `min` | `number` | `0` | Minimum value |
| `max` | `number` | `100` | Maximum value |
| `step` | `number` | `1` | Step increment |
| `disabled` | `boolean` | `false` | Disables the slider |

| Event | Detail | Description |
|-------|--------|-------------|
| `input` | `{ value: number }` | Fires during drag (live) |
| `change` | `{ value: number }` | Fires on release (committed) |

**Framework bindings:**
- **Vue:** `v-model`
- **Svelte:** `bind:value`
- **Angular:** `[(ngModel)]` with `ControlValueAccessor`

### DataGrid

Virtual-scrolling data table with sorting.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `any[]` | `[]` | Array of row data objects |
| `columns` | `Column[]` | `[]` | Column definitions |
| `rowHeight` | `number` | `40` | Height of each row in pixels |

| Event | Detail | Description |
|-------|--------|-------------|
| `sort` | `{ column: string, direction: 'asc' \| 'desc' }` | Column sort requested |
| `rowselect` | `{ row: any, index: number }` | Row selected |
| `rowactivate` | `{ row: any, index: number }` | Row double-clicked |

### ThemeToggle

Dark/light mode toggle with persistence.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `storage-key` | `string` | `'theme'` | localStorage key |
| `no-persist` | `boolean` | `false` | Disable localStorage persistence |

| Event | Detail | Description |
|-------|--------|-------------|
| `themechange` | `{ theme: 'light' \| 'dark', isDark: boolean }` | Theme changed |

## Testing

### Run All Tests

```bash
pnpm test
```

### Framework-Specific Tests

```bash
# Vue tests
pnpm --filter @grimoire/yetzirah-vue test

# Svelte tests
pnpm --filter @grimoire/yetzirah-svelte test

# Angular tests
pnpm --filter @grimoire/yetzirah-angular test

# React tests
pnpm --filter @grimoire/yetzirah-react test

# Core tests
pnpm --filter @grimoire/yetzirah-core test
```

### Watch Mode

```bash
# Run tests in watch mode
pnpm test:watch
```

## Development

```bash
pnpm install
pnpm test
pnpm build
```

## The Name

*Yetzirah* — In Kabbalah, the world of formation. Where fundamental elements first take shape. Below it is raw potential; above it, finished forms.

Yetzirah is the smallest meaningful layer of UI abstraction. Below this, you're writing vanilla JavaScript. At this layer, you're working with the elements themselves.

## License

MIT
