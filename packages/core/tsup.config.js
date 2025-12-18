import { defineConfig } from 'tsup'

export default defineConfig({
  entry: [
    'src/index.js',
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
