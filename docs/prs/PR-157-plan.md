# PR-157: CDN Distribution for New Components & Plugins

## Overview

Add CDN bundles for the three new Tier 3 components (Snackbar, Progress, Badge) and create a CDN-friendly bundle for the Alpine.js plugin. Update documentation to reflect new bundles.

## Current State

### Core Package CDN
- `tsup.cdn.config.js` builds individual bundles for Tier 1 and Tier 2 components
- Missing entries for: `snackbar.js`, `progress.js`, `badge.js`
- Source files exist at `packages/core/src/{snackbar,progress,badge}.js`
- Components are exported in `index.js` but not individually bundled for CDN

### Alpine Package
- Builds to `dist/index.js` (ESM) and `dist/index.cjs` (CommonJS)
- No CDN-specific bundle (self-contained with external deps inlined)
- Users currently need import maps to resolve the package

## Implementation Plan

### Step 1: Add Core Component CDN Entries

Modify `packages/core/tsup.cdn.config.js` to add entries:

```js
entry: {
  // ... existing entries ...
  'snackbar': 'src/snackbar.js',
  'progress': 'src/progress.js',
  'badge': 'src/badge.js',
}
```

### Step 2: Create Alpine CDN Build

Create `packages/alpine/tsup.cdn.config.js`:

```js
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    'yetzirah-alpine': 'src/index.ts',
  },
  format: ['esm'],
  dts: false,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: true,
  outDir: 'cdn',
  // For CDN, bundle Alpine dependency but externalize yetzirah-core
  // (users load core separately via CDN)
  external: ['@grimoire/yetzirah-core'],
  noExternal: ['alpinejs'],
})
```

Add npm script to `packages/alpine/package.json`:
```json
"build:cdn": "tsup --config tsup.cdn.config.js"
```

Update exports in `packages/alpine/package.json`:
```json
"./cdn": {
  "import": "./cdn/yetzirah-alpine.js"
}
```

### Step 3: Update Documentation

Update `docs/cdn-usage.md` to add:

1. New Tier 3 Components section:
```markdown
#### Tier 3 Components

| Component | Bundle | Size (gzip) |
|-----------|--------|-------------|
| Snackbar | `cdn/snackbar.js` | ~0.8 KB |
| Progress | `cdn/progress.js` | ~0.6 KB |
| Badge | `cdn/badge.js` | ~0.5 KB |
```

2. Alpine plugin CDN usage:
```markdown
## Alpine.js Plugin

Load the Alpine plugin directly from CDN:

\`\`\`html
<script type="importmap">
{
  "imports": {
    "alpinejs": "https://cdn.jsdelivr.net/npm/alpinejs@3/dist/cdn.min.js",
    "@grimoire/yetzirah-alpine": "https://cdn.jsdelivr.net/npm/@grimoire/yetzirah-alpine@latest/cdn/yetzirah-alpine.js"
  }
}
</script>
\`\`\`
```

### Step 4: Build and Verify

1. Run `pnpm build:cdn` in core package
2. Run `pnpm build:cdn` in alpine package
3. Verify new files exist in `cdn/` directories
4. Check bundle sizes are reasonable

## Files to Modify

| File | Action | Description |
|------|--------|-------------|
| `packages/core/tsup.cdn.config.js` | Modify | Add snackbar, progress, badge entries |
| `packages/alpine/tsup.cdn.config.js` | Create | CDN build config for Alpine plugin |
| `packages/alpine/package.json` | Modify | Add build:cdn script and exports |
| `docs/cdn-usage.md` | Modify | Document new bundles and Alpine CDN usage |

## Acceptance Criteria

- [ ] `cdn/snackbar.js` exists and exports YtzSnackbar
- [ ] `cdn/progress.js` exists and exports YtzProgress
- [ ] `cdn/badge.js` exists and exports YtzBadge
- [ ] `cdn/yetzirah-alpine.js` exists in alpine package
- [ ] All CDN bundles are minified with source maps
- [ ] Documentation updated with new bundle listings
- [ ] Alpine CDN bundle works with direct script import

## Notes

- The Alpine CDN bundle should NOT inline Alpine.js itself (too large, users likely have it already)
- Instead, mark Alpine as external and let users load it via import map
- This matches the pattern used in the server framework integration guides (PR-156)
