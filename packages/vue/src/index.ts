/**
 * @yetzirah/vue
 *
 * Vue 3 wrappers for Yetzirah Web Components.
 * Provides Vue-idiomatic APIs with full TypeScript support.
 *
 * @packageDocumentation
 */

// Re-export core version
export { VERSION } from '@yetzirah/core'

// Tier 2 component wrappers
export { default as Toggle } from './Toggle.vue'
export { default as Chip } from './Chip.vue'
export { default as IconButton } from './IconButton.vue'
export { default as Slider } from './Slider.vue'
export { default as ThemeToggle } from './ThemeToggle.vue'
export { default as DataGrid } from './DataGrid.vue'

// Export shared types
export type * from './types'
