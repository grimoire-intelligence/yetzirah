/**
 * ytz-badge - Notification badge Web Component.
 * Overlays a count or dot indicator on slotted content.
 *
 * @module @grimoire/yetzirah-core/badge
 * @example
 * // Dot badge (no value)
 * <ytz-badge>
 *   <button>Messages</button>
 * </ytz-badge>
 *
 * @example
 * // Count badge
 * <ytz-badge value="5">
 *   <button>Notifications</button>
 * </ytz-badge>
 *
 * @example
 * // Max cap badge
 * <ytz-badge value="150" max="99">
 *   <button>Inbox</button>
 * </ytz-badge>
 */

import { register } from './utils/register.js'

/** Valid position values */
const VALID_POSITIONS = ['top-right', 'top-left', 'bottom-right', 'bottom-left']

/**
 * @class YtzBadge
 * @extends HTMLElement
 */
class YtzBadge extends HTMLElement {
  static observedAttributes = ['value', 'max', 'position', 'hidden']

  /** @type {HTMLSpanElement|null} */
  #indicator = null

  connectedCallback() {
    this.#createIndicator()
    this.#update()
  }

  disconnectedCallback() {
    this.#indicator?.remove()
    this.#indicator = null
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (this.isConnected) {
      this.#update()
    }
  }

  #createIndicator() {
    this.#indicator = document.createElement('span')
    this.#indicator.className = 'ytz-badge-indicator'
    this.#indicator.setAttribute('aria-hidden', 'true')
    this.appendChild(this.#indicator)
  }

  #update() {
    if (!this.#indicator) return

    const rawValue = this.getAttribute('value')
    const max = this.max
    const pos = this.position
    const isHidden = this.hasAttribute('hidden')

    // Determine mode and display value
    let mode
    let displayValue = ''

    if (rawValue === null) {
      // No value = dot mode
      mode = 'dot'
    } else if (rawValue === '0') {
      // Zero = hidden
      mode = 'hidden'
    } else {
      // Count mode
      mode = 'count'
      const numValue = parseInt(rawValue, 10)

      if (!isNaN(numValue) && max !== null && numValue > max) {
        displayValue = `${max}+`
      } else {
        displayValue = rawValue
      }
    }

    // Apply visibility
    if (mode === 'hidden' || isHidden) {
      this.#indicator.hidden = true
    } else {
      this.#indicator.hidden = false
    }

    // Set data attributes for styling
    this.#indicator.setAttribute('data-mode', mode)
    this.#indicator.setAttribute('data-position', pos)

    // Set content for count mode
    this.#indicator.textContent = mode === 'count' ? displayValue : ''
  }

  // Property getters/setters

  /**
   * Get/set the badge value. Null/undefined = dot mode, "0" = hidden.
   * @type {string|number|null}
   */
  get value() {
    return this.getAttribute('value')
  }

  set value(val) {
    if (val === null || val === undefined) {
      this.removeAttribute('value')
    } else {
      this.setAttribute('value', String(val))
    }
  }

  /**
   * Get/set the maximum displayed value. Shows "max+" when exceeded.
   * @type {number|null}
   */
  get max() {
    const attr = this.getAttribute('max')
    if (attr === null) return null
    const num = parseInt(attr, 10)
    return isNaN(num) ? null : num
  }

  set max(val) {
    if (val === null || val === undefined) {
      this.removeAttribute('max')
    } else {
      this.setAttribute('max', String(val))
    }
  }

  /**
   * Get/set the badge position relative to child content.
   * @type {string}
   */
  get position() {
    const pos = this.getAttribute('position')
    return VALID_POSITIONS.includes(pos) ? pos : 'top-right'
  }

  set position(val) {
    if (VALID_POSITIONS.includes(val)) {
      this.setAttribute('position', val)
    }
  }
}

register('ytz-badge', YtzBadge)

export { YtzBadge }
