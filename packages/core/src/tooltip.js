/**
 * ytz-tooltip - Positioned hint text Web Component.
 * Shows on hover/focus with configurable delay and placement.
 *
 * @module @grimoire-intel/yetzirah/tooltip
 * @example
 * <ytz-tooltip>
 *   <button>Hover me</button>
 *   <span slot="content">Tooltip text</span>
 * </ytz-tooltip>
 *
 * @example
 * // With placement and delay
 * <ytz-tooltip placement="bottom" delay="200">
 *   <button>Hover me</button>
 *   <span slot="content">Bottom tooltip</span>
 * </ytz-tooltip>
 *
 * @example
 * // Headless mode for SVG canvas or custom positioning
 * <ytz-tooltip id="canvas-tip">
 *   <span slot="content"></span>
 * </ytz-tooltip>
 *
 * svg.addEventListener('mousemove', (e) => {
 *   const el = getElementAtPoint(e.clientX, e.clientY)
 *   if (el) {
 *     tooltip.anchorTo(e.clientX, e.clientY)
 *     tooltip.text = el.label
 *     tooltip.show()
 *   } else {
 *     tooltip.hide()
 *   }
 * })
 */

import { position } from './utils/position.js'
import { register } from './utils/register.js'

let tooltipId = 0

/**
 * @class YtzTooltip
 * @extends HTMLElement
 */
class YtzTooltip extends HTMLElement {
  static observedAttributes = ['placement', 'delay', 'offset']

  /** @type {HTMLElement|null} */
  #trigger = null
  /** @type {HTMLElement|null} */
  #content = null
  /** @type {string|null} */
  #contentId = null
  /** @type {number|null} */
  #showTimeout = null
  /** @type {number|null} */
  #hideTimeout = null
  /** @type {boolean} */
  #isVisible = false
  /** @type {HTMLElement|null} */
  #anchor = null

  connectedCallback() {
    this.#setup()
  }

  disconnectedCallback() {
    this.#cleanup()
    clearTimeout(this.#showTimeout)
    clearTimeout(this.#hideTimeout)
  }

  attributeChangedCallback() {
    if (this.#isVisible) this.#updatePosition()
  }

  /** @returns {'top'|'bottom'|'left'|'right'} */
  get placement() {
    return this.getAttribute('placement') || 'top'
  }

  /** @param {'top'|'bottom'|'left'|'right'} value */
  set placement(value) {
    if (value) {
      this.setAttribute('placement', value)
    } else {
      this.removeAttribute('placement')
    }
  }

  /** @returns {number} */
  get delay() {
    return parseInt(this.getAttribute('delay') || '0', 10)
  }

  /** @param {number} value */
  set delay(value) {
    if (value != null) {
      this.setAttribute('delay', String(value))
    } else {
      this.removeAttribute('delay')
    }
  }

  /** @returns {number} */
  get offset() {
    return parseInt(this.getAttribute('offset') || '8', 10)
  }

  /** @param {number} value */
  set offset(value) {
    if (value != null) {
      this.setAttribute('offset', String(value))
    } else {
      this.removeAttribute('offset')
    }
  }

  #setup() {
    // Find trigger (first child) and content ([slot="content"] or last child)
    this.#trigger = this.firstElementChild
    this.#content = this.querySelector('[slot="content"]') || this.lastElementChild

    if (!this.#trigger || !this.#content || this.#trigger === this.#content) return

    // Generate unique ID for content
    this.#contentId = this.#content.id || `ytz-tooltip-${++tooltipId}`
    this.#content.id = this.#contentId

    // Set up ARIA
    this.#trigger.setAttribute('aria-describedby', this.#contentId)
    this.#content.setAttribute('role', 'tooltip')
    this.#content.hidden = true

    // Hover listeners
    this.#trigger.addEventListener('mouseenter', this.#handleMouseEnter)
    this.#trigger.addEventListener('mouseleave', this.#handleMouseLeave)
    this.#content.addEventListener('mouseenter', this.#handleContentMouseEnter)
    this.#content.addEventListener('mouseleave', this.#handleMouseLeave)

    // Focus listeners
    this.#trigger.addEventListener('focusin', this.#handleFocusIn)
    this.#trigger.addEventListener('focusout', this.#handleFocusOut)

    // Touch support
    this.#trigger.addEventListener('touchstart', this.#handleTouchStart, { passive: true })
  }

  #cleanup() {
    this.#trigger?.removeEventListener('mouseenter', this.#handleMouseEnter)
    this.#trigger?.removeEventListener('mouseleave', this.#handleMouseLeave)
    this.#content?.removeEventListener('mouseenter', this.#handleContentMouseEnter)
    this.#content?.removeEventListener('mouseleave', this.#handleMouseLeave)
    this.#trigger?.removeEventListener('focusin', this.#handleFocusIn)
    this.#trigger?.removeEventListener('focusout', this.#handleFocusOut)
    this.#trigger?.removeEventListener('touchstart', this.#handleTouchStart)
  }

  #handleMouseEnter = () => {
    clearTimeout(this.#hideTimeout)
    this.#showTimeout = setTimeout(() => this.#show(), this.delay)
  }

  #handleMouseLeave = () => {
    clearTimeout(this.#showTimeout)
    this.#hideTimeout = setTimeout(() => this.#hide(), 100)
  }

  #handleContentMouseEnter = () => {
    clearTimeout(this.#hideTimeout)
  }

  #handleFocusIn = () => {
    clearTimeout(this.#hideTimeout)
    this.#show() // No delay for focus (accessibility)
  }

  #handleFocusOut = () => {
    this.#hide()
  }

  #handleTouchStart = () => {
    if (this.#isVisible) {
      this.#hide()
    } else {
      this.#show()
    }
  }

  #show() {
    if (!this.#content || this.#isVisible) return

    this.#content.hidden = false
    this.#isVisible = true
    this.#updatePosition()

    // Listen for scroll/resize to reposition
    window.addEventListener('scroll', this.#updatePosition, { passive: true, capture: true })
    window.addEventListener('resize', this.#updatePosition, { passive: true })

    this.dispatchEvent(new CustomEvent('show', { bubbles: true }))
  }

  #hide() {
    if (!this.#content || !this.#isVisible) return

    this.#content.hidden = true
    this.#isVisible = false

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

    // Position tooltip fixed relative to viewport
    this.#content.style.position = 'fixed'
    this.#content.style.left = `${x}px`
    this.#content.style.top = `${y}px`

    // Set data attribute for CSS arrow styling
    this.#content.dataset.placement = finalPlacement
  }

  // Public API

  /** Show the tooltip programmatically */
  show() {
    clearTimeout(this.#hideTimeout)
    this.#show()
  }

  /** Hide the tooltip programmatically */
  hide() {
    clearTimeout(this.#showTimeout)
    this.#hide()
  }

  /**
   * Anchor tooltip to viewport coordinates.
   * Enables "headless" mode for programmatic positioning (e.g., SVG canvas).
   * @param {number} x - Viewport X coordinate
   * @param {number} y - Viewport Y coordinate
   */
  anchorTo(x, y) {
    if (!this.#anchor) {
      // Clean up any existing trigger listeners
      if (this.#trigger && this.#trigger !== this.#anchor) {
        this.#cleanup()
        this.#trigger.removeAttribute('aria-describedby')
      }

      this.#anchor = document.createElement('span')
      this.#anchor.style.cssText = 'position:fixed;width:1px;height:1px;pointer-events:none'
      this.prepend(this.#anchor)
      this.#trigger = this.#anchor

      // Ensure content is set up if we're in headless mode
      if (!this.#content) {
        this.#content = this.querySelector('[slot="content"]')
      }
      if (this.#content && !this.#contentId) {
        this.#contentId = this.#content.id || `ytz-tooltip-${++tooltipId}`
        this.#content.id = this.#contentId
        this.#content.setAttribute('role', 'tooltip')
        this.#content.hidden = true
      }
    }

    this.#anchor.style.left = `${x}px`
    this.#anchor.style.top = `${y}px`

    if (this.#isVisible) this.#updatePosition()
  }

  /** @returns {string} Text content of the tooltip */
  get text() {
    return this.#content?.textContent || ''
  }

  /** @param {string} value */
  set text(value) {
    if (this.#content) {
      this.#content.textContent = value
    }
  }
}

register('ytz-tooltip', YtzTooltip)

export { YtzTooltip }
