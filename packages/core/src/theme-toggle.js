/**
 * ytz-theme-toggle - Theme switching Web Component.
 * A toggle switch that controls light/dark theme with persistence.
 *
 * @module @grimoire/yetzirah-core/theme-toggle
 * @example
 * <ytz-theme-toggle></ytz-theme-toggle>
 *
 * @example
 * // With custom storage key
 * <ytz-theme-toggle storage-key="my-app-theme"></ytz-theme-toggle>
 *
 * @example
 * // Without persistence
 * <ytz-theme-toggle no-persist></ytz-theme-toggle>
 */

import './toggle.js'

/** @type {string} Default localStorage key */
const DEFAULT_STORAGE_KEY = 'yetzirah-theme'

/** @type {string} CSS class applied to document for dark mode */
const DARK_CLASS = 'dark-mode'

/** @type {string} Data attribute for theme */
const THEME_ATTR = 'data-theme'

/**
 * @class YtzThemeToggle
 * @extends HTMLElement
 */
class YtzThemeToggle extends HTMLElement {
  static observedAttributes = ['storage-key', 'no-persist']

  /** @type {HTMLElement|null} */
  #toggle = null

  connectedCallback() {
    this.#setup()
    this.#initializeTheme()
  }

  disconnectedCallback() {
    this.#toggle?.removeEventListener('change', this.#handleChange)
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (this.isConnected && name === 'storage-key') {
      this.#initializeTheme()
    }
  }

  #setup() {
    // Create inner toggle if not present
    if (!this.#toggle) {
      this.#toggle = document.createElement('ytz-toggle')
      this.#toggle.setAttribute('aria-label', 'Toggle dark mode')

      // Move existing children into toggle as label
      while (this.firstChild) {
        this.#toggle.appendChild(this.firstChild)
      }

      // Default label if none provided
      if (!this.#toggle.textContent.trim()) {
        this.#toggle.textContent = 'Dark mode'
      }

      this.appendChild(this.#toggle)
    }

    this.#toggle.addEventListener('change', this.#handleChange)
  }

  #initializeTheme() {
    const savedTheme = this.#loadTheme()
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    // Determine initial theme: saved > system preference > light
    const isDark = savedTheme === 'dark' || (savedTheme === null && prefersDark)

    this.#applyTheme(isDark)
    this.#updateToggle(isDark)

    // Listen for system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!this.#loadTheme()) {
        // Only respond to system changes if no saved preference
        this.#applyTheme(e.matches)
        this.#updateToggle(e.matches)
      }
    })
  }

  #handleChange = (e) => {
    const isDark = e.detail.checked
    this.#applyTheme(isDark)
    this.#saveTheme(isDark ? 'dark' : 'light')

    this.dispatchEvent(new CustomEvent('themechange', {
      bubbles: true,
      detail: { theme: isDark ? 'dark' : 'light', isDark }
    }))
  }

  #applyTheme(isDark) {
    const root = document.documentElement

    if (isDark) {
      root.classList.add(DARK_CLASS)
      root.setAttribute(THEME_ATTR, 'dark')
    } else {
      root.classList.remove(DARK_CLASS)
      root.setAttribute(THEME_ATTR, 'light')
    }
  }

  #updateToggle(isDark) {
    if (!this.#toggle) return

    if (isDark) {
      this.#toggle.setAttribute('checked', '')
    } else {
      this.#toggle.removeAttribute('checked')
    }
  }

  #loadTheme() {
    if (this.hasAttribute('no-persist')) return null

    try {
      return localStorage.getItem(this.storageKey)
    } catch {
      // localStorage may be unavailable
      return null
    }
  }

  #saveTheme(theme) {
    if (this.hasAttribute('no-persist')) return

    try {
      localStorage.setItem(this.storageKey, theme)
    } catch {
      // localStorage may be unavailable
    }
  }

  /**
   * Get the storage key for theme persistence.
   * @type {string}
   */
  get storageKey() {
    return this.getAttribute('storage-key') || DEFAULT_STORAGE_KEY
  }

  set storageKey(value) {
    this.setAttribute('storage-key', value)
  }

  /**
   * Get the current theme.
   * @type {'light'|'dark'}
   */
  get theme() {
    return document.documentElement.classList.contains(DARK_CLASS) ? 'dark' : 'light'
  }

  /**
   * Set the theme programmatically.
   * @param {'light'|'dark'} value
   */
  set theme(value) {
    const isDark = value === 'dark'
    this.#applyTheme(isDark)
    this.#updateToggle(isDark)
    this.#saveTheme(value)
  }

  /**
   * Check if dark mode is active.
   * @type {boolean}
   */
  get isDark() {
    return this.theme === 'dark'
  }

  /**
   * Toggle the theme.
   */
  toggle() {
    this.theme = this.isDark ? 'light' : 'dark'
  }
}

customElements.define('ytz-theme-toggle', YtzThemeToggle)

export { YtzThemeToggle }
