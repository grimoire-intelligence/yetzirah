# @yetzirah/angular

Angular wrappers for Yetzirah Web Components - bringing Material Design behavior patterns to Angular 16+.

## Installation

```bash
npm install @yetzirah/angular @yetzirah/core
# or
pnpm add @yetzirah/angular @yetzirah/core
# or
yarn add @yetzirah/angular @yetzirah/core
```

## Usage

### Option 1: Standalone Components (Angular 16+, Recommended)

For apps using Angular's standalone component API:

```typescript
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import '@yetzirah/core'; // Import Web Components

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
import { provideYetzirah } from '@yetzirah/angular';
import '@yetzirah/core';

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
import { YetzirahModule } from '@yetzirah/angular';
import '@yetzirah/core'; // Import Web Components

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

You must ensure `@yetzirah/core` is loaded before using the components. There are several ways to do this:

#### Method 1: Import in main.ts (Recommended)

```typescript
// main.ts
import '@yetzirah/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent);
```

#### Method 2: CDN in index.html

```html
<!-- index.html -->
<script type="module" src="https://unpkg.com/@yetzirah/core/dist/yetzirah.js"></script>
```

#### Method 3: Selective imports

```typescript
// Import only the components you need for smaller bundle size
import '@yetzirah/core/button';
import '@yetzirah/core/dialog';
import '@yetzirah/core/tabs';
```

## Available Components

All Yetzirah Web Components are available in Angular templates:

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
- `<ytz-toggle>` - Toggle switch
- `<ytz-chip>` - Material chips
- `<ytz-icon-button>` - Icon-only buttons
- `<ytz-slider>` - Range slider
- `<ytz-datagrid>` - Data grid/table

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
import '@yetzirah/core/button.css';
import '@yetzirah/core/dialog.css';
import '@yetzirah/core/disclosure.css';
```

Or use the dark theme:

```typescript
import '@yetzirah/core/dark.css';
```

## Requirements

- Angular 16 or higher
- Modern browsers with Web Components support (all evergreen browsers)

## License

ISC

## Repository

https://github.com/grimoire-intelligence/yetzirah
