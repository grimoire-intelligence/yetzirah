/**
 * ytz-snackbar - Transient notification Web Component.
 * Provides auto-dismissing notifications with queue management and positioning.
 *
 * @module @grimoire/yetzirah-core/snackbar
 * @example
 * <ytz-snackbar id="snack">File saved successfully</ytz-snackbar>
 *
 * @example
 * // Show snackbar programmatically
 * document.getElementById('snack').show()
 *
 * @example
 * // Positioned snackbar with custom duration
 * <ytz-snackbar position="top-right" duration="3000">
 *   Quick message
 * </ytz-snackbar>
 */

import { register } from './utils/register.js'

/** @type {Map<string, YtzSnackbar[]>} Queue of active snackbars by position */
const snackbarQueues = new Map()

/** Valid position values */
const VALID_POSITIONS = ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right']

/**
 * @class YtzSnackbar
 * @extends HTMLElement
 */
class YtzSnackbar extends HTMLElement {
  static observedAttributes = ['open', 'duration', 'position', 'dismissible', 'max-visible']

  /** @type {number|null} */
  #dismissTimer = null
  /** @type {HTMLButtonElement|null} */
  #closeButton = null
  /** @type {boolean} */
  #isPaused = false
  /** @type {string|null} */
  #pendingDismissReason = null

  connectedCallback() {
    // Set up accessibility attributes
    this.setAttribute('role', 'status')
    this.setAttribute('aria-live', 'polite')
    this.setAttribute('aria-atomic', 'true')

    // Initialize visibility
    if (!this.hasAttribute('open')) {
      this.hidden = true
    }

    // Set up close button if dismissible
    this.#setupCloseButton()

    // Set up hover pause behavior
    this.addEventListener('mouseenter', this.#handleMouseEnter)
    this.addEventListener('mouseleave', this.#handleMouseLeave)

    // If already open, register in queue
    if (this.hasAttribute('open')) {
      this.#show()
    }
  }

  disconnectedCallback() {
    this.#cleanup()
    this.removeEventListener('mouseenter', this.#handleMouseEnter)
    this.removeEventListener('mouseleave', this.#handleMouseLeave)
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (!this.isConnected) return

    if (name === 'open') {
      if (newVal !== null) {
        this.#show()
      } else {
        // Use pending reason if set (e.g., from timeout), otherwise 'manual'
        const reason = this.#pendingDismissReason || 'manual'
        this.#pendingDismissReason = null
        this.#hide(reason)
      }
    } else if (name === 'dismissible') {
      this.#setupCloseButton()
    } else if (name === 'position') {
      // Re-register in correct queue if position changes while open
      if (this.hasAttribute('open') && oldVal !== newVal) {
        this.#removeFromQueue(oldVal || 'bottom-center')
        this.#addToQueue()
      }
    }
  }

  #setupCloseButton() {
    // Remove existing button if any
    this.#closeButton?.remove()
    this.#closeButton = null

    if (this.dismissible) {
      this.#closeButton = document.createElement('button')
      this.#closeButton.type = 'button'
      this.#closeButton.setAttribute('aria-label', 'Dismiss')
      this.#closeButton.className = 'ytz-snackbar-close'
      this.#closeButton.textContent = '\u00D7'
      this.#closeButton.addEventListener('click', this.#handleClose)
      this.appendChild(this.#closeButton)
    }
  }

  #show() {
    // Clear any pending dismiss
    this.#clearTimer()

    // Show the snackbar
    this.hidden = false

    // Add to position queue
    this.#addToQueue()

    // Set up auto-dismiss timer
    if (this.duration > 0) {
      this.#startTimer()
    }
  }

  #hide(reason = 'manual') {
    this.#clearTimer()
    this.hidden = true
    this.#removeFromQueue(this.position)

    // Dispatch dismiss event
    this.dispatchEvent(new CustomEvent('dismiss', {
      bubbles: true,
      detail: { reason }
    }))
  }

  #startTimer() {
    this.#dismissTimer = window.setTimeout(() => {
      // Set pending reason before removing attribute (triggers attributeChangedCallback)
      this.#pendingDismissReason = 'timeout'
      this.removeAttribute('open')
    }, this.duration)
  }

  #clearTimer() {
    if (this.#dismissTimer !== null) {
      clearTimeout(this.#dismissTimer)
      this.#dismissTimer = null
    }
  }

  #handleMouseEnter = () => {
    if (this.duration > 0 && this.#dismissTimer !== null) {
      this.#isPaused = true
      this.#clearTimer()
    }
  }

  #handleMouseLeave = () => {
    if (this.#isPaused && this.hasAttribute('open')) {
      this.#isPaused = false
      this.#startTimer()
    }
  }

  #handleClose = (e) => {
    e.stopPropagation()
    this.removeAttribute('open')
  }

  #addToQueue() {
    const pos = this.position
    if (!snackbarQueues.has(pos)) {
      snackbarQueues.set(pos, [])
    }

    const queue = snackbarQueues.get(pos)
    if (!queue.includes(this)) {
      queue.push(this)
    }

    // Enforce max-visible limit
    this.#enforceMaxVisible()
    this.#updateOffsets()
  }

  #removeFromQueue(pos) {
    const queue = snackbarQueues.get(pos)
    if (queue) {
      const index = queue.indexOf(this)
      if (index > -1) {
        queue.splice(index, 1)
        this.#updateOffsets()
      }
    }
  }

  #enforceMaxVisible() {
    const queue = snackbarQueues.get(this.position) || []
    const max = this.maxVisible

    // Remove oldest snackbars if queue exceeds max
    while (queue.length > max) {
      const oldest = queue[0]
      oldest.removeAttribute('open')
    }
  }

  #updateOffsets() {
    const pos = this.position
    const queue = snackbarQueues.get(pos) || []
    const isTop = pos.startsWith('top')

    let offset = 0
    for (const snackbar of queue) {
      snackbar.style.setProperty('--ytz-snackbar-offset', `${offset}px`)
      // Measure height for next snackbar's offset
      const height = snackbar.offsetHeight || 0
      offset += height + 8 // 8px gap between stacked snackbars
    }
  }

  #cleanup() {
    this.#clearTimer()
    this.#removeFromQueue(this.position)
    this.#closeButton?.removeEventListener('click', this.#handleClose)
  }

  // Public methods

  /**
   * Show the snackbar, optionally updating its message content.
   * @param {string} [message] - Optional message to display
   */
  show(message) {
    if (message !== undefined) {
      // Update text content while preserving close button
      const closeBtn = this.#closeButton
      this.textContent = message
      if (closeBtn && this.dismissible) {
        this.appendChild(closeBtn)
      }
    }
    this.setAttribute('open', '')
  }

  /**
   * Dismiss the snackbar programmatically.
   */
  dismiss() {
    this.removeAttribute('open')
  }

  // Property getters/setters

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
   * Get/set the auto-dismiss duration in milliseconds.
   * @type {number}
   */
  get duration() {
    const val = this.getAttribute('duration')
    return val !== null ? parseInt(val, 10) : 5000
  }

  set duration(value) {
    this.setAttribute('duration', String(value))
  }

  /**
   * Get/set the position.
   * @type {string}
   */
  get position() {
    const pos = this.getAttribute('position')
    return VALID_POSITIONS.includes(pos) ? pos : 'bottom-center'
  }

  set position(value) {
    if (VALID_POSITIONS.includes(value)) {
      this.setAttribute('position', value)
    }
  }

  /**
   * Get/set whether the close button is shown.
   * @type {boolean}
   */
  get dismissible() {
    return this.hasAttribute('dismissible')
  }

  set dismissible(value) {
    if (value) {
      this.setAttribute('dismissible', '')
    } else {
      this.removeAttribute('dismissible')
    }
  }

  /**
   * Get/set the maximum number of visible snackbars at this position.
   * @type {number}
   */
  get maxVisible() {
    const val = this.getAttribute('max-visible')
    return val !== null ? parseInt(val, 10) : 3
  }

  set maxVisible(value) {
    this.setAttribute('max-visible', String(value))
  }
}

register('ytz-snackbar', YtzSnackbar)

export { YtzSnackbar }
