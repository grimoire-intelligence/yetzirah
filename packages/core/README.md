# @grimoire-intel/yetzirah

Unstyled Web Components with Material Design behavior. Zero dependencies, framework-agnostic, under 13KB gzipped.

## Installation

```bash
npm install @grimoire-intel/yetzirah
```

Or via CDN:

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@grimoire-intel/yetzirah@latest/cdn/core.js"></script>
```

## Quick Start

```html
<script type="module">
  import '@grimoire-intel/yetzirah'
</script>

<ytz-button onclick="document.getElementById('my-dialog').showModal()">
  Open Dialog
</ytz-button>

<ytz-dialog id="my-dialog">
  <div class="pa4 bg-white br3">
    <h2>Hello World</h2>
    <ytz-button onclick="this.closest('ytz-dialog').close()">Close</ytz-button>
  </div>
</ytz-dialog>
```

## Components

All 21 components, full ARIA support, zero runtime CSS.

### Dialog

Modal dialog with focus trap, scroll lock, escape-to-close, and backdrop dismiss.

```html
<ytz-dialog id="my-dialog">
  <div class="pa4 bg-white br3">
    <h2>Dialog Title</h2>
    <p>Content goes here.</p>
    <ytz-button onclick="this.closest('ytz-dialog').close()">Close</ytz-button>
  </div>
</ytz-dialog>

<script>
  const dialog = document.getElementById('my-dialog')
  dialog.showModal()           // Open
  dialog.close()               // Close
  dialog.open = true           // Also opens
  dialog.open = false          // Also closes
</script>
```

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `open` | boolean | `false` | Dialog visibility |
| `static` | boolean | `false` | Prevent backdrop dismiss |

| Event | Detail | Description |
|-------|--------|-------------|
| `close` | - | Fires when dialog closes |

### Drawer

Slide-out panel from screen edge.

```html
<ytz-drawer id="my-drawer" position="left">
  <nav class="pa4">
    <a href="/">Home</a>
    <a href="/about">About</a>
  </nav>
</ytz-drawer>
```

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `open` | boolean | `false` | Drawer visibility |
| `position` | `'left'` \| `'right'` | `'left'` | Slide-in direction |

### Tabs

Accessible tabbed interface with keyboard navigation.

```html
<ytz-tabs>
  <ytz-tab-list>
    <ytz-tab>Tab 1</ytz-tab>
    <ytz-tab>Tab 2</ytz-tab>
  </ytz-tab-list>
  <ytz-tab-panel>Content 1</ytz-tab-panel>
  <ytz-tab-panel>Content 2</ytz-tab-panel>
</ytz-tabs>
```

| Event | Detail | Description |
|-------|--------|-------------|
| `change` | `{ index, tab }` | Tab selection changed |

### Menu

Dropdown menu with keyboard navigation.

```html
<ytz-menu>
  <ytz-menu-trigger>
    <ytz-button>Actions</ytz-button>
  </ytz-menu-trigger>
  <ytz-menu-item onclick="handleEdit()">Edit</ytz-menu-item>
  <ytz-menu-item onclick="handleDelete()">Delete</ytz-menu-item>
</ytz-menu>
```

### Accordion

Collapsible content sections.

```html
<ytz-accordion>
  <ytz-accordion-item>
    <span slot="trigger">Section 1</span>
    <p>Content for section 1</p>
  </ytz-accordion-item>
  <ytz-accordion-item>
    <span slot="trigger">Section 2</span>
    <p>Content for section 2</p>
  </ytz-accordion-item>
</ytz-accordion>
```

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `multiple` | boolean | `false` | Allow multiple open items |

### Disclosure

Single collapsible section (show/hide).

```html
<ytz-disclosure>
  <span slot="trigger">Show Details</span>
  <p>Hidden content revealed on click.</p>
</ytz-disclosure>
```

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `open` | boolean | `false` | Expanded state |

### Select

Custom dropdown select with keyboard navigation.

```html
<ytz-select id="country" placeholder="Choose country...">
  <ytz-select-option value="us">United States</ytz-select-option>
  <ytz-select-option value="uk">United Kingdom</ytz-select-option>
  <ytz-select-option value="ca">Canada</ytz-select-option>
</ytz-select>
```

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `value` | string | `''` | Selected value |
| `multiple` | boolean | `false` | Multi-select mode |
| `disabled` | boolean | `false` | Disabled state |
| `placeholder` | string | - | Placeholder text |

| Event | Detail | Description |
|-------|--------|-------------|
| `change` | `{ value }` | Selection changed |

### Autocomplete

Input with suggestions dropdown.

```html
<ytz-autocomplete placeholder="Search...">
  <ytz-autocomplete-option value="apple">Apple</ytz-autocomplete-option>
  <ytz-autocomplete-option value="banana">Banana</ytz-autocomplete-option>
</ytz-autocomplete>
```

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `value` | string | `''` | Current input value |

| Event | Detail | Description |
|-------|--------|-------------|
| `input` | `{ value }` | Input changed |
| `select` | `{ value }` | Option selected |

### Listbox

Single or multi-select list.

```html
<ytz-listbox>
  <ytz-listbox-option value="1">Option 1</ytz-listbox-option>
  <ytz-listbox-option value="2">Option 2</ytz-listbox-option>
</ytz-listbox>
```

### Popover

Anchored floating content.

```html
<ytz-popover>
  <ytz-button slot="trigger">Info</ytz-button>
  <div class="pa3 bg-white shadow-2">Popover content</div>
</ytz-popover>
```

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `position` | string | `'bottom'` | Placement relative to trigger |

### Tooltip

Hover/focus tooltip.

```html
<ytz-tooltip content="Helpful information">
  <ytz-button>Hover me</ytz-button>
</ytz-tooltip>
```

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `content` | string | - | Tooltip text |
| `position` | string | `'top'` | Placement |

### Toggle

Two-state switch with checkbox semantics.

```html
<ytz-toggle id="notifications"></ytz-toggle>
<label for="notifications">Enable notifications</label>
```

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `checked` | boolean | `false` | Checked state |
| `disabled` | boolean | `false` | Disabled state |

| Event | Detail | Description |
|-------|--------|-------------|
| `change` | `{ checked }` | State changed |

### Slider

Range input with keyboard support.

```html
<ytz-slider value="50" min="0" max="100" step="1"></ytz-slider>
```

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `value` | number | `0` | Current value |
| `min` | number | `0` | Minimum |
| `max` | number | `100` | Maximum |
| `step` | number | `1` | Increment |
| `disabled` | boolean | `false` | Disabled state |

| Event | Detail | Description |
|-------|--------|-------------|
| `input` | `{ value }` | Live change during drag |
| `change` | `{ value }` | Committed change on release |

### Button

Semantic button element.

```html
<ytz-button>Click me</ytz-button>
<ytz-button disabled>Disabled</ytz-button>
```

### Chip

Deletable tag/label.

```html
<ytz-chip deletable>Category</ytz-chip>
```

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `deletable` | boolean | `false` | Show delete button |
| `disabled` | boolean | `false` | Disabled state |

| Event | Detail | Description |
|-------|--------|-------------|
| `delete` | - | Delete button clicked |

### IconButton

Icon-only button with tooltip support.

```html
<ytz-icon-button aria-label="Close" tooltip="Close dialog">
  <svg><!-- icon --></svg>
</ytz-icon-button>
```

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `aria-label` | string | *required* | Accessible label |
| `tooltip` | string | - | Tooltip text |

### DataGrid

Virtual-scrolling data table with sorting.

```html
<ytz-datagrid id="grid"></ytz-datagrid>

<script>
  const grid = document.getElementById('grid')
  grid.columns = [
    { field: 'id', header: 'ID', width: 80 },
    { field: 'name', header: 'Name', sortable: true },
    { field: 'email', header: 'Email' }
  ]
  grid.data = [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' }
  ]
</script>
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `data` | array | `[]` | Row data |
| `columns` | array | `[]` | Column definitions |
| `rowHeight` | number | `40` | Row height in pixels |

| Event | Detail | Description |
|-------|--------|-------------|
| `sort` | `{ column, direction }` | Sort requested |
| `rowselect` | `{ row, index }` | Row selected |
| `rowactivate` | `{ row, index }` | Row double-clicked |

### ThemeToggle

Dark/light mode toggle with persistence.

```html
<ytz-theme-toggle></ytz-theme-toggle>
```

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `storage-key` | string | `'theme'` | localStorage key |
| `no-persist` | boolean | `false` | Disable persistence |

| Event | Detail | Description |
|-------|--------|-------------|
| `themechange` | `{ theme, isDark }` | Theme changed |

### Snackbar

Transient notification with auto-dismiss.

```html
<ytz-snackbar id="toast" position="bottom-center" duration="5000">
  Item saved successfully
</ytz-snackbar>

<script>
  document.getElementById('toast').show()
</script>
```

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `open` | boolean | `false` | Visibility |
| `duration` | number | `5000` | Auto-dismiss ms (0 = manual) |
| `position` | string | `'bottom-center'` | Screen position |

| Event | Detail | Description |
|-------|--------|-------------|
| `close` | - | Snackbar dismissed |

### Progress

Loading indicator (circular or linear).

```html
<!-- Indeterminate (spinner) -->
<ytz-progress></ytz-progress>

<!-- Determinate (progress bar) -->
<ytz-progress value="75" variant="linear"></ytz-progress>
```

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `value` | number | - | Progress 0-100 (omit for indeterminate) |
| `variant` | `'circular'` \| `'linear'` | `'circular'` | Visual style |

### Badge

Notification dot or count overlay.

```html
<ytz-badge value="5">
  <ytz-icon-button aria-label="Notifications">
    <svg><!-- bell icon --></svg>
  </ytz-icon-button>
</ytz-badge>
```

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `value` | number | - | Count (omit for dot) |
| `max` | number | - | Maximum before "99+" display |
| `show-zero` | boolean | `false` | Show badge when value is 0 |

## Optional CSS

Animation and positioning helpers:

```js
import '@grimoire-intel/yetzirah/button.css'     // Hover/click feedback
import '@grimoire-intel/yetzirah/dialog.css'     // Overlay positioning, fade-in
import '@grimoire-intel/yetzirah/disclosure.css' // Expand/collapse animation
import '@grimoire-intel/yetzirah/dark.css'       // Dark theme support
```

## Tree-Shaking

Import only what you need:

```js
import '@grimoire-intel/yetzirah/dialog'
import '@grimoire-intel/yetzirah/button'
```

Or load individual components via CDN:

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@grimoire-intel/yetzirah@latest/cdn/dialog.js"></script>
<script type="module" src="https://cdn.jsdelivr.net/npm/@grimoire-intel/yetzirah@latest/cdn/button.js"></script>
```

## Framework Wrappers

For better framework integration, use the dedicated wrapper packages:

- **React**: `@grimoire-intel/yetzirah-react`
- **Vue**: `@grimoire-intel/yetzirah-vue`
- **Svelte**: `@grimoire-intel/yetzirah-svelte`
- **Angular**: `@grimoire-intel/yetzirah-angular`
- **Solid**: `@grimoire-intel/yetzirah-solid`
- **Alpine**: `@grimoire-intel/yetzirah-alpine`

These wrappers provide idiomatic bindings (v-model, bind:value, etc.) while using the same Web Components under the hood.

## Browser Support

All modern browsers with Web Components support:
- Chrome 67+
- Firefox 63+
- Safari 10.1+
- Edge 79+

## License

MIT
