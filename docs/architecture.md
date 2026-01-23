# Yetzirah Architecture

This document describes the architecture decisions behind Yetzirah. It serves as onboarding documentation for contributors and explains the rationale behind key design choices.

## Overview

Yetzirah is a CDN-first, framework-agnostic component library built on Web Components. The design goals are:

1. **Zero-build usage**: Load via `<script type="module">` with no bundler
2. **Sub-13KB bundle**: All 21 components in <13KB gzipped
3. **Global performance**: <3s load time on 3G networks
4. **Multi-framework support**: Works with vanilla JS, React, Vue, Svelte, Angular, Solid, Alpine

## Build Pipeline

### Tool Selection: tsup + esbuild

We chose tsup (powered by esbuild) over Rollup for bundle generation:

| Factor | tsup/esbuild | Rollup |
|--------|--------------|--------|
| Build speed | ~2s | ~8-10s |
| Configuration | Minimal | Verbose |
| Tree-shaking | Excellent | Excellent |
| Output quality | High | Slightly better |

The speed advantage enables rapid iteration during development while maintaining production-quality output.

### Build Configuration

The CDN build configuration (`packages/core/tsup.cdn.config.js`) uses these key settings:

```javascript
{
  format: ['esm'],        // ES modules only (no UMD/CJS)
  splitting: false,       // Each bundle is standalone
  sourcemap: true,        // Debugging support
  treeshake: true,        // Remove unused code
  minify: true,           // Production optimization
  outDir: 'cdn',          // Output directory
}
```

**Key decision: `splitting: false`**

We disable code splitting to ensure each component bundle is self-contained. This trades some duplication for simplicity:

- Bundles work independently without import maps
- No runtime chunk loading failures
- Predictable caching behavior
- Simpler mental model for users

When using import maps or a bundler, the `index.js` export enables proper tree-shaking.

### Entry Points

The build produces multiple entry points for different use cases:

| Entry | File | Purpose |
|-------|------|---------|
| Full bundle | `core.js` | All 21 components, single request |
| Auto bundle | `auto.js` | All components with auto-registration |
| Tree-shakeable | `index.js` | Named exports for bundler tree-shaking |
| Individual | `{component}.js` | Single component, minimal payload |

### Auto-Registration Entry Point

The `cdn-entry.js` provides a side-effect-only import that registers all components:

```javascript
// Auto-registers all ytz-* custom elements
import './index.js'
```

This enables the simplest possible usage:

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@grimoire-intel/yetzirah@latest/cdn/auto.js"></script>
<!-- Components work immediately -->
<ytz-dialog>...</ytz-dialog>
```

Custom element registration is idempotent—multiple script loads don't cause errors.

## Bundle Structure

### Size Breakdown

| Bundle Type | Gzipped Size | Components |
|-------------|--------------|------------|
| core.js | ~12.6 KB | All 21 components |
| Individual (avg) | 0.5-3 KB | Single component |

### Individual Bundle Sizes

Each component can be loaded independently:

| Component | Gzipped |
|-----------|---------|
| button.js | ~500 B |
| disclosure.js | ~550 B |
| toggle.js | ~540 B |
| chip.js | ~600 B |
| badge.js | ~500 B |
| progress.js | ~600 B |
| accordion.js | ~760 B |
| dialog.js | ~900 B |
| drawer.js | ~1.0 KB |
| tabs.js | ~1.1 KB |
| tooltip.js | ~1.2 KB |
| listbox.js | ~1.2 KB |
| popover.js | ~1.4 KB |
| menu.js | ~1.9 KB |
| select.js | ~2.2 KB |
| autocomplete.js | ~2.6 KB |
| snackbar.js | ~1.0 KB |
| datagrid.js | ~3.0 KB |

### Utility Sharing Strategy

Shared utilities (focus trap, positioning, keyboard navigation) are inlined into each bundle. This creates some duplication but ensures:

1. Each bundle is fully standalone
2. No cross-bundle dependencies
3. Works without import maps
4. Predictable behavior

For applications using multiple components, the combined bundle (`core.js`) provides de-duplicated utilities.

## Performance Optimizations

### Bundle Size Optimizations

1. **Aggressive tree-shaking**: Unused code paths eliminated at build time
2. **Minification**: esbuild minifies identifiers and removes whitespace
3. **No runtime dependencies**: Zero external dependencies in bundles
4. **Targeted ES2020+**: Modern syntax without transpilation overhead

### Load Time Targets

| Network | Target | Actual |
|---------|--------|--------|
| Broadband (25Mbps) | <100ms | ~50ms |
| 4G (9Mbps) | <200ms | ~120ms |
| Fast 3G (1.5Mbps) | <500ms | ~350ms |

### Parse Time Optimization

JavaScript parse time is minimized through:
- Minimal AST complexity
- No dynamic imports in component code
- Synchronous registration (no async overhead)
- Direct DOM API usage (no abstraction layers)

Estimated parse times:
- Desktop: <10ms for full bundle
- Mobile: <30ms for full bundle

### Caching Strategy

CDN bundles are designed for aggressive caching:

1. **Version-pinned URLs**: `/npm/@grimoire-intel/yetzirah@0.1.0/cdn/core.js`
2. **Immutable content**: Bundle content never changes for a version
3. **Long cache TTL**: 1 year cache headers on versioned URLs
4. **SRI support**: Integrity hashes for security-conscious deployments

## Framework Integration

### Import Maps

Import maps provide npm-like DX without a build step:

```html
<script type="importmap">
{
  "imports": {
    "yetzirah": "https://cdn.jsdelivr.net/npm/@grimoire-intel/yetzirah@latest/cdn/core.js",
    "yetzirah/": "https://cdn.jsdelivr.net/npm/@grimoire-intel/yetzirah@latest/cdn/"
  }
}
</script>
<script type="module">
  import 'yetzirah';                    // All components
  import 'yetzirah/dialog.js';          // Single component
</script>
```

Browser support: Chrome 89+, Edge 89+, Safari 16.4+, Firefox 108+

### Framework Wrappers

| Package | Responsibility |
|---------|---------------|
| `@grimoire-intel/yetzirah-react` | `onX` → `addEventListener` bridging, ref forwarding, boolean attribute handling |
| `@grimoire-intel/yetzirah-vue` | `v-model` support, event mapping |
| `@grimoire-intel/yetzirah-svelte` | Event forwarding, reactive attribute binding |
| `@grimoire-intel/yetzirah-angular` | `ControlValueAccessor` for forms, change detection |
| `@grimoire-intel/yetzirah-solid` | Signal integration, fine-grained reactivity binding |
| `@grimoire-intel/yetzirah-alpine` | `x-ytz:model` directive, event bridging |

Wrappers are thin. If a wrapper exceeds 50 lines per component, something is wrong.

### Solid.js Wrapper Pattern

All Solid wrappers use native signals:

```tsx
import { Component, createEffect, onCleanup, splitProps } from 'solid-js'

export const Dialog: Component<DialogProps> = (props) => {
  let ref: HTMLElement | undefined
  const [local, others] = splitProps(props, ['open', 'onClose', 'children'])

  createEffect(() => {
    if (!ref) return
    if (local.open) {
      ref.setAttribute('open', '')
    } else {
      ref.removeAttribute('open')
    }
  })

  createEffect(() => {
    if (!ref || !local.onClose) return
    const handler = () => local.onClose?.()
    ref.addEventListener('close', handler)
    onCleanup(() => ref?.removeEventListener('close', handler))
  })

  return <ytz-dialog ref={ref} {...others}>{local.children}</ytz-dialog>
}
```

### Alpine.js Plugin

The Alpine plugin provides `x-ytz:model` for two-way binding:

```html
<div x-data="{ volume: 50, enabled: false }">
  <ytz-slider x-ytz:model="volume"></ytz-slider>
  <ytz-toggle x-ytz:model="enabled"></ytz-toggle>
</div>
```

The `$ytz` magic provides imperative control:

```html
<button @click="$ytz.open('#my-dialog')">Open</button>
<button @click="$ytz.snackbar('Saved!')">Show Toast</button>
```

### Preact + HTM Pattern

For React-like DX without transpilation:

```javascript
import { html } from 'htm/preact';
import { useRef } from 'preact/hooks';

function App() {
  const dialogRef = useRef(null);
  return html`
    <ytz-button onClick=${() => dialogRef.current?.showModal()}>Open</ytz-button>
    <ytz-dialog ref=${dialogRef}>Content</ytz-dialog>
  `;
}
```

### No Wrapper Needed

Some frameworks have native Web Component interop and need no wrapper:

| Framework | Notes |
|-----------|-------|
| **Lit** | Built on Web Components—Yetzirah elements compose naturally |
| **HTMX** | HTML-centric; Yetzirah elements work like any HTML element |
| **Stencil** | Web Components compiler; native interop with `<ytz-*>` elements |

## Component Architecture

### Design Philosophy

All components follow these patterns:

| Aspect | Choice | Rationale |
|--------|--------|-----------|
| Base class | `HTMLElement` | No library overhead. Platform-native. |
| Shadow DOM | No (light DOM) | Styling is user's concern. Simpler integration. |
| Dependencies | Zero | The platform is sufficient. |

### Component Categories

**Core UI** (most applications need these):
- Button, Dialog, Drawer, Disclosure, Accordion
- Tabs, Menu, Popover, Tooltip

**Form Components**:
- Toggle, Slider, Select, Autocomplete, Listbox, Chip

**Data Display**:
- DataGrid, Badge, Progress

**Feedback**:
- Snackbar

**Utility**:
- ThemeToggle, IconButton

### Snackbar Component

Key design decisions:

1. **Queue Management**: Multiple snackbars stack vertically rather than replacing each other
2. **Auto-Dismiss**: Default 5 seconds, customizable via `duration` attribute
3. **Position Anchoring**: Six positions (top/bottom + left/center/right), default `bottom-center`
4. **ARIA Live Region**: Uses `role="status"` and `aria-live="polite"`

### Progress Component

1. **CSS-Driven Animations**: No JavaScript animation loops
2. **Dual Variants**: Circular (spinner) and linear (progress bar)
3. **Indeterminate vs Determinate**: No `value` = continuous animation; `value="0-100"` = actual progress

### Badge Component

1. **Overlay Positioning**: Badge floats relative to slotted content
2. **Dot vs Count Modes**: No `value` = dot indicator; `value` = number display
3. **Max Value Capping**: `max="99"` displays "99+" for larger values
4. **Hidden When Zero**: Auto-hides when `value="0"` (override with `show-zero`)

## Architecture Decisions

### Decision: ESM-Only Output

**Context**: CDN bundles could support UMD, CommonJS, or ESM formats.

**Decision**: ESM only.

**Rationale**:
- Native browser support (all modern browsers)
- Best tree-shaking support
- Smaller bundle size (no module wrapper)
- Future-proof (ES modules are the standard)

**Trade-off**: No support for legacy `<script>` tags without `type="module"`.

### Decision: Self-Contained Bundles

**Context**: Bundles could share code via chunks or be fully standalone.

**Decision**: Each bundle is self-contained.

**Rationale**:
- Simpler deployment (single file)
- Works without import maps
- Predictable loading behavior
- No coordination between bundles

**Trade-off**: Some code duplication between bundles.

### Decision: Custom Element Auto-Registration

**Context**: Components could require explicit registration or auto-register.

**Decision**: Auto-register on import.

**Rationale**:
- Zero-config usage
- Matches user expectations
- Reduces boilerplate
- Idempotent (safe to import multiple times)

**Trade-off**: Users can't customize element names.

### Decision: Bundle Size Target <13KB

**Context**: What size budget for the full bundle?

**Decision**: <13KB gzipped for the complete component library.

**Rationale**:
- Competitive with Headless UI (~68KB) at 5x smaller
- Enables <3s load on Fast 3G
- Room for future components within budget
- Smaller than a single MUI icon

**Trade-off**: Limits complexity per component.

### Decision: Light DOM (No Shadow DOM)

**Context**: Web Components can use Shadow DOM for encapsulation.

**Decision**: Light DOM only.

**Rationale**:
- Yetzirah ships no styles, so encapsulation solves nothing
- Tachyons and user CSS work naturally
- Framework integration is simpler (no `::part()` gymnastics)
- Custom elements as behavior boundaries, not style boundaries

**Trade-off**: No style isolation.

## NPM Distribution

### Package Organization

All packages are published under the `@grimoire-intel` npm organization:

| Package | Description |
|---------|-------------|
| `@grimoire-intel/yetzirah` | Web Components (no dependencies) |
| `@grimoire-intel/yetzirah-react` | React wrappers |
| `@grimoire-intel/yetzirah-vue` | Vue 3 wrappers |
| `@grimoire-intel/yetzirah-svelte` | Svelte wrappers |
| `@grimoire-intel/yetzirah-angular` | Angular wrappers |
| `@grimoire-intel/yetzirah-solid` | Solid.js wrappers |
| `@grimoire-intel/yetzirah-alpine` | Alpine.js plugin |

### Version Management

All packages share the same version number for simplicity. This ensures compatibility and simplifies upgrades.

### CDN Availability

After npm publish, packages are automatically available on:

- **jsDelivr**: `https://cdn.jsdelivr.net/npm/@grimoire-intel/yetzirah@latest/cdn/core.js`
- **unpkg**: `https://unpkg.com/@grimoire-intel/yetzirah@latest/cdn/core.js`
- **esm.sh**: `https://esm.sh/@grimoire-intel/yetzirah@latest`

## Bundle Size Summary

| Configuration | Gzipped Size |
|---------------|--------------|
| Core only | ~12.6 KB |
| Core + React wrappers | ~15 KB |
| Core + Vue wrappers | ~17 KB |
| Core + Svelte wrappers | ~13 KB |
| Core + Angular wrappers | ~24 KB |
| Core + Solid wrappers | ~16 KB |
| Core + Alpine plugin | ~15 KB |

## Testing Infrastructure

### Performance Testing

`scripts/perf-test.js` provides:
- Bundle size measurement
- Network simulation (3G, 4G, broadband)
- Parse time estimation
- Baseline comparison
- CI regression detection

### Integration Tests

Playwright tests verify CDN bundles work correctly:
- Component functionality
- Event handling
- Import map resolution
- No console errors

### CI Integration

GitHub Actions workflow:
1. Build CDN bundles
2. Run performance tests
3. Compare against baseline
4. Fail on budget violations or regressions

## Related Documentation

- [CDN Usage Guide](./cdn-usage.md) - Getting started with CDN
- [CDN Hosting Guide](./cdn-hosting.md) - Self-hosting and CDN options
- [Performance Guide](./performance.md) - Optimization strategies
- [Preact + HTM Guide](./preact-htm.md) - Buildless React alternative
- [Vanilla Patterns](./vanilla-patterns.md) - Framework-free usage
- [Solid.js Guide](./solid.md) - Solid.js usage documentation
- [Rails Integration](./rails-integration.md) - Rails + Hotwire patterns
- [Laravel Integration](./laravel-integration.md) - Laravel + Livewire patterns
- [Django Integration](./django-integration.md) - Django + HTMX patterns

---

*Last updated: v1.0 release*
