# Phase 4 Architecture: Extensions, Components & Distribution

This document describes the architecture decisions made for Yetzirah's Phase 4 release. It covers new components, framework integrations (Solid.js and Alpine.js), and the npm distribution setup.

## Overview

Phase 4 extends Yetzirah with:

1. **New Components**: Snackbar/Toast, Progress/Spinner, Badge
2. **Solid.js Integration**: Native signal-based wrappers for all components
3. **Alpine.js Plugin**: Directives and magics for progressive enhancement
4. **Server Framework Patterns**: Rails, Laravel, Django integration guides
5. **NPM Distribution**: Package publication setup for @grimoire organization

## New Component Architecture

### Component Design Philosophy

The three new components follow Yetzirah's established patterns:

| Component | Purpose | Complexity |
|-----------|---------|------------|
| `<ytz-snackbar>` | Transient notifications | Queue management, auto-dismiss |
| `<ytz-progress>` | Loading indicators | CSS-driven animations |
| `<ytz-badge>` | Notification dots/counts | Overlay positioning |

### Snackbar Component

**Key Design Decisions:**

1. **Queue Management**: Multiple snackbars stack vertically rather than replacing each other
   - Rationale: Users should see all notifications, not miss important ones
   - Trade-off: Requires more screen real estate

2. **Auto-Dismiss with Configurable Duration**: Default 5 seconds, customizable via `duration` attribute
   - Rationale: Most notifications are transient; persistent ones can use `duration="0"`
   - Trade-off: Users must actively manage long-lived notifications

3. **Position Anchoring**: Six positions supported (top/bottom + left/center/right)
   - Default: `bottom-center` (following Material Design conventions)
   - Rationale: Bottom positioning avoids header conflicts; center draws attention

4. **ARIA Live Region**: Uses `role="status"` and `aria-live="polite"`
   - Rationale: Screen readers announce notifications without interrupting current context

**CDN Bundle Size**: ~1KB gzipped (individual), included in core.js

### Progress Component

**Key Design Decisions:**

1. **CSS-Driven Animations**: No JavaScript animation loops
   - Rationale: Better performance, smoother animations, lower battery usage
   - Implementation: CSS `@keyframes` for indeterminate state

2. **Dual Variants**: Circular (spinner) and linear (progress bar)
   - Rationale: Different use cases require different visual treatments
   - Selection: `variant="circular"` or `variant="linear"`

3. **Indeterminate vs Determinate Modes**:
   - Indeterminate: No `value` attribute, shows continuous animation
   - Determinate: `value="0-100"` shows actual progress
   - Rationale: Many operations don't have measurable progress

**Accessibility**: `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax` for determinate mode.

**CDN Bundle Size**: ~600B gzipped (individual)

### Badge Component

**Key Design Decisions:**

1. **Overlay Positioning**: Badge floats relative to slotted content
   - Rationale: Badge should work with any element (buttons, icons, avatars)
   - Implementation: Absolute positioning with CSS transforms

2. **Dot vs Count Modes**:
   - Dot mode: No `value` attribute, shows simple indicator
   - Count mode: `value` attribute shows number
   - Rationale: Different contexts need different information density

3. **Max Value Capping**: `max="99"` displays "99+" for larger values
   - Rationale: Prevents badge overflow and maintains visual consistency
   - Default: No max (shows actual number)

4. **Hidden When Zero**: Badge auto-hides when `value="0"`
   - Rationale: Zero notifications shouldn't show an empty badge
   - Override: Use `show-zero` attribute to force display

**CDN Bundle Size**: ~500B gzipped (individual)

## Solid.js Integration Architecture

### Package Structure

```
packages/solid/
├── src/
│   ├── index.ts          # Main exports
│   ├── Button.tsx        # Component wrappers
│   ├── Dialog.tsx
│   └── ...
├── package.json
└── tsup.config.ts
```

### Wrapper Design Pattern

All Solid wrappers follow a consistent pattern:

```tsx
import { Component, JSX, createEffect, onCleanup, splitProps } from 'solid-js'

export interface DialogProps extends JSX.HTMLAttributes<HTMLElement> {
  open?: boolean
  onClose?: () => void
  children?: JSX.Element
}

export const Dialog: Component<DialogProps> = (props) => {
  let ref: HTMLElement | undefined
  const [local, others] = splitProps(props, ['open', 'onClose', 'children'])

  // Reactive effect for open state
  createEffect(() => {
    if (!ref) return
    if (local.open) {
      ref.setAttribute('open', '')
    } else {
      ref.removeAttribute('open')
    }
  })

  // Event handler bridging
  createEffect(() => {
    if (!ref || !local.onClose) return
    const handler = () => local.onClose?.()
    ref.addEventListener('close', handler)
    onCleanup(() => ref?.removeEventListener('close', handler))
  })

  return (
    <ytz-dialog ref={ref} {...others}>
      {local.children}
    </ytz-dialog>
  )
}
```

### Key Design Decisions

1. **Native Signals Integration**: Uses `createEffect` for reactive attribute updates
   - Rationale: Leverages Solid's fine-grained reactivity system
   - Trade-off: More boilerplate than React's useEffect, but better performance

2. **Props Splitting via `splitProps`**: Separates component-specific props from pass-through
   - Rationale: Clean separation between wrapper logic and web component attributes
   - Benefit: TypeScript types remain accurate

3. **Event Handler Bridging**: Converts CustomEvents to callback props
   - Pattern: `onClose` prop maps to `close` event listener
   - Rationale: Idiomatic Solid.js API while preserving web component behavior

4. **Ref Forwarding**: Uses Solid's native ref mechanism
   - Implementation: `ref={ref}` on the wrapped element
   - Benefit: Access to underlying web component methods

5. **JSX Namespace Extension**: Custom elements declared in `jsx.d.ts`
   - Rationale: Proper TypeScript support without `createElement` calls
   - Implementation: Module augmentation of Solid's JSX namespace

### Build Configuration

```typescript
// tsup.config.ts
export default {
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  external: ['solid-js', '@grimoire/yetzirah-core'],
  esbuildPlugins: [solidPlugin()],
}
```

**Key Points:**
- Dual output (ESM + CJS) for maximum compatibility
- Solid.js marked as external peer dependency
- esbuild-plugin-solid for JSX transformation

## Alpine.js Plugin Architecture

### Plugin Structure

```
packages/alpine/
├── src/
│   ├── index.ts          # Plugin entry point
│   ├── directives.ts     # Component-specific directives
│   ├── model.ts          # x-ytz:model directive
│   └── magics/
│       ├── index.ts
│       └── ytz.ts        # $ytz magic methods
├── cdn/
│   └── yetzirah-alpine.js
└── package.json
```

### Plugin Registration

```javascript
import Alpine from 'alpinejs'
import { yetzirahPlugin } from '@grimoire/yetzirah-alpine'

Alpine.plugin(yetzirahPlugin)
Alpine.start()
```

### Directive Architecture

The plugin provides component-specific directives for two-way binding:

| Directive | Component | Syncs |
|-----------|-----------|-------|
| `x-ytz-dialog` | `<ytz-dialog>` | open state |
| `x-ytz-drawer` | `<ytz-drawer>` | open state |
| `x-ytz-toggle` | `<ytz-toggle>` | checked state |
| `x-ytz-slider` | `<ytz-slider>` | value |
| `x-ytz-select` | `<ytz-select>` | value |
| `x-ytz-tabs` | `<ytz-tabs>` | selected tab |
| `x-ytz-progress` | `<ytz-progress>` | value |
| `x-ytz-badge` | `<ytz-badge>` | count |
| `x-ytz-snackbar` | `<ytz-snackbar>` | open state |

**Directive Implementation Pattern:**

```typescript
Alpine.directive('ytz-dialog', (el, { expression, modifiers }, { evaluate, effect, cleanup }) => {
  // Sync Alpine data → component attribute
  effect(() => {
    const isOpen = evaluate(expression)
    if (isOpen) {
      el.setAttribute('open', '')
    } else {
      el.removeAttribute('open')
    }
  })

  // Sync component events → Alpine data
  const handleClose = () => {
    Alpine.evaluate(el, `${expression} = false`)
  }
  el.addEventListener('close', handleClose)
  cleanup(() => el.removeEventListener('close', handleClose))
})
```

### x-ytz:model Unified Binding

The `x-ytz:model` directive provides a unified two-way binding interface:

```html
<!-- Instead of component-specific directives -->
<ytz-slider x-ytz:model="volume"></ytz-slider>
<ytz-toggle x-ytz:model="enabled"></ytz-toggle>
<ytz-select x-ytz:model="country"></ytz-select>
```

**Key Design Decisions:**

1. **Auto-Detection**: Directive inspects element tag name to determine binding behavior
   - Rationale: Single directive API, reduced learning curve
   - Implementation: Configuration lookup table by tag name

2. **Modifier Support**: `.lazy`, `.number`, `.trim`
   - `.lazy`: Debounces input events (150ms)
   - `.number`: Coerces value to number
   - `.trim`: Trims string whitespace

3. **Bidirectional Sync**:
   - Alpine → Component: Uses `effect()` to watch Alpine data
   - Component → Alpine: Listens for component events

### Magic Methods

The `$ytz` magic provides imperative component control:

```html
<div x-data>
  <button @click="$ytz.open('#my-dialog')">Open</button>
  <button @click="$ytz.snackbar('Saved!')">Show Toast</button>
</div>
```

**Available Methods:**

| Method | Purpose |
|--------|---------|
| `$ytz.open(selector)` | Open Dialog/Drawer/Menu |
| `$ytz.close(selector)` | Close Dialog/Drawer/Menu |
| `$ytz.toggle(selector)` | Toggle open state |
| `$ytz.show(selector, message?)` | Show Snackbar with optional message |
| `$ytz.snackbar(message, options?)` | Create programmatic snackbar |
| `$ytz.toggleTheme()` | Toggle light/dark theme |
| `$ytz.getTheme()` / `$ytz.setTheme()` | Theme access |

### CDN Distribution

The Alpine plugin is available as a standalone CDN bundle:

```html
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3/dist/cdn.min.js"></script>
<script type="module" src="https://cdn.jsdelivr.net/npm/@grimoire/yetzirah-alpine/cdn/yetzirah-alpine.js"></script>
```

**Bundle Configuration:**

```javascript
// tsup.cdn.config.js
export default {
  entry: ['src/index.ts'],
  format: ['esm'],
  outDir: 'cdn',
  minify: true,
  noExternal: ['@grimoire/yetzirah-core'],
  // Alpine.js remains external (user provides it)
}
```

**Bundle Size**: ~3KB gzipped (includes core components)

## Server Framework Integration Patterns

Phase 4 includes integration guides for server-rendered frameworks that use Alpine.js for progressive enhancement:

### Rails + Hotwire + Yetzirah

```erb
<!-- app/views/components/_dialog.html.erb -->
<div x-data="{ open: false }">
  <ytz-button @click="open = true">Open</ytz-button>
  <ytz-dialog x-ytz-dialog="open">
    <%= yield %>
  </ytz-dialog>
</div>
```

### Laravel + Livewire + Yetzirah

```blade
<!-- resources/views/components/dialog.blade.php -->
<div x-data="{ open: @entangle('showDialog') }">
  <ytz-dialog x-ytz-dialog="open">
    {{ $slot }}
  </ytz-dialog>
</div>
```

### Django + HTMX + Yetzirah

```html
<!-- templates/components/dialog.html -->
<div x-data="{ open: false }">
  <ytz-button @click="open = true">Load Content</ytz-button>
  <ytz-dialog x-ytz-dialog="open">
    <div hx-get="{% url 'dialog-content' %}" hx-trigger="intersect once">
      Loading...
    </div>
  </ytz-dialog>
</div>
```

## NPM Distribution Architecture

### Package Organization

All packages are published under the `@grimoire` npm organization:

| Package | Description |
|---------|-------------|
| `@grimoire/yetzirah-core` | Web Components (no dependencies) |
| `@grimoire/yetzirah-react` | React wrappers |
| `@grimoire/yetzirah-vue` | Vue 3 wrappers |
| `@grimoire/yetzirah-svelte` | Svelte wrappers |
| `@grimoire/yetzirah-angular` | Angular wrappers |
| `@grimoire/yetzirah-solid` | Solid.js wrappers |
| `@grimoire/yetzirah-alpine` | Alpine.js plugin |

### Version Management

All packages share the same version number for simplicity:

```json
{
  "name": "@grimoire/yetzirah-core",
  "version": "0.3.0"
}
```

**Rationale:**
- Easier to communicate compatible versions
- Simpler upgrade path for users
- Atomic releases ensure consistency

### Package Installation

```bash
# Core only (vanilla JS)
npm install @grimoire/yetzirah-core

# With React
npm install @grimoire/yetzirah-react

# With Alpine.js (CDN alternative)
npm install @grimoire/yetzirah-alpine
```

### CDN Availability

After npm publish, packages are automatically available on:

- **jsDelivr**: `https://cdn.jsdelivr.net/npm/@grimoire/yetzirah-core@0.3.0/cdn/core.js`
- **unpkg**: `https://unpkg.com/@grimoire/yetzirah-core@0.3.0/cdn/core.js`
- **esm.sh**: `https://esm.sh/@grimoire/yetzirah-core@0.3.0`

## Bundle Size Summary

### Phase 4 Additions

| Bundle | Gzipped Size |
|--------|--------------|
| New components (snackbar + progress + badge) | ~2.1 KB |
| Solid.js wrappers | ~4 KB |
| Alpine.js plugin | ~3 KB |

### Total Library Size

| Configuration | Gzipped Size |
|---------------|--------------|
| Core only | ~12 KB |
| Core + React wrappers | ~15 KB |
| Core + Vue wrappers | ~17 KB |
| Core + Solid wrappers | ~16 KB |
| Core + Alpine plugin | ~15 KB |

## Architecture Decisions Summary

### Decision: Solid.js Uses Native Signals

**Context**: Solid wrappers could use a generic wrapper pattern or native primitives.

**Decision**: Use `createEffect` and native refs directly.

**Rationale**:
- Leverages Solid's fine-grained reactivity
- No abstraction layer overhead
- Familiar patterns for Solid developers
- Better performance than generic solutions

**Trade-off**: More boilerplate per wrapper.

### Decision: Alpine.js Uses Directive-per-Component Pattern

**Context**: Could use a single generic directive or component-specific directives.

**Decision**: Both - specific directives (`x-ytz-dialog`) plus unified `x-ytz:model`.

**Rationale**:
- Specific directives are self-documenting
- Unified model directive reduces cognitive load
- Power users can use specific directives for edge cases
- Beginners can use x-ytz:model everywhere

**Trade-off**: Larger API surface.

### Decision: Alpine Plugin Includes Core Components

**Context**: Alpine plugin could be wrapper-only or bundle core components.

**Decision**: CDN bundle includes core components.

**Rationale**:
- Single script tag for CDN users
- No coordination between multiple scripts
- Matches Alpine's "drop in a script" philosophy

**Trade-off**: Larger bundle if core already loaded.

### Decision: Snackbar Uses Queue Model

**Context**: Snackbars could replace each other or queue.

**Decision**: Queue with stacking.

**Rationale**:
- No notification loss
- Matches user expectations from native apps
- Position anchoring keeps UI predictable

**Trade-off**: Screen real estate usage.

## Related Documentation

- [Solid.js Guide](./solid.md) - Solid.js usage documentation
- [Rails Integration](./rails-integration.md) - Rails + Hotwire patterns
- [Laravel Integration](./laravel-integration.md) - Laravel + Livewire patterns
- [Django Integration](./django-integration.md) - Django + HTMX patterns
- [CDN Usage Guide](./cdn-usage.md) - CDN installation and import maps
- [Phase 3 Architecture](./architecture-phase3.md) - CDN-first distribution

---

*Last updated: Phase 4 release*
