/**
 * ytz-drawer - Slide-in panel Web Component.
 * Inherits modal behavior: focus trap, scroll lock, escape-to-close, backdrop dismiss.
 *
 * @module @yetzirah/core/drawer
 * @example
 * <ytz-drawer id="menu" anchor="left" class="w5 h-100 bg-white shadow-2">
 *   <nav class="pa4">
 *     <a href="/home">Home</a>
 *   </nav>
 *   <button onclick="this.closest('ytz-drawer').close()">Close</button>
 * </ytz-drawer>
 *
 * @example
 * // Open drawer
 * document.getElementById('menu').open = true
 *
 * @example
 * // Different anchors
 * <ytz-drawer anchor="right">...</ytz-drawer>
 * <ytz-drawer anchor="top">...</ytz-drawer>
 * <ytz-drawer anchor="bottom">...</ytz-drawer>
 */

import { createFocusTrap } from './utils/focus-trap.js'

/** @type {string} Selector for focusable elements */
const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/** @type {string[]} Valid anchor positions */
const VALID_ANCHORS = ['left', 'right', 'top', 'bottom']

/**
 * @class YtzDrawer
 * @extends HTMLElement
 */
class YtzDrawer extends HTMLElement {
  static observedAttributes = ['open', 'anchor']

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

    if (!this.hasAttribute('anchor')) {
      this.setAttribute('anchor', 'left')
    }

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
    if (name === 'anchor' && newVal && !VALID_ANCHORS.includes(newVal)) {
      this.setAttribute('anchor', 'left')
    }
  }

  #open() {
    this.#previousFocus = /** @type {HTMLElement} */ (document.activeElement)
    this.hidden = false
    this.#previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    this.#focusTrap = createFocusTrap(this)
    this.#focusTrap.activate()
    document.addEventListener('keydown', this.#handleEscape)

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
    this.dispatchEvent(new CustomEvent('close', { bubbles: true }))
  }

  #cleanup() {
    document.body.style.overflow = this.#previousOverflow
    this.#focusTrap?.deactivate()
    this.#focusTrap = null
    document.removeEventListener('keydown', this.#handleEscape)
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
    if (e.target === this && !this.hasAttribute('static')) {
      this.removeAttribute('open')
    }
  }

  /** @type {boolean} */
  get open() {
    return this.hasAttribute('open')
  }

  set open(value) {
    value ? this.setAttribute('open', '') : this.removeAttribute('open')
  }

  /** @type {'left'|'right'|'top'|'bottom'} */
  get anchor() {
    return /** @type {'left'|'right'|'top'|'bottom'} */ (this.getAttribute('anchor') || 'left')
  }

  set anchor(value) {
    if (VALID_ANCHORS.includes(value)) this.setAttribute('anchor', value)
  }

  /** Close the drawer programmatically. */
  close() {
    this.removeAttribute('open')
  }

  /** Show the drawer programmatically. */
  show() {
    this.setAttribute('open', '')
  }
}

customElements.define('ytz-drawer', YtzDrawer)

export { YtzDrawer }
