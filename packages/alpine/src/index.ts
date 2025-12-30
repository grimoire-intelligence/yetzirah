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
  directive(name: string, callback: DirectiveCallback): void
  evaluate(el: Element, expression: string): unknown
}

type DirectiveCallback = (
  el: Element,
  directive: { expression: string },
  utilities: { evaluate: (expr: string) => unknown; effect: (fn: () => void) => void }
) => void

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
 *   <ytz-dialog :open="open" @close="open = false">
 *     <p>Dialog content</p>
 *   </ytz-dialog>
 * </div>
 * ```
 */
export function yetzirahPlugin(Alpine: AlpineInstance, options: YetzirahAlpineOptions = {}): void {
  const prefix = options.prefix ?? 'ytz'

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

  /**
   * x-ytz-dialog directive - syncs dialog open state with Alpine data
   * @example <ytz-dialog x-ytz-dialog="open">...</ytz-dialog>
   */
  Alpine.directive(`${prefix}-dialog`, (el, { expression }, { evaluate, effect }) => {
    effect(() => {
      const isOpen = evaluate(expression)
      if (isOpen) {
        el.setAttribute('open', '')
      } else {
        el.removeAttribute('open')
      }
    })

    el.addEventListener('close', () => {
      Alpine.evaluate(el, `${expression} = false`)
    })
  })

  /**
   * x-ytz-drawer directive - syncs drawer open state with Alpine data
   * @example <ytz-drawer x-ytz-drawer="drawerOpen">...</ytz-drawer>
   */
  Alpine.directive(`${prefix}-drawer`, (el, { expression }, { evaluate, effect }) => {
    effect(() => {
      const isOpen = evaluate(expression)
      if (isOpen) {
        el.setAttribute('open', '')
      } else {
        el.removeAttribute('open')
      }
    })

    el.addEventListener('close', () => {
      Alpine.evaluate(el, `${expression} = false`)
    })
  })

  /**
   * x-ytz-tabs directive - syncs tabs value with Alpine data
   * @example <ytz-tabs x-ytz-tabs="activeTab">...</ytz-tabs>
   */
  Alpine.directive(`${prefix}-tabs`, (el, { expression }, { evaluate, effect }) => {
    effect(() => {
      const value = evaluate(expression)
      if (value) {
        el.setAttribute('default-tab', String(value))
      }
    })

    el.addEventListener('change', (e: Event) => {
      const customEvent = e as CustomEvent
      Alpine.evaluate(el, `${expression} = '${customEvent.detail?.value || ''}'`)
    })
  })

  /**
   * x-ytz-toggle directive - syncs toggle checked state with Alpine data
   * @example <ytz-toggle x-ytz-toggle="enabled">...</ytz-toggle>
   */
  Alpine.directive(`${prefix}-toggle`, (el, { expression }, { evaluate, effect }) => {
    effect(() => {
      const isChecked = evaluate(expression)
      if (isChecked) {
        el.setAttribute('checked', '')
      } else {
        el.removeAttribute('checked')
      }
    })

    el.addEventListener('change', (e: Event) => {
      const customEvent = e as CustomEvent
      Alpine.evaluate(el, `${expression} = ${customEvent.detail?.checked ?? false}`)
    })
  })

  /**
   * x-ytz-slider directive - syncs slider value with Alpine data
   * @example <ytz-slider x-ytz-slider="volume">...</ytz-slider>
   */
  Alpine.directive(`${prefix}-slider`, (el, { expression }, { evaluate, effect }) => {
    effect(() => {
      const value = evaluate(expression)
      if (value !== undefined) {
        el.setAttribute('value', String(value))
      }
    })

    el.addEventListener('change', (e: Event) => {
      const customEvent = e as CustomEvent
      Alpine.evaluate(el, `${expression} = ${customEvent.detail?.value ?? 0}`)
    })
  })

  /**
   * x-ytz-select directive - syncs select value with Alpine data
   * @example <ytz-select x-ytz-select="selectedOption">...</ytz-select>
   */
  Alpine.directive(`${prefix}-select`, (el, { expression }, { evaluate, effect }) => {
    effect(() => {
      const value = evaluate(expression)
      if (value !== undefined) {
        el.setAttribute('value', String(value))
      }
    })

    el.addEventListener('change', (e: Event) => {
      const customEvent = e as CustomEvent
      Alpine.evaluate(el, `${expression} = '${customEvent.detail?.value || ''}'`)
    })
  })

  /**
   * x-ytz-disclosure directive - syncs disclosure open state with Alpine data
   * @example <ytz-disclosure x-ytz-disclosure="isExpanded">...</ytz-disclosure>
   */
  Alpine.directive(`${prefix}-disclosure`, (el, { expression }, { evaluate, effect }) => {
    effect(() => {
      const isOpen = evaluate(expression)
      if (isOpen) {
        el.setAttribute('open', '')
      } else {
        el.removeAttribute('open')
      }
    })

    el.addEventListener('toggle', (e: Event) => {
      const customEvent = e as CustomEvent
      Alpine.evaluate(el, `${expression} = ${customEvent.detail?.open ?? false}`)
    })
  })
}

// Default export for convenient import
export default yetzirahPlugin
