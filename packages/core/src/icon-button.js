/**
 * ytz-icon-button - Icon button Web Component.
 * A button variant requiring aria-label for accessibility.
 *
 * @module @yetzirah/core/icon-button
 * @example
 * <ytz-icon-button aria-label="Close">
 *   <svg>...</svg>
 * </ytz-icon-button>
 *
 * @example
 * // With tooltip integration
 * <ytz-icon-button aria-label="Settings" tooltip>
 *   <svg>...</svg>
 * </ytz-icon-button>
 *
 * @example
 * // Disabled
 * <ytz-icon-button aria-label="Delete" disabled>
 *   <svg>...</svg>
 * </ytz-icon-button>
 */

/** @type {string} Default classes for icon button */
const DEFAULTS = 'pointer bn bg-transparent pa0 dib'

/**
 * @class YtzIconButton
 * @extends HTMLElement
 */
class YtzIconButton extends HTMLElement {
  static observedAttributes = ['disabled', 'aria-label', 'tooltip', 'class']

  /** @type {HTMLElement|null} */
  #tooltipEl = null

  connectedCallback() {
    this.#render()
    this.#checkAccessibility()
  }

  disconnectedCallback() {
    this.#removeTooltip()
    this.removeEventListener('mouseenter', this.#showTooltip)
    this.removeEventListener('mouseleave', this.#hideTooltip)
    this.removeEventListener('focus', this.#showTooltip)
    this.removeEventListener('blur', this.#hideTooltip)
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (this.isConnected) {
      this.#render()
      if (name === 'aria-label') {
        this.#checkAccessibility()
      }
    }
  }

  #checkAccessibility() {
    if (!this.hasAttribute('aria-label')) {
      console.warn('ytz-icon-button: aria-label is required for accessibility')
    }
  }

  #render() {
    const userClass = this.getAttribute('class') || ''
    const button = this.querySelector('button.ytz-icon-button-inner') || document.createElement('button')
    const isNew = !button.parentNode

    button.type = 'button'
    button.className = 'ytz-icon-button-inner ' + DEFAULTS + (userClass ? ' ' + userClass : '')
    button.disabled = this.hasAttribute('disabled')

    // Copy aria-label to inner button
    const label = this.getAttribute('aria-label')
    if (label) {
      button.setAttribute('aria-label', label)
    }

    // Copy aria-* and data-* attributes
    for (const attr of this.attributes) {
      if ((attr.name.startsWith('aria-') || attr.name.startsWith('data-')) && attr.name !== 'aria-label') {
        button.setAttribute(attr.name, attr.value)
      }
    }

    if (isNew) {
      // Move icon content into button
      while (this.firstChild && this.firstChild !== button) {
        button.appendChild(this.firstChild)
      }
      this.appendChild(button)
    }

    // Setup tooltip if requested
    this.#setupTooltip()
  }

  #setupTooltip() {
    // Remove old listeners
    this.removeEventListener('mouseenter', this.#showTooltip)
    this.removeEventListener('mouseleave', this.#hideTooltip)
    this.removeEventListener('focus', this.#showTooltip)
    this.removeEventListener('blur', this.#hideTooltip)

    if (this.hasAttribute('tooltip')) {
      this.addEventListener('mouseenter', this.#showTooltip)
      this.addEventListener('mouseleave', this.#hideTooltip)
      this.addEventListener('focus', this.#showTooltip)
      this.addEventListener('blur', this.#hideTooltip)
    }
  }

  #showTooltip = () => {
    const label = this.getAttribute('aria-label')
    if (!label) return

    this.#tooltipEl = document.createElement('div')
    this.#tooltipEl.className = 'ytz-icon-button-tooltip'
    this.#tooltipEl.textContent = label
    this.#tooltipEl.setAttribute('role', 'tooltip')

    // Position tooltip below button
    const rect = this.getBoundingClientRect()
    this.#tooltipEl.style.cssText = `
      position: fixed;
      left: ${rect.left + rect.width / 2}px;
      top: ${rect.bottom + 4}px;
      transform: translateX(-50%);
      z-index: 9999;
    `

    document.body.appendChild(this.#tooltipEl)
  }

  #hideTooltip = () => {
    this.#removeTooltip()
  }

  #removeTooltip() {
    if (this.#tooltipEl) {
      this.#tooltipEl.remove()
      this.#tooltipEl = null
    }
  }

  /**
   * Get/set the disabled state.
   * @type {boolean}
   */
  get disabled() {
    return this.hasAttribute('disabled')
  }

  set disabled(value) {
    if (value) {
      this.setAttribute('disabled', '')
    } else {
      this.removeAttribute('disabled')
    }
  }
}

customElements.define('ytz-icon-button', YtzIconButton)

export { YtzIconButton }
