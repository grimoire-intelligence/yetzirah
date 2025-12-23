<!--
  Svelte wrapper for ytz-icon-button Web Component.
  Provides icon button with required aria-label for accessibility.

  @module @grimoire/yetzirah-svelte/IconButton
-->
<script>
  import '@grimoire/yetzirah-core'

  /**
   * IconButton component - button for icon-only actions.
   *
   * @slot default - Icon content (SVG, emoji, etc.)
   *
   * @example
   * <IconButton label="Close" on:click={close}>
   *   ✕
   * </IconButton>
   *
   * @example
   * <IconButton label="Settings" disabled>
   *   ⚙️
   * </IconButton>
   */

  /** Required accessible label for the icon button */
  export let label = ''

  /** Disable button */
  export let disabled = false

  /** Optional href for navigation (makes it an anchor-like button) */
  export let href = undefined
</script>

<ytz-icon-button
  aria-label={label}
  {disabled}
  {href}
  class={$$props.class}
  {...$$restProps}
  on:click
>
  <slot />
</ytz-icon-button>

<style>
  /* Component inherits styles from web component */
</style>
