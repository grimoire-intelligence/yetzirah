<script>
  /**
   * Svelte wrapper for ytz-theme-toggle Web Component.
   * Provides theme switching with persistence and system preference detection.
   *
   * @module @yetzirah/svelte/ThemeToggle
   *
   * @example
   * // Basic usage
   * <ThemeToggle on:themechange={(e) => console.log(e.detail.theme)} />
   *
   * @example
   * // With custom storage key
   * <ThemeToggle storageKey="my-app-theme">Dark mode</ThemeToggle>
   *
   * @example
   * // Without persistence
   * <ThemeToggle noPersist on:themechange={(e) => console.log(e.detail.theme)}>
   *   Toggle theme
   * </ThemeToggle>
   */

  import '@yetzirah/core'

  /**
   * The current theme ('light' or 'dark')
   * @type {'light' | 'dark' | undefined}
   */
  export let theme = undefined

  /**
   * localStorage key for persistence (default: 'yetzirah-theme')
   * @type {string | undefined}
   */
  export let storageKey = undefined

  /**
   * Disable localStorage persistence
   * @type {boolean | undefined}
   */
  export let noPersist = undefined

  // Forward themechange event
  // $$restProps forwards class and other attributes
</script>

<ytz-theme-toggle
  {theme}
  storage-key={storageKey}
  no-persist={noPersist || undefined}
  on:themechange
  {...$$restProps}
>
  <slot />
</ytz-theme-toggle>
