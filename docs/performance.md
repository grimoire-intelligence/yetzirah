# Yetzirah Performance Guide

This document outlines performance characteristics, benchmarks, and optimization strategies for Yetzirah web components.

## Performance Budgets

### Bundle Size Budgets (Gzipped)

| Bundle Type | Budget | Description |
|------------|--------|-------------|
| **Full bundle** (`core.js`) | 15KB | All 19 components in one file |
| **Tier 1 bundle** (`tier1.js`) | 10KB | Most common components |
| **Auto bundle** (`auto.js`) | 15KB | Auto-registering convenience bundle |
| **Individual components** | 1-4KB | Tree-shakeable single components |

### Individual Component Budgets

| Component | Budget | Actual* |
|-----------|--------|---------|
| `button.js` | 1KB | ~0.5KB |
| `disclosure.js` | 1KB | ~0.6KB |
| `dialog.js` | 2KB | ~1.2KB |
| `tabs.js` | 2KB | ~1.4KB |
| `tooltip.js` | 2KB | ~1.3KB |
| `menu.js` | 2KB | ~1.5KB |
| `autocomplete.js` | 3KB | ~2.5KB |
| `select.js` | 3KB | ~2.8KB |
| `listbox.js` | 2KB | ~1.5KB |
| `accordion.js` | 1.5KB | ~1.0KB |
| `drawer.js` | 2KB | ~1.2KB |
| `popover.js` | 2KB | ~1.3KB |
| `toggle.js` | 1KB | ~0.6KB |
| `chip.js` | 1KB | ~0.5KB |
| `slider.js` | 2KB | ~1.8KB |
| `icon-button.js` | 1KB | ~0.8KB |
| `theme-toggle.js` | 1.5KB | ~1.0KB |
| `datagrid.js` | 4KB | ~3.5KB |

*Actual sizes are approximate and may vary between versions.

## Network Performance Targets

### Load Time Targets by Network Condition

| Network | Full Bundle | Tier 1 Bundle | Single Component |
|---------|-------------|---------------|------------------|
| **Broadband** (25 Mbps) | < 100ms | < 75ms | < 20ms |
| **4G** (9 Mbps) | < 200ms | < 150ms | < 50ms |
| **Fast 3G** (1.5 Mbps) | < 500ms | < 400ms | < 150ms |

### Parse Time Targets

| Device Type | Full Bundle | Single Component |
|-------------|-------------|------------------|
| **Desktop** (fast) | < 10ms | < 1ms |
| **Mobile** (average) | < 30ms | < 3ms |

## Optimization Strategies

### 1. Use Individual Components for Tree-Shaking

Instead of importing the full bundle:

```html
<!-- Not optimal for production -->
<script type="module" src="https://cdn.jsdelivr.net/npm/@grimoire/yetzirah-core/cdn/core.js"></script>
```

Import only what you need:

```html
<!-- Optimal - only loads button component (~0.5KB) -->
<script type="module" src="https://cdn.jsdelivr.net/npm/@grimoire/yetzirah-core/cdn/button.js"></script>
<script type="module" src="https://cdn.jsdelivr.net/npm/@grimoire/yetzirah-core/cdn/dialog.js"></script>
```

### 2. Use Tier 1 Bundle for Common Use Cases

If you need multiple common components, the tier 1 bundle is more efficient than loading them individually:

```html
<!-- Good for apps using 5+ tier 1 components -->
<script type="module" src="https://cdn.jsdelivr.net/npm/@grimoire/yetzirah-core/cdn/tier1.js"></script>
```

### 3. Lazy Load Components

For components not needed immediately, use dynamic imports:

```js
// Load dialog only when needed
document.querySelector('#open-dialog').addEventListener('click', async () => {
  await import('https://cdn.jsdelivr.net/npm/@grimoire/yetzirah-core/cdn/dialog.js')
  document.querySelector('ytz-dialog').open = true
})
```

### 4. Preload Critical Components

For above-the-fold components, use preload hints:

```html
<link rel="modulepreload" href="https://cdn.jsdelivr.net/npm/@grimoire/yetzirah-core/cdn/button.js">
```

### 5. Use Import Maps for Cleaner Imports

```html
<script type="importmap">
{
  "imports": {
    "@yetzirah/": "https://cdn.jsdelivr.net/npm/@grimoire/yetzirah-core/cdn/"
  }
}
</script>
<script type="module">
  import '@yetzirah/button.js'
  import '@yetzirah/tabs.js'
</script>
```

## Measuring Performance

### Using the Performance Testing Script

```bash
# Run performance tests
node scripts/perf-test.js

# With network throttling simulation
node scripts/perf-test.js --throttle

# Generate markdown report
node scripts/perf-test.js --report

# Save current results as baseline
node scripts/perf-test.js --baseline

# CI mode (fails on regression)
node scripts/perf-test.js --ci
```

### Manual Testing with DevTools

1. Open Chrome DevTools > Network tab
2. Enable "Disable cache"
3. Select network throttling (Fast 3G, Slow 3G)
4. Reload and observe load times

### Lighthouse Testing

For comprehensive performance audits:

1. Open Chrome DevTools > Lighthouse tab
2. Select "Performance" category
3. Choose "Mobile" device
4. Run audit

Key metrics to watch:
- **First Contentful Paint (FCP)**: Should be < 1.8s
- **Largest Contentful Paint (LCP)**: Should be < 2.5s
- **Time to Interactive (TTI)**: Should be < 3.8s
- **Total Blocking Time (TBT)**: Should be < 200ms

## Comparison with Alternatives

### vs Headless UI

| Metric | Yetzirah | Headless UI |
|--------|----------|-------------|
| React bundle | ~15KB | ~68KB |
| Vue bundle | ~17KB | ~68KB |
| Size difference | **4x smaller** | - |

### vs Angular Material

| Metric | Yetzirah (full stack) | Angular Material |
|--------|----------------------|------------------|
| Total bundle | ~39KB | ~100-150KB |
| Size difference | **2-3x smaller** | - |

*Yetzirah stack: Core (12KB) + Angular wrappers (12KB) + Tachyons CSS (15KB)*

## CI Integration

Performance tests run automatically on:
- Push to `main` branch
- Pull requests targeting `main`

The CI workflow:
1. Builds CDN bundles
2. Runs performance tests
3. Compares against baseline
4. Fails if budgets exceeded or regressions detected
5. Comments on PRs with performance summary

### Baseline Management

The performance baseline is:
- Saved automatically on merge to `main`
- Used for regression detection on PRs
- Stored in GitHub Actions cache

## Runtime Performance

### Web Component Lifecycle

Yetzirah components are optimized for:
- **Fast registration**: Components register synchronously
- **Lazy upgrades**: Elements upgrade when connected to DOM
- **Minimal memory**: No virtual DOM overhead
- **Native events**: Uses standard DOM events

### Event Handling

Components use event delegation where possible to minimize listeners:

```js
// Menu uses single delegated listener
this.addEventListener('click', this.#handleClick)
```

### DOM Operations

Components batch DOM updates using:
- `requestAnimationFrame` for visual updates
- `MutationObserver` for reactive updates (where needed)
- Direct property access over attributes when possible

## Troubleshooting

### Bundle Size Increased?

1. Check for new dependencies
2. Review recent changes to shared utilities
3. Run `node scripts/analyze-bundle.js` for detailed breakdown

### Slow Parse Times?

1. Check for large inline data
2. Review code splitting opportunities
3. Consider lazy loading non-critical components

### Regression Detected in CI?

1. Review the performance report artifact
2. Compare with baseline to identify which bundles grew
3. Consider if the increase is justified by new features
4. If legitimate, update baseline with `--baseline` flag

---

*Last updated: 2024*
