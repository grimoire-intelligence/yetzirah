/**
 * Alpine.js $ytz magic methods for Yetzirah Web Components
 *
 * Provides programmatic control of Yetzirah components through Alpine.js.
 */

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
 * Ytz magic utilities interface
 */
export interface YtzMagic {
  // Generic methods (PR-154)
  open(target: string | HTMLElement): void
  close(target: string | HTMLElement): void
  toggle(target: string | HTMLElement): void
  show(target: string | HTMLElement, message?: string): void

  // Existing methods (backwards compatibility)
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
 * Resolve a target to an HTMLElement
 * @param target - CSS selector string or HTMLElement
 * @returns The resolved element or null if not found
 */
function resolveElement(target: string | HTMLElement): HTMLElement | null {
  if (typeof target === 'string') {
    return document.querySelector<HTMLElement>(target)
  }
  return target instanceof HTMLElement ? target : null
}

/**
 * Create the $ytz magic object with all utility methods
 */
export function createYtzMagic(): YtzMagic {
  return {
    /**
     * Open a component (Dialog, Drawer, Menu, etc.)
     * Works with any component that uses the 'open' attribute
     */
    open(target: string | HTMLElement): void {
      const el = resolveElement(target)
      if (el) {
        el.setAttribute('open', '')
      }
    },

    /**
     * Close a component (Dialog, Drawer, Menu, etc.)
     * Works with any component that uses the 'open' attribute
     */
    close(target: string | HTMLElement): void {
      const el = resolveElement(target)
      if (el) {
        el.removeAttribute('open')
      }
    },

    /**
     * Toggle a component's open state
     * Works with any component that uses the 'open' attribute
     */
    toggle(target: string | HTMLElement): void {
      const el = resolveElement(target)
      if (el) {
        if (el.hasAttribute('open')) {
          el.removeAttribute('open')
        } else {
          el.setAttribute('open', '')
        }
      }
    },

    /**
     * Show a snackbar (opens it, optionally with a message)
     * @param target - Selector or element of the snackbar
     * @param message - Optional message to set before showing
     */
    show(target: string | HTMLElement, message?: string): void {
      const el = resolveElement(target)
      if (el) {
        if (message !== undefined) {
          el.textContent = message
        }
        el.setAttribute('open', '')
      }
    },

    /**
     * Create and show a programmatic snackbar
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
      const el = resolveElement(target)
      if (el) {
        el.setAttribute('open', '')
      }
    },

    /**
     * Close a dialog by selector or element
     */
    closeDialog(target: string | HTMLElement): void {
      const el = resolveElement(target)
      if (el) {
        el.removeAttribute('open')
      }
    },

    /**
     * Open a drawer by selector or element
     */
    openDrawer(target: string | HTMLElement): void {
      const el = resolveElement(target)
      if (el) {
        el.setAttribute('open', '')
      }
    },

    /**
     * Close a drawer by selector or element
     */
    closeDrawer(target: string | HTMLElement): void {
      const el = resolveElement(target)
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
}
