/**
 * ytz-popover - Click-triggered positioned content Web Component.
 * Shows interactive content anchored to a trigger element.
 *
 * @module @grimoire/yetzirah-core/popover
 * @example
 * <ytz-popover>
 *   <button>Open menu</button>
 *   <div slot="content">
 *     <p>Popover content with interactive elements</p>
 *     <button onclick="this.closest('ytz-popover').open = false">Close</button>
 *   </div>
 * </ytz-popover>
 *
 * @example
 * // With placement
 * <ytz-popover placement="bottom">
 *   <button>Settings</button>
 *   <div slot="content" class="pa3 bg-white shadow-2 br2">
 *     <label class="db mb2">
 *       <input type="checkbox"> Enable notifications
 *     </label>
 *     <button>Save</button>
 *   </div>
 * </ytz-popover>
 */

import { position } from './utils/position.js'

let popoverId = 0

/** @type {string} Selector for focusable elements */
const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * @class YtzPopover
 * @extends HTMLElement
 */
class YtzPopover extends HTMLElement {
  static observedAttributes = ['open', 'placement', 'offset']

  /** @type {HTMLElement|null} */
  #trigger = null
  /** @type {HTMLElement|null} */
  #content = null
  /** @type {string|null} */
  #contentId = null

  connectedCallback() {
    this.#setup()
    // Check initial open state
    if (this.hasAttribute('open')) {
      this.#show()
    }
  }

  disconnectedCallback() {
    this.#cleanup()
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (!this.isConnected) return

    if (name === 'open') {
      newVal !== null ? this.#show() : this.#hide()
    } else if (this.hasAttribute('open')) {
      // Reposition if placement/offset changed while open
      this.#updatePosition()
    }
  }

  /** @returns {'top'|'bottom'|'left'|'right'} */
  get placement() {
    return this.getAttribute('placement') || 'bottom'
  }

  set placement(value) {
    this.setAttribute('placement', value)
  }

  /** @returns {number} */
  get offset() {
    return parseInt(this.getAttribute('offset') || '8', 10)
  }

  set offset(value) {
    this.setAttribute('offset', String(value))
  }

  /** @returns {boolean} */
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

  #setup() {
    // Find trigger (first child) and content ([slot="content"] or last child)
    this.#trigger = this.firstElementChild
    this.#content = this.querySelector('[slot="content"]') || this.lastElementChild

    if (!this.#trigger || !this.#content || this.#trigger === this.#content) return

    // Generate unique ID for content
    this.#contentId = this.#content.id || `ytz-popover-${++popoverId}`
    this.#content.id = this.#contentId

    // Set up ARIA - popover uses aria-expanded on trigger
    this.#trigger.setAttribute('aria-haspopup', 'dialog')
    this.#trigger.setAttribute('aria-expanded', 'false')
    this.#trigger.setAttribute('aria-controls', this.#contentId)

    // Content hidden initially
    this.#content.hidden = true

    // Click listener on trigger
    this.#trigger.addEventListener('click', this.#handleTriggerClick)
  }

  #cleanup() {
    this.#trigger?.removeEventListener('click', this.#handleTriggerClick)
    document.removeEventListener('click', this.#handleOutsideClick)
    document.removeEventListener('keydown', this.#handleEscape)
    window.removeEventListener('scroll', this.#updatePosition, { capture: true })
    window.removeEventListener('resize', this.#updatePosition)
  }

  #handleTriggerClick = (e) => {
    e.stopPropagation()
    this.open = !this.open
  }

  #handleOutsideClick = (e) => {
    // Close if click is outside popover content and trigger
    if (!this.#content?.contains(e.target) && !this.#trigger?.contains(e.target)) {
      this.open = false
    }
  }

  #handleEscape = (e) => {
    if (e.key === 'Escape' && this.open) {
      e.preventDefault()
      this.open = false
      // Return focus to trigger
      this.#trigger?.focus()
    }
  }

  #show() {
    if (!this.#content) return

    // Update ARIA
    this.#trigger?.setAttribute('aria-expanded', 'true')

    // Show content
    this.#content.hidden = false
    this.#updatePosition()

    // Add listeners for dismiss
    // Use setTimeout to avoid immediate close from the same click
    setTimeout(() => {
      document.addEventListener('click', this.#handleOutsideClick)
    }, 0)
    document.addEventListener('keydown', this.#handleEscape)

    // Reposition on scroll/resize
    window.addEventListener('scroll', this.#updatePosition, { passive: true, capture: true })
    window.addEventListener('resize', this.#updatePosition, { passive: true })

    // Focus first focusable element in content
    requestAnimationFrame(() => {
      const focusable = this.#content?.querySelector(FOCUSABLE)
      if (focusable) {
        /** @type {HTMLElement} */ (focusable).focus()
      }
    })

    this.dispatchEvent(new CustomEvent('show', { bubbles: true }))
  }

  #hide() {
    if (!this.#content) return

    // Update ARIA
    this.#trigger?.setAttribute('aria-expanded', 'false')

    // Hide content
    this.#content.hidden = true

    // Remove listeners
    document.removeEventListener('click', this.#handleOutsideClick)
    document.removeEventListener('keydown', this.#handleEscape)
    window.removeEventListener('scroll', this.#updatePosition, { capture: true })
    window.removeEventListener('resize', this.#updatePosition)

    this.dispatchEvent(new CustomEvent('hide', { bubbles: true }))
  }

  #updatePosition = () => {
    if (!this.#trigger || !this.#content) return

    const { x, y, placement: finalPlacement } = position(this.#trigger, this.#content, {
      placement: this.placement,
      offset: this.offset
    })

    // Position popover fixed relative to viewport
    this.#content.style.position = 'fixed'
    this.#content.style.left = `${x}px`
    this.#content.style.top = `${y}px`

    // Set data attribute for CSS styling based on actual placement
    this.#content.dataset.placement = finalPlacement
  }

  // Public API

  /** Show the popover programmatically */
  show() {
    this.open = true
  }

  /** Hide the popover programmatically */
  hide() {
    this.open = false
  }

  /** Toggle the popover open/closed */
  toggle() {
    this.open = !this.open
  }
}

customElements.define('ytz-popover', YtzPopover)

export { YtzPopover }
