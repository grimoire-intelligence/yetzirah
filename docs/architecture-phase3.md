# Phase 3 Architecture: CDN-First Distribution

This document describes the architecture decisions made for Yetzirah's Phase 3 CDN distribution system. It serves as onboarding documentation for contributors and explains the rationale behind key design choices.

## Overview

Phase 3 transforms Yetzirah from a build-required npm package into a buildless, CDN-first component library. The goals were:

1. **Zero-build usage**: Load via `<script type="module">` with no bundler
2. **Sub-10KB Tier 1 bundle**: All essential components in <10KB gzipped
3. **Global performance**: <3s load time on 3G networks
4. **Multi-framework support**: Works with vanilla JS, Preact+HTM, and all major frameworks

## Build Pipeline Architecture

### Tool Selection: tsup + esbuild

We chose tsup (powered by esbuild) over Rollup for CDN bundle generation:

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
| Full bundle | `core.js` | All 19 components, single request |
| Tier 1 bundle | `tier1.js` | 12 essential components, optimized size |
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
<script type="module" src="https://cdn.jsdelivr.net/.../cdn/auto.js"></script>
<!-- Components work immediately -->
<ytz-dialog>...</ytz-dialog>
```

Custom element registration is idempotent - multiple script loads don't cause errors.

## Bundle Structure

### Size Breakdown

| Bundle Type | Gzipped Size | Components |
|-------------|--------------|------------|
| tier1.js | 6.49 KB | 12 core components |
| core.js | 10.96 KB | All 19 components |
| Individual (avg) | 0.5-3 KB | Single component |

### Component Tiers

**Tier 1** (Essential - included in tier1.js):
- Button, Disclosure, Dialog, Tabs
- Tooltip, Menu, Autocomplete, Listbox
- Select, Accordion, Drawer, Popover

**Tier 2** (Extended - core.js only):
- Toggle, Chip, Slider, Icon Button
- Theme Toggle, DataGrid

Tier classification is based on usage frequency and complexity:
- Tier 1: >70% of applications need these
- Tier 2: Specialized use cases

### Individual Bundle Sizes

Each component can be loaded independently:

| Component | Gzipped |
|-----------|---------|
| button.js | 504 B |
| disclosure.js | 551 B |
| toggle.js | 540 B |
| chip.js | 614 B |
| accordion.js | 758 B |
| dialog.js | 906 B |
| drawer.js | 1.00 KB |
| tabs.js | 1.12 KB |
| tooltip.js | 1.23 KB |
| listbox.js | 1.24 KB |
| popover.js | 1.35 KB |
| menu.js | 1.91 KB |
| select.js | 2.21 KB |
| autocomplete.js | 2.59 KB |
| datagrid.js | 2.99 KB |

### Utility Sharing Strategy

Shared utilities (focus trap, positioning, keyboard navigation) are inlined into each bundle. This creates some duplication but ensures:

1. Each bundle is fully standalone
2. No cross-bundle dependencies
3. Works without import maps
4. Predictable behavior

For applications using multiple components, the combined bundles (`tier1.js`, `core.js`) provide de-duplicated utilities.

## Performance Optimizations

### Bundle Size Optimizations

1. **Aggressive tree-shaking**: Unused code paths eliminated at build time
2. **Minification**: esbuild minifies identifiers and removes whitespace
3. **No runtime dependencies**: Zero external dependencies in bundles
4. **Targeted ES2020+**: Modern syntax without transpilation overhead

### Load Time Targets

| Network | Target | Tier 1 Actual |
|---------|--------|---------------|
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

1. **Version-pinned URLs**: `/npm/@grimoire/yetzirah-core@0.1.0/cdn/core.js`
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
    "yetzirah": "https://cdn.jsdelivr.net/.../cdn/core.js",
    "yetzirah/": "https://cdn.jsdelivr.net/.../cdn/"
  }
}
</script>
<script type="module">
  import 'yetzirah';                    // All components
  import 'yetzirah/dialog.js';          // Single component
</script>
```

Browser support: Chrome 89+, Edge 89+, Safari 16.4+, Firefox 108+

### Preact + HTM Pattern

For React-like DX without transpilation:

```javascript
import { html } from 'htm/preact';
import { useRef, useState } from 'preact/hooks';

function App() {
  const dialogRef = useRef(null);
  return html`
    <ytz-button onClick=${() => dialogRef.current?.showModal()}>
      Open
    </ytz-button>
    <ytz-dialog ref=${dialogRef}>Content</ytz-dialog>
  `;
}
```

Total stack size: ~7KB (Preact 4KB + HTM 1KB + Yetzirah tier1 6KB = 11KB)

### Vanilla JavaScript

Components work with standard DOM APIs:

```javascript
const dialog = document.querySelector('ytz-dialog');
dialog.addEventListener('close', () => console.log('closed'));
dialog.showModal();
```

## Testing Infrastructure

### Performance Testing Suite

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

### Decision: Tier 1 Target <10KB

**Context**: What size budget for the core bundle?

**Decision**: <10KB gzipped for Tier 1, <15KB for full bundle.

**Rationale**:
- Competitive with Headless UI (~68KB) at 4-5x smaller
- Enables <3s load on Fast 3G
- Allows room for future components
- Matches industry best practices

**Trade-off**: Limits complexity per component.

## Future Improvements

### Potential Optimizations

1. **Brotli Compression**: CDNs serve Brotli to supported browsers (~10-15% smaller than gzip)

2. **HTTP/2 Push**: Push critical CSS alongside components

3. **Shared Chunk Support**: For import map users, optional shared utilities chunk

4. **Streaming SSR**: Web components with declarative shadow DOM for SSR hydration

### Monitoring Opportunities

1. **Real User Metrics**: Collect LCP/FCP from production usage
2. **CDN Analytics**: Track which components are most used
3. **Error Tracking**: Monitor registration failures

### Potential New Bundles

1. **Form bundle**: Select, Autocomplete, Toggle, Slider (~5KB)
2. **Layout bundle**: Drawer, Dialog, Tabs, Accordion (~4KB)
3. **Data bundle**: DataGrid with virtual scrolling

## Quick Reference

### CDN URLs

```html
<!-- All components -->
<script type="module" src="https://cdn.jsdelivr.net/npm/@grimoire/yetzirah-core@latest/cdn/core.js"></script>

<!-- Tier 1 only (recommended) -->
<script type="module" src="https://cdn.jsdelivr.net/npm/@grimoire/yetzirah-core@latest/cdn/tier1.js"></script>

<!-- Single component -->
<script type="module" src="https://cdn.jsdelivr.net/npm/@grimoire/yetzirah-core@latest/cdn/dialog.js"></script>
```

### Size Comparison

| Library | React Bundle | Vue Bundle |
|---------|--------------|------------|
| Yetzirah (core + wrapper) | ~15 KB | ~17 KB |
| Headless UI | ~68 KB | ~68 KB |
| Difference | **4.5x smaller** | **4x smaller** |

### Related Documentation

- [CDN Usage Guide](./cdn-usage.md) - Getting started with CDN
- [CDN Hosting Guide](./cdn-hosting.md) - Self-hosting and CDN options
- [Bundle Report](./bundle-report.md) - Current bundle sizes
- [Performance Guide](./performance.md) - Optimization strategies
- [Preact + HTM Guide](./preact-htm.md) - Buildless React alternative
- [Vanilla Patterns](./vanilla-patterns.md) - Framework-free usage

---

*Last updated: Phase 3 release*
