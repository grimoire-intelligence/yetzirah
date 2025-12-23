import { defineConfig } from 'tsup'

export default defineConfig({
  entry: [
    // Index (all components)
    'src/index.js',
    // Tier 1 components
    'src/button.js',
    'src/disclosure.js',
    'src/dialog.js',
    'src/tabs.js',
    'src/tooltip.js',
    'src/menu.js',
    'src/autocomplete.js',
    'src/listbox.js',
    'src/select.js',
    'src/accordion.js',
    'src/drawer.js',
    'src/popover.js',
    // Tier 2 components
    'src/toggle.js',
    'src/chip.js',
    'src/icon-button.js',
    'src/slider.js',
    'src/datagrid.js',
    'src/theme-toggle.js',
  ],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: true,
  outDir: 'dist',
})
