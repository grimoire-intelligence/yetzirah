/**
 * ytz-toggle - Switch/Toggle Web Component.
 * A toggle switch with checkbox semantics and aria-checked.
 *
 * @module @grimoire/yetzirah-core/toggle
 * @example
 * <ytz-toggle>Enable notifications</ytz-toggle>
 *
 * @example
 * // Initially checked
 * <ytz-toggle checked>Dark mode</ytz-toggle>
 *
 * @example
 * // Disabled
 * <ytz-toggle disabled>Premium feature</ytz-toggle>
 */

/**
 * @class YtzToggle
 * @extends HTMLElement
 */
class YtzToggle extends HTMLElement {
  static observedAttributes = ['checked', 'disabled']

  connectedCallback() {
    this.#setup()
    this.#updateState()
  }

  #setup() {
    // Set role and make focusable
    this.setAttribute('role', 'switch')
    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '0')
    }

    // Event listeners
    this.addEventListener('click', this.#handleClick)
    this.addEventListener('keydown', this.#handleKeydown)
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.#handleClick)
    this.removeEventListener('keydown', this.#handleKeydown)
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (this.isConnected) {
      this.#updateState()
    }
  }

  #handleClick = () => {
    if (this.disabled) return
    this.toggle()
  }

  #handleKeydown = (e) => {
    if (this.disabled) return

    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      this.toggle()
    }
  }

  #updateState() {
    this.setAttribute('aria-checked', String(this.checked))
    this.setAttribute('aria-disabled', String(this.disabled))
  }

  /**
   * Toggle the checked state.
   * Dispatches a 'change' event with the new state.
   */
  toggle() {
    const willCheck = !this.checked

    if (willCheck) {
      this.setAttribute('checked', '')
    } else {
      this.removeAttribute('checked')
    }

    this.dispatchEvent(new CustomEvent('change', {
      bubbles: true,
      detail: { checked: willCheck }
    }))
  }

  /**
   * Get/set the checked state.
   * @type {boolean}
   */
  get checked() {
    return this.hasAttribute('checked')
  }

  set checked(value) {
    if (value) {
      this.setAttribute('checked', '')
    } else {
      this.removeAttribute('checked')
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

customElements.define('ytz-toggle', YtzToggle)

export { YtzToggle }
