<!--
  Svelte wrapper for ytz-button Web Component.
  Polymorphic button/anchor that renders <a> when href provided, <button> otherwise.

  @module @grimoire/yetzirah-svelte/Button
-->
<script>
  import '@grimoire/yetzirah-core'

  /**
   * Button component - polymorphic button/anchor.
   * Renders as <a> when href is provided, <button> otherwise.
   *
   * @slot default - Button text or content
   *
   * @example
   * <Button on:click={handleSubmit}>Submit</Button>
   *
   * @example
   * <Button href="/dashboard">Go to Dashboard</Button>
   *
   * @example
   * <Button disabled>Disabled Button</Button>
   *
   * @example
   * <Button type="submit">Submit Form</Button>
   */

  /** Optional href for navigation (makes it an anchor) */
  export let href = undefined

  /** Disable button (only applies when href is not set) */
  export let disabled = false

  /** Button type attribute (only applies when href is not set) */
  export let type = 'button'
</script>

<ytz-button
  href={href || undefined}
  {disabled}
  {type}
  class={$$props.class}
  {...$$restProps}
  on:click
>
  <slot />
</ytz-button>

<style>
  /* Component inherits styles from web component */
</style>
