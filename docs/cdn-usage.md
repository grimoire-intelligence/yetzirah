# CDN Usage Guide

Yetzirah can be loaded directly from CDN with no build step required. This guide covers the various ways to use Yetzirah from CDN.

## Quick Start

Add a single script tag to start using Yetzirah components:

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@grimoire/yetzirah-core@latest/cdn/core.js"></script>
```

That's it! All components are now available:

```html
<yz-dialog id="my-dialog">
  <h2>Hello World</h2>
  <p>This dialog works out of the box.</p>
</yz-dialog>

<button onclick="document.querySelector('#my-dialog').showModal()">
  Open Dialog
</button>
```

## CDN Providers

Yetzirah is available on multiple CDN providers:

### jsDelivr (Recommended)

Global CDN with excellent performance worldwide.

```html
<!-- All components -->
<script type="module" src="https://cdn.jsdelivr.net/npm/@grimoire/yetzirah-core@latest/cdn/core.js"></script>

<!-- Individual component -->
<script type="module" src="https://cdn.jsdelivr.net/npm/@grimoire/yetzirah-core@latest/cdn/dialog.js"></script>
```

### unpkg

Direct npm CDN access.

```html
<script type="module" src="https://unpkg.com/@grimoire/yetzirah-core@latest/cdn/core.js"></script>
```

### esm.sh

Optimized for ES modules with automatic type generation.

```html
<script type="module" src="https://esm.sh/@grimoire/yetzirah-core@latest/cdn/core.js"></script>
```

## Import Maps

Import maps provide an npm-like developer experience without a build step. They allow bare specifier imports like `import 'yetzirah'` to resolve to CDN URLs.

### Basic Setup

```html
<!DOCTYPE html>
<html>
<head>
  <!-- Import Map Definition -->
  <script type="importmap">
  {
    "imports": {
      "yetzirah": "https://cdn.jsdelivr.net/npm/@grimoire/yetzirah-core@latest/cdn/core.js",
      "yetzirah/": "https://cdn.jsdelivr.net/npm/@grimoire/yetzirah-core@latest/cdn/"
    }
  }
  </script>
</head>
<body>
  <script type="module">
    // Import all components
    import 'yetzirah';

    // Or import individual components
    import 'yetzirah/dialog.js';
    import 'yetzirah/tabs.js';
  </script>
</body>
</html>
```

### Browser Compatibility

Import maps are supported in:

| Browser | Version | Released |
|---------|---------|----------|
| Chrome | 89+ | March 2021 |
| Edge | 89+ | March 2021 |
| Safari | 16.4+ | March 2023 |
| Firefox | 108+ | December 2022 |

For older browsers, use the es-module-shims polyfill:

```html
<!-- Add before importmap (async, ~3KB) -->
<script async src="https://ga.jspm.io/npm:es-module-shims@1.10.0/dist/es-module-shims.js"></script>
```

## Individual Component Bundles

For minimal payload, load only the components you need:

```html
<!-- Load just the dialog component (~1KB gzipped) -->
<script type="module" src="https://cdn.jsdelivr.net/npm/@grimoire/yetzirah-core@latest/cdn/dialog.js"></script>

<yz-dialog id="my-dialog">
  <p>Minimal bundle, maximum functionality.</p>
</yz-dialog>
```

### Available Bundles

#### Tier 1 Components

| Component | Bundle | Size (gzip) |
|-----------|--------|-------------|
| Button | `cdn/button.js` | ~0.5 KB |
| Disclosure | `cdn/disclosure.js` | ~0.6 KB |
| Dialog | `cdn/dialog.js` | ~0.9 KB |
| Tabs | `cdn/tabs.js` | ~1.2 KB |
| Tooltip | `cdn/tooltip.js` | ~1.3 KB |
| Menu | `cdn/menu.js` | ~2.0 KB |
| Listbox | `cdn/listbox.js` | ~1.3 KB |
| Select | `cdn/select.js` | ~2.3 KB |
| Autocomplete | `cdn/autocomplete.js` | ~2.7 KB |
| Accordion | `cdn/accordion.js` | ~0.8 KB |
| Drawer | `cdn/drawer.js` | ~1.0 KB |
| Popover | `cdn/popover.js` | ~1.4 KB |

#### Tier 2 Components

| Component | Bundle | Size (gzip) |
|-----------|--------|-------------|
| Toggle | `cdn/toggle.js` | ~0.6 KB |
| Chip | `cdn/chip.js` | ~0.6 KB |
| Icon Button | `cdn/icon-button.js` | ~0.9 KB |
| Slider | `cdn/slider.js` | ~1.2 KB |
| Theme Toggle | `cdn/theme-toggle.js` | ~1.1 KB |
| DataGrid | `cdn/datagrid.js` | ~3.1 KB |

#### Combined Bundles

| Bundle | Contents | Size (gzip) |
|--------|----------|-------------|
| `cdn/tier1.js` | Tier 1 components only | ~6.5 KB |
| `cdn/core.js` | All components (Tier 1 + 2) | ~11 KB |
| `cdn/index.js` | Tree-shakeable exports | ~11 KB |

**Recommended:** Use `tier1.js` for the smallest payload with all essential components.

## Version Pinning

### Production Recommendations

For production, always pin to a specific version:

```html
<!-- Exact version (most stable) -->
<script type="module" src="https://cdn.jsdelivr.net/npm/@grimoire/yetzirah-core@0.1.0/cdn/core.js"></script>
```

### Version Strategies

| Pattern | Example | Receives |
|---------|---------|----------|
| Exact | `@0.1.0` | Nothing (fixed) |
| Patch | `@0.1` | Patch updates (0.1.1, 0.1.2) |
| Minor | `@0` | Minor + patch (0.2.0, 0.1.1) |
| Latest | `@latest` | All updates |

### SRI (Subresource Integrity)

For maximum security, use SRI hashes:

```html
<script type="module"
  src="https://cdn.jsdelivr.net/npm/@grimoire/yetzirah-core@0.1.0/cdn/core.js"
  integrity="sha384-..."
  crossorigin="anonymous"></script>
```

Generate SRI hashes at [srihash.org](https://www.srihash.org/).

## With Tachyons CSS

Yetzirah components are unstyled by default. Pair with Tachyons for rapid styling:

```html
<!DOCTYPE html>
<html>
<head>
  <!-- Tachyons CSS -->
  <link rel="stylesheet" href="https://unpkg.com/tachyons@4/css/tachyons.min.css">

  <!-- Yetzirah Components -->
  <script type="module" src="https://cdn.jsdelivr.net/npm/@grimoire/yetzirah-core@latest/cdn/core.js"></script>
</head>
<body class="sans-serif pa4">
  <yz-dialog id="styled-dialog" class="pa4 br3 shadow-2 mw6">
    <h2 class="f3 mt0 mb3">Styled with Tachyons</h2>
    <p class="f5 gray">Functional CSS makes styling fast and consistent.</p>
    <form method="dialog">
      <button class="bg-blue white bn pa2 br2 pointer">Close</button>
    </form>
  </yz-dialog>

  <button class="bg-blue white bn pa2 br2 pointer"
          onclick="document.querySelector('#styled-dialog').showModal()">
    Open Styled Dialog
  </button>
</body>
</html>
```

## Complete Example

Here's a full example with import maps, Tachyons, and multiple components:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Yetzirah CDN Example</title>

  <!-- Tachyons CSS -->
  <link rel="stylesheet" href="https://unpkg.com/tachyons@4/css/tachyons.min.css">

  <!-- Import Map (optional but nice DX) -->
  <script type="importmap">
  {
    "imports": {
      "yetzirah": "https://cdn.jsdelivr.net/npm/@grimoire/yetzirah-core@latest/cdn/core.js"
    }
  }
  </script>
</head>
<body class="sans-serif pa4 mw7 center">
  <h1 class="f2 mb4">My App</h1>

  <!-- Tabs for navigation -->
  <yz-tabs>
    <yz-tablist class="flex bb b--light-gray mb3">
      <yz-tab class="pa2 bg-transparent bn pointer" selected>Home</yz-tab>
      <yz-tab class="pa2 bg-transparent bn pointer">Settings</yz-tab>
    </yz-tablist>
    <yz-tabpanel class="pa3 bg-near-white br2">
      <p>Welcome to the home tab!</p>
    </yz-tabpanel>
    <yz-tabpanel class="pa3 bg-near-white br2">
      <p>Configure your settings here.</p>
    </yz-tabpanel>
  </yz-tabs>

  <!-- Load components -->
  <script type="module">
    import 'yetzirah';
  </script>
</body>
</html>
```

## Troubleshooting

### Components not rendering

1. Ensure the script has `type="module"`
2. Check browser console for errors
3. Verify the CDN URL is accessible

### Import map not working

1. Ensure import map appears **before** any module scripts
2. Check browser compatibility (see table above)
3. Add es-module-shims polyfill for older browsers

### CORS errors

- CDN providers handle CORS automatically
- If self-hosting, ensure proper `Access-Control-Allow-Origin` headers

---

See also:
- [Import Map Demo](../demos/cdn/importmap.html)
- [Bundle Report](./bundle-report.md)
