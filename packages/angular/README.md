# @grimoire/yetzirah-angular

Angular wrappers for Yetzirah Web Components - bringing Material Design behavior patterns to Angular 16+.

## Installation

```bash
npm install @grimoire/yetzirah-angular @grimoire/yetzirah-core
# or
pnpm add @grimoire/yetzirah-angular @grimoire/yetzirah-core
# or
yarn add @grimoire/yetzirah-angular @grimoire/yetzirah-core
```

## Usage

### Option 1: Standalone Components (Angular 16+, Recommended)

For apps using Angular's standalone component API:

```typescript
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import '@grimoire/yetzirah-core'; // Import Web Components

@Component({
  selector: 'app-root',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <ytz-button>Click me</ytz-button>
    <ytz-dialog>
      <h2>Dialog Title</h2>
      <p>Dialog content goes here</p>
    </ytz-dialog>
  `
})
export class AppComponent {}
```

Alternatively, use the provided helper:

```typescript
import { Component } from '@angular/core';
import { provideYetzirah } from '@grimoire/yetzirah-angular';
import '@grimoire/yetzirah-core';

@Component({
  selector: 'app-root',
  standalone: true,
  schemas: [provideYetzirah()],
  template: `<ytz-button>Click me</ytz-button>`
})
export class AppComponent {}
```

### Option 2: Traditional NgModule

For apps still using NgModule:

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { YetzirahModule } from '@grimoire/yetzirah-angular';
import '@grimoire/yetzirah-core'; // Import Web Components

@NgModule({
  imports: [
    BrowserModule,
    YetzirahModule
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

### Loading Web Components

You must ensure `@grimoire/yetzirah-core` is loaded before using the components. There are several ways to do this:

#### Method 1: Import in main.ts (Recommended)

```typescript
// main.ts
import '@grimoire/yetzirah-core';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent);
```

#### Method 2: CDN in index.html

```html
<!-- index.html -->
<script type="module" src="https://unpkg.com/@grimoire/yetzirah-core/dist/yetzirah.js"></script>
```

#### Method 3: Selective imports

```typescript
// Import only the components you need for smaller bundle size
import '@grimoire/yetzirah-core/button';
import '@grimoire/yetzirah-core/dialog';
import '@grimoire/yetzirah-core/tabs';
```

## Available Components

All Yetzirah Web Components are available in Angular templates. Tier 2 components have dedicated Angular wrapper components with full forms support.

### Tier 2 Wrapper Components

| Component | Selector | Forms Support |
|-----------|----------|---------------|
| Toggle | `ytz-toggle` | `ControlValueAccessor`, `[(ngModel)]`, `formControlName` |
| Chip | `ytz-chip` | - |
| IconButton | `ytz-icon-button` | - |
| Slider | `ytz-slider` | `ControlValueAccessor`, `[(ngModel)]`, `formControlName` |
| DataGrid | `ytz-datagrid`, `ytz-datagrid-column` | - |
| ThemeToggle | `ytz-theme-toggle` | - |

### All Web Components

- `<ytz-button>` - Material button with ripple effect
- `<ytz-dialog>` - Modal dialog with backdrop
- `<ytz-disclosure>` - Expandable disclosure/details
- `<ytz-tabs>` - Tabbed interface
- `<ytz-tooltip>` - Accessible tooltips
- `<ytz-menu>` - Dropdown menus
- `<ytz-autocomplete>` - Autocomplete input
- `<ytz-listbox>` - Selectable list
- `<ytz-select>` - Native-like select dropdown
- `<ytz-accordion>` - Collapsible sections
- `<ytz-drawer>` - Side drawer/panel
- `<ytz-popover>` - Floating popovers
- `<ytz-toggle>` - Toggle switch (with wrapper)
- `<ytz-chip>` - Material chips (with wrapper)
- `<ytz-icon-button>` - Icon-only buttons (with wrapper)
- `<ytz-slider>` - Range slider (with wrapper)
- `<ytz-datagrid>` - Data grid/table (with wrapper)
- `<ytz-theme-toggle>` - Theme toggle (with wrapper)

## Tier 2 Component API

### Toggle

Implements `ControlValueAccessor` for Angular forms integration.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Toggle } from '@grimoire/yetzirah-angular';

@Component({
  standalone: true,
  imports: [FormsModule, Toggle],
  template: `
    <ytz-toggle [(ngModel)]="enabled" [disabled]="false" (change)="onChange($event)"></ytz-toggle>
  `
})
export class MyComponent {
  enabled = false;
  onChange(event: Event) { console.log(event); }
}
```

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `ngModel` | `boolean` | `false` | Two-way bound checked state |
| `disabled` | `boolean` | `false` | Disables the toggle |

| Output | Type | Description |
|--------|------|-------------|
| `ngModelChange` | `boolean` | Emits when checked state changes |
| `change` | `Event` | Native change event |

### Chip

```typescript
import { Component } from '@angular/core';
import { Chip } from '@grimoire/yetzirah-angular';

@Component({
  standalone: true,
  imports: [Chip],
  template: `
    <ytz-chip [deletable]="true" (delete)="onDelete()">Tag Name</ytz-chip>
  `
})
export class MyComponent {
  onDelete() { console.log('deleted'); }
}
```

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `deletable` | `boolean` | `false` | Shows delete button |
| `disabled` | `boolean` | `false` | Disables the chip |

| Output | Type | Description |
|--------|------|-------------|
| `delete` | `EventEmitter<void>` | Emits when delete button clicked |

### IconButton

```typescript
import { Component } from '@angular/core';
import { IconButton } from '@grimoire/yetzirah-angular';

@Component({
  standalone: true,
  imports: [IconButton],
  template: `
    <ytz-icon-button ariaLabel="Close" tooltip="Close dialog" (click)="onClick()">
      <svg><!-- icon --></svg>
    </ytz-icon-button>
  `
})
export class MyComponent {
  onClick() { console.log('clicked'); }
}
```

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `ariaLabel` | `string` | *required* | Accessible label (maps to aria-label) |
| `tooltip` | `string` | - | Tooltip text |
| `disabled` | `boolean` | `false` | Disables the button |

### Slider

Implements `ControlValueAccessor` for Angular forms integration.

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Slider } from '@grimoire/yetzirah-angular';

@Component({
  standalone: true,
  imports: [FormsModule, Slider],
  template: `
    <ytz-slider [(ngModel)]="volume" [min]="0" [max]="100" [step]="1"></ytz-slider>
  `
})
export class MyComponent {
  volume = 50;
}
```

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `ngModel` | `number` | `0` | Two-way bound value |
| `min` | `number` | `0` | Minimum value |
| `max` | `number` | `100` | Maximum value |
| `step` | `number` | `1` | Step increment |
| `disabled` | `boolean` | `false` | Disables the slider |

| Output | Type | Description |
|--------|------|-------------|
| `ngModelChange` | `number` | Emits on value change |
| `input` | `Event` | Live value change during drag |
| `change` | `Event` | Committed value change on release |

### DataGrid

```typescript
import { Component } from '@angular/core';
import { DataGrid, DataGridColumn } from '@grimoire/yetzirah-angular';

@Component({
  standalone: true,
  imports: [DataGrid, DataGridColumn],
  template: `
    <ytz-datagrid [data]="data" [rowHeight]="40" (sort)="onSort($event)" (rowSelect)="onSelect($event)">
      <ytz-datagrid-column field="id" header="ID" [width]="80"></ytz-datagrid-column>
      <ytz-datagrid-column field="name" header="Name" [sortable]="true"></ytz-datagrid-column>
      <ytz-datagrid-column field="email" header="Email"></ytz-datagrid-column>
    </ytz-datagrid>
  `
})
export class MyComponent {
  data = [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' }
  ];
  onSort(event: any) { console.log(event); }
  onSelect(event: any) { console.log(event); }
}
```

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `data` | `any[]` | `[]` | Row data array |
| `columns` | `Column[]` | `[]` | Column definitions (alternative to children) |
| `rowHeight` | `number` | `40` | Row height in pixels |

| Output | Type | Description |
|--------|------|-------------|
| `sort` | `{ column, direction }` | Sort requested |
| `rowSelect` | `{ row, index }` | Row selected |
| `rowActivate` | `{ row, index }` | Row double-clicked |

### ThemeToggle

```typescript
import { Component } from '@angular/core';
import { ThemeToggle } from '@grimoire/yetzirah-angular';

@Component({
  standalone: true,
  imports: [ThemeToggle],
  template: `
    <ytz-theme-toggle [storageKey]="'my-app-theme'" (themeChange)="onThemeChange($event)"></ytz-theme-toggle>
  `
})
export class MyComponent {
  onThemeChange(event: CustomEvent) { console.log(event.detail); }
}
```

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `storageKey` | `string` | `'theme'` | localStorage key |
| `noPersist` | `boolean` | `false` | Disable persistence |

| Output | Type | Description |
|--------|------|-------------|
| `themeChange` | `{ theme, isDark }` | Theme changed |

## TypeScript Support

This package includes TypeScript definitions for all components. However, since these are Web Components, you may need to add custom element type declarations for strict type checking:

```typescript
// src/custom-elements.d.ts
declare namespace JSX {
  interface IntrinsicElements {
    'ytz-button': any;
    'ytz-dialog': any;
    // ... add other components as needed
  }
}
```

## Two-Way Binding

Angular's two-way binding works with Web Component properties and events:

```typescript
@Component({
  template: `
    <ytz-toggle
      [checked]="isEnabled"
      (change)="onToggleChange($event)">
    </ytz-toggle>
  `
})
export class MyComponent {
  isEnabled = false;

  onToggleChange(event: Event) {
    this.isEnabled = (event.target as any).checked;
  }
}
```

## Styling

Yetzirah components are unstyled by default. Import the optional CSS if desired:

```typescript
// main.ts or styles.css
import '@grimoire/yetzirah-core/button.css';
import '@grimoire/yetzirah-core/dialog.css';
import '@grimoire/yetzirah-core/disclosure.css';
```

Or use the dark theme:

```typescript
import '@grimoire/yetzirah-core/dark.css';
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

Tests use [Jest](https://jestjs.io/) with [jest-preset-angular](https://github.com/thymikee/jest-preset-angular) for Angular-specific testing utilities.

## Requirements

- Angular 16 or higher
- Modern browsers with Web Components support (all evergreen browsers)

## License

ISC

## Repository

https://github.com/grimoire-intelligence/yetzirah
