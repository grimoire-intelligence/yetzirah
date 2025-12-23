# CDN Hosting Guide

This guide covers how to use Yetzirah from popular CDN providers and how to self-host the CDN bundles.

## Quick Start

The fastest way to get started is with a single script tag:

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@grimoire/yetzirah-core@latest/cdn/core.js"></script>
```

All `ytz-*` custom elements are now available in your HTML.

## CDN Providers

### jsDelivr (Recommended)

[jsDelivr](https://www.jsdelivr.com/) is a global CDN with excellent worldwide performance and reliability.

```html
<!-- All components -->
<script type="module" src="https://cdn.jsdelivr.net/npm/@grimoire/yetzirah-core@latest/cdn/core.js"></script>

<!-- Tier 1 only (~6KB gzipped) -->
<script type="module" src="https://cdn.jsdelivr.net/npm/@grimoire/yetzirah-core@latest/cdn/tier1.js"></script>

<!-- Individual components -->
<script type="module" src="https://cdn.jsdelivr.net/npm/@grimoire/yetzirah-core@latest/cdn/dialog.js"></script>
<script type="module" src="https://cdn.jsdelivr.net/npm/@grimoire/yetzirah-core@latest/cdn/tabs.js"></script>
```

**Advantages:**
- Global CDN with edge nodes worldwide
- Automatic minification and compression
- SRI hash support
- Permanent URL caching for versioned packages

### unpkg

[unpkg](https://unpkg.com/) is a fast, global CDN for npm packages.

```html
<!-- All components -->
<script type="module" src="https://unpkg.com/@grimoire/yetzirah-core@latest/cdn/core.js"></script>

<!-- Tier 1 only -->
<script type="module" src="https://unpkg.com/@grimoire/yetzirah-core@latest/cdn/tier1.js"></script>

<!-- Individual component -->
<script type="module" src="https://unpkg.com/@grimoire/yetzirah-core@latest/cdn/dialog.js"></script>
```

**Advantages:**
- Direct npm package access
- Simple URL structure
- Good for prototyping

### esm.sh

[esm.sh](https://esm.sh/) is optimized for ES modules with automatic dependency handling.

```html
<!-- All components -->
<script type="module" src="https://esm.sh/@grimoire/yetzirah-core@latest/cdn/core.js"></script>

<!-- With specific target -->
<script type="module" src="https://esm.sh/@grimoire/yetzirah-core@latest/cdn/core.js?target=es2022"></script>
```

**Advantages:**
- TypeScript support with auto-generated `.d.ts`
- Target-specific builds (es2020, es2022, etc.)
- X-TypeScript-Types header for IDE support

### Skypack

[Skypack](https://www.skypack.dev/) provides optimized packages for modern browsers.

```html
<script type="module" src="https://cdn.skypack.dev/@grimoire/yetzirah-core/cdn/core.js"></script>
```

**Advantages:**
- Automatic browser compatibility handling
- HTTP/2 push for dependencies
- Built-in package optimization

## Version Pinning

### Production Best Practices

Always pin to a specific version in production to ensure consistent behavior:

```html
<!-- Exact version (recommended for production) -->
<script type="module" src="https://cdn.jsdelivr.net/npm/@grimoire/yetzirah-core@0.1.0/cdn/core.js"></script>
```

### Version Strategies

| Pattern | Example URL | Updates Received |
|---------|-------------|------------------|
| Exact | `@0.1.0` | None (fixed) |
| Patch range | `@0.1` | Patch updates (0.1.1, 0.1.2) |
| Minor range | `@0` | Minor + patch (0.2.0, 0.1.1) |
| Latest | `@latest` | All updates |

### Recommendations by Environment

| Environment | Strategy | Example |
|-------------|----------|---------|
| Production | Exact version | `@0.1.0` |
| Staging | Patch range | `@0.1` |
| Development | Latest | `@latest` |

## Subresource Integrity (SRI)

For maximum security, use SRI hashes to ensure files haven't been tampered with:

```html
<script type="module"
  src="https://cdn.jsdelivr.net/npm/@grimoire/yetzirah-core@0.1.0/cdn/core.js"
  integrity="sha384-HASH_HERE"
  crossorigin="anonymous"></script>
```

### Generating SRI Hashes

1. **Online tool:** Use [srihash.org](https://www.srihash.org/)
2. **Command line:**
   ```bash
   curl -s https://cdn.jsdelivr.net/npm/@grimoire/yetzirah-core@0.1.0/cdn/core.js | openssl dgst -sha384 -binary | openssl base64 -A
   ```

## Self-Hosting

### Why Self-Host?

- **Compliance:** Data residency requirements
- **Privacy:** Avoid third-party CDN tracking
- **Reliability:** Independence from external services
- **Performance:** Custom edge caching strategy

### Download and Host

1. **Install the package:**
   ```bash
   npm install @grimoire/yetzirah-core
   ```

2. **Copy CDN files to your static directory:**
   ```bash
   cp -r node_modules/@grimoire/yetzirah-core/cdn ./public/vendor/yetzirah/
   ```

3. **Reference from your HTML:**
   ```html
   <script type="module" src="/vendor/yetzirah/core.js"></script>
   ```

### Build Script Example

```javascript
// scripts/vendor-cdn.js
import { copyFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';

const files = [
  'core.js',
  'core.js.map',
  'tier1.js',
  'tier1.js.map',
  // Add individual components as needed
];

const src = 'node_modules/@grimoire/yetzirah-core/cdn';
const dest = 'public/vendor/yetzirah';

mkdirSync(dest, { recursive: true });

for (const file of files) {
  copyFileSync(join(src, file), join(dest, file));
}

console.log('Yetzirah CDN files copied to', dest);
```

### Server Configuration

Ensure proper headers for JavaScript modules:

**Nginx:**
```nginx
location /vendor/yetzirah/ {
    types {
        application/javascript js;
    }
    add_header Cache-Control "public, max-age=31536000, immutable";
    add_header Access-Control-Allow-Origin *;
}
```

**Apache (.htaccess):**
```apache
<FilesMatch "\.js$">
    Header set Content-Type "application/javascript"
    Header set Cache-Control "public, max-age=31536000, immutable"
    Header set Access-Control-Allow-Origin "*"
</FilesMatch>
```

## Import Maps

Import maps provide an npm-like developer experience without a build step:

```html
<script type="importmap">
{
  "imports": {
    "yetzirah": "https://cdn.jsdelivr.net/npm/@grimoire/yetzirah-core@0.1.0/cdn/core.js",
    "yetzirah/": "https://cdn.jsdelivr.net/npm/@grimoire/yetzirah-core@0.1.0/cdn/"
  }
}
</script>

<script type="module">
  // npm-style imports work!
  import 'yetzirah';

  // Or individual components
  import 'yetzirah/dialog.js';
</script>
```

### Browser Compatibility

| Browser | Import Maps Support |
|---------|---------------------|
| Chrome | 89+ (March 2021) |
| Edge | 89+ (March 2021) |
| Safari | 16.4+ (March 2023) |
| Firefox | 108+ (December 2022) |

For older browsers, use the [es-module-shims](https://github.com/guybedford/es-module-shims) polyfill:

```html
<script async src="https://ga.jspm.io/npm:es-module-shims@1.10.0/dist/es-module-shims.js"></script>
```

## Cache Considerations

### CDN Caching

Public CDNs cache aggressively. When updating versions:

1. **Use versioned URLs:** Ensures cache busting on updates
2. **Update all references:** Check HTML, import maps, and documentation
3. **Test after deploy:** Verify new version loads correctly

### Browser Caching

Module scripts are cached by the browser. For development:

- Use `@latest` tag (note: CDN may still cache briefly)
- Add cache-busting query param: `?v=timestamp`
- Use browser DevTools to disable cache

### Service Worker Caching

If using a service worker, include Yetzirah URLs in your caching strategy:

```javascript
// sw.js
const YETZIRAH_VERSION = '0.1.0';
const YETZIRAH_URLS = [
  `https://cdn.jsdelivr.net/npm/@grimoire/yetzirah-core@${YETZIRAH_VERSION}/cdn/core.js`,
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('vendor-v1').then((cache) => cache.addAll(YETZIRAH_URLS))
  );
});
```

## Troubleshooting

### Components Not Rendering

1. **Check script type:** Must be `type="module"`
2. **Verify URL:** Open the script URL directly in browser
3. **Check console:** Look for CORS or 404 errors
4. **Wait for load:** Components register asynchronously

### CORS Errors

- Public CDNs handle CORS automatically
- For self-hosting, add `Access-Control-Allow-Origin` header
- Ensure `crossorigin` attribute matches your setup

### Import Map Not Working

1. Import map must appear **before** any module scripts
2. Check browser compatibility (see table above)
3. Add es-module-shims polyfill for older browsers
4. Validate JSON syntax in import map

---

See also:
- [CDN Usage Guide](./cdn-usage.md)
- [CDN Demo](../demos/cdn/index.html)
- [Import Map Demo](../demos/cdn/importmap.html)
