/**
 * @grimoire/yetzirah-alpine
 *
 * Alpine.js plugin for Yetzirah Web Components.
 * Provides directives and magics for Alpine.js integration.
 *
 * @packageDocumentation
 */

// Import and register core web components
import '@grimoire/yetzirah-core'
import { registerDirectives } from './directives'
import { registerModelDirective } from './model'

/**
 * Re-export VERSION from core
 */
export const VERSION = '0.1.0'

/**
 * Plugin options for configuring Yetzirah Alpine integration
 */
export interface YetzirahAlpineOptions {
  /** Prefix for component directives (default: 'ytz') */
  prefix?: string
}

/**
 * Options for the snackbar utility
 */
export interface SnackbarOptions {
  /** Duration in milliseconds before auto-dismiss */
  duration?: number
  /** Position on screen */
  position?: 'top' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}

/**
 * Alpine instance type - simplified for compatibility
 */
interface AlpineInstance {
  magic(name: string, callback: () => unknown): void
  directive(
    name: string,
    callback: (
      el: Element,
      directive: { expression: string; modifiers: string[] },
      utilities: {
        evaluate: (expr: string) => unknown
        effect: (fn: () => void) => void
        cleanup: (fn: () => void) => void
      }
    ) => void
  ): void
  evaluate(el: Element, expression: string): unknown
}

/**
 * Ytz magic utilities interface
 */
export interface YtzMagic {
  snackbar(message: string, options?: SnackbarOptions): HTMLElement
  openDialog(target: string | HTMLElement): void
  closeDialog(target: string | HTMLElement): void
  openDrawer(target: string | HTMLElement): void
  closeDrawer(target: string | HTMLElement): void
  toggleTheme(): 'light' | 'dark'
  getTheme(): string
  setTheme(theme: 'light' | 'dark'): void
}

/**
 * Alpine.js plugin that integrates Yetzirah Web Components.
 *
 * This plugin:
 * 1. Registers Yetzirah web components for use in Alpine templates
 * 2. Provides the $ytz magic for programmatic component access
 * 3. Adds x-ytz-* directives for component-specific behaviors
 *
 * @param Alpine - Alpine.js instance
 * @param options - Plugin options
 *
 * @example
 * ```js
 * import Alpine from 'alpinejs'
 * import { yetzirahPlugin } from '@grimoire/yetzirah-alpine'
 *
 * Alpine.plugin(yetzirahPlugin)
 * Alpine.start()
 * ```
 *
 * @example
 * ```html
 * <div x-data="{ open: false }">
 *   <ytz-button @click="open = true">Open Dialog</ytz-button>
 *   <ytz-dialog x-ytz-dialog="open">
 *     <p>Dialog content</p>
 *   </ytz-dialog>
 * </div>
 * ```
 */
export function yetzirahPlugin(Alpine: AlpineInstance, options: YetzirahAlpineOptions = {}): void {
  const prefix = options.prefix ?? 'ytz'

  // Register all directives
  registerDirectives(Alpine, prefix)

  // Register x-ytz:model two-way binding directive
  registerModelDirective(Alpine, prefix)

  /**
   * $ytz magic - provides utilities for working with Yetzirah components
   */
  Alpine.magic(prefix, (): YtzMagic => {
    return {
      /**
       * Show a snackbar message programmatically
       */
      snackbar(message: string, options: SnackbarOptions = {}): HTMLElement {
        const snackbar = document.createElement('ytz-snackbar')
        snackbar.textContent = message

        if (options.duration !== undefined) {
          snackbar.setAttribute('duration', String(options.duration))
        }
        if (options.position) {
          snackbar.setAttribute('position', options.position)
        }

        document.body.appendChild(snackbar)
        snackbar.setAttribute('open', '')

        snackbar.addEventListener('close', () => {
          snackbar.remove()
        }, { once: true })

        return snackbar
      },

      /**
       * Open a dialog by selector or element
       */
      openDialog(target: string | HTMLElement): void {
        const el = typeof target === 'string' ? document.querySelector(target) : target
        if (el) {
          el.setAttribute('open', '')
        }
      },

      /**
       * Close a dialog by selector or element
       */
      closeDialog(target: string | HTMLElement): void {
        const el = typeof target === 'string' ? document.querySelector(target) : target
        if (el) {
          el.removeAttribute('open')
        }
      },

      /**
       * Open a drawer by selector or element
       */
      openDrawer(target: string | HTMLElement): void {
        const el = typeof target === 'string' ? document.querySelector(target) : target
        if (el) {
          el.setAttribute('open', '')
        }
      },

      /**
       * Close a drawer by selector or element
       */
      closeDrawer(target: string | HTMLElement): void {
        const el = typeof target === 'string' ? document.querySelector(target) : target
        if (el) {
          el.removeAttribute('open')
        }
      },

      /**
       * Toggle theme between light and dark
       */
      toggleTheme(): 'light' | 'dark' {
        const current = document.documentElement.getAttribute('data-theme')
        const next = current === 'dark' ? 'light' : 'dark'
        document.documentElement.setAttribute('data-theme', next)
        return next
      },

      /**
       * Get current theme
       */
      getTheme(): string {
        return document.documentElement.getAttribute('data-theme') || 'light'
      },

      /**
       * Set theme
       */
      setTheme(theme: 'light' | 'dark'): void {
        document.documentElement.setAttribute('data-theme', theme)
      },
    }
  })
}

// Default export for convenient import
export default yetzirahPlugin

// Re-export directives registration for advanced use
export { registerDirectives } from './directives'
export { registerModelDirective } from './model'
