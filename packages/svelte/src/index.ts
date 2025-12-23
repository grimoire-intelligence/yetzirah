/**
 * @grimoire/yetzirah-svelte
 *
 * Svelte wrappers for Yetzirah Web Components.
 * Thin wrappers providing Svelte-idiomatic APIs.
 *
 * Note: Svelte has excellent Web Component interop.
 * These wrappers are minimal and primarily for TypeScript support.
 *
 * @packageDocumentation
 */

// Re-export core version
export { VERSION } from '@grimoire/yetzirah-core'

// Tier 2 component wrappers
export { default as Toggle } from './Toggle.svelte'
export { default as Chip } from './Chip.svelte'
export { default as IconButton } from './IconButton.svelte'
export { default as Slider } from './Slider.svelte'
export { default as ThemeToggle } from './ThemeToggle.svelte'
export { default as DataGrid } from './DataGrid.svelte'
