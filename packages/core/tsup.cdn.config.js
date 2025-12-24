import { defineConfig } from 'tsup'

/**
 * CDN build config - produces bundles optimized for direct browser usage
 * via <script type="module"> without bundler
 *
 * Outputs:
 * - cdn/core.js - All components in one file
 * - cdn/{component}.js - Individual component bundles
 */
export default defineConfig({
  entry: {
    // Combined bundle with all components
    'core': 'src/index.js',
    // Re-export index for tree-shaking
    'index': 'src/cdn-index.js',
    // Auto-registration entry point for script tag usage
    'auto': 'src/cdn-entry.js',
    // Individual component bundles
    'button': 'src/button.js',
    'disclosure': 'src/disclosure.js',
    'dialog': 'src/dialog.js',
    'tabs': 'src/tabs.js',
    'tooltip': 'src/tooltip.js',
    'menu': 'src/menu.js',
    'autocomplete': 'src/autocomplete.js',
    'listbox': 'src/listbox.js',
    'select': 'src/select.js',
    'accordion': 'src/accordion.js',
    'drawer': 'src/drawer.js',
    'popover': 'src/popover.js',
    'toggle': 'src/toggle.js',
    'chip': 'src/chip.js',
    'icon-button': 'src/icon-button.js',
    'slider': 'src/slider.js',
    'datagrid': 'src/datagrid.js',
    'theme-toggle': 'src/theme-toggle.js',
  },
  format: ['esm'],
  dts: false,
  splitting: false,  // Each file is standalone, no chunks
  sourcemap: true,   // Enable source maps for debugging
  clean: true,
  treeshake: true,
  minify: true,
  outDir: 'cdn',
  esbuildOptions(options) {
    // Ensure each bundle is self-contained
    options.bundle = true
  },
})
