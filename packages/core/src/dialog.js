/**
 * ytz-dialog - Modal dialog Web Component.
 * Provides focus trap, scroll lock, escape-to-close, and backdrop dismiss.
 *
 * @module @grimoire/yetzirah-core/dialog
 * @example
 * <ytz-dialog id="my-dialog" class="pa4 bg-white br3 shadow-2">
 *   <h2>Dialog Title</h2>
 *   <p>Content goes here.</p>
 *   <button onclick="this.closest('ytz-dialog').removeAttribute('open')">Close</button>
 * </ytz-dialog>
 *
 * @example
 * // Open dialog
 * document.getElementById('my-dialog').setAttribute('open', '')
 *
 * @example
 * // Static dialog (no backdrop dismiss)
 * <ytz-dialog static>...</ytz-dialog>
 */

import { createFocusTrap } from './utils/focus-trap.js'

/** @type {string} Selector for focusable elements */
const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * @class YtzDialog
 * @extends HTMLElement
 */
class YtzDialog extends HTMLElement {
  static observedAttributes = ['open']

  /** @type {HTMLElement|null} */
  #previousFocus = null
  /** @type {{ activate: () => void, deactivate: () => void }|null} */
  #focusTrap = null
  /** @type {string} */
  #previousOverflow = ''

  connectedCallback() {
    this.setAttribute('role', 'dialog')
    this.setAttribute('aria-modal', 'true')
    this.hidden = !this.hasAttribute('open')

    // Set up backdrop click handler
    this.addEventListener('click', this.#handleBackdropClick)
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.#handleBackdropClick)
    this.#cleanup()
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (name === 'open' && this.isConnected) {
      newVal !== null ? this.#open() : this.#close()
    }
  }

  #open() {
    // Save current focus for restoration
    this.#previousFocus = /** @type {HTMLElement} */ (document.activeElement)

    // Show dialog
    this.hidden = false

    // Lock body scroll
    this.#previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // Set up focus trap
    this.#focusTrap = createFocusTrap(this)
    this.#focusTrap.activate()

    // Add escape key listener
    document.addEventListener('keydown', this.#handleEscape)

    // Focus first focusable element (or dialog itself)
    requestAnimationFrame(() => {
      const firstFocusable = this.querySelector(FOCUSABLE)
      if (firstFocusable) {
        /** @type {HTMLElement} */ (firstFocusable).focus()
      } else {
        this.setAttribute('tabindex', '-1')
        this.focus()
      }
    })
  }

  #close() {
    this.hidden = true
    this.#cleanup()

    // Dispatch close event
    this.dispatchEvent(new CustomEvent('close', { bubbles: true }))
  }

  #cleanup() {
    // Restore body scroll
    document.body.style.overflow = this.#previousOverflow

    // Deactivate focus trap
    this.#focusTrap?.deactivate()
    this.#focusTrap = null

    // Remove escape listener
    document.removeEventListener('keydown', this.#handleEscape)

    // Restore focus
    this.#previousFocus?.focus()
    this.#previousFocus = null
  }

  /** @param {KeyboardEvent} e */
  #handleEscape = (e) => {
    if (e.key === 'Escape' && this.hasAttribute('open')) {
      e.preventDefault()
      this.removeAttribute('open')
    }
  }

  /** @param {MouseEvent} e */
  #handleBackdropClick = (e) => {
    // Only close if clicking directly on dialog element (backdrop), not children
    if (e.target === this && !this.hasAttribute('static')) {
      this.removeAttribute('open')
    }
  }

  /**
   * Get/set the open state.
   * @type {boolean}
   */
  get open() {
    return this.hasAttribute('open')
  }

  set open(value) {
    if (value) {
      this.setAttribute('open', '')
    } else {
      this.removeAttribute('open')
    }
  }

  /**
   * Close the dialog programmatically.
   */
  close() {
    this.removeAttribute('open')
  }

  /**
   * Show the dialog programmatically.
   */
  showModal() {
    this.setAttribute('open', '')
  }
}

customElements.define('ytz-dialog', YtzDialog)

export { YtzDialog }
