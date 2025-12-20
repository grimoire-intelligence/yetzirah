/**
 * ytz-chip - Deletable tag/label Web Component.
 * A chip with optional delete button and keyboard support.
 *
 * @module @yetzirah/core/chip
 * @example
 * <ytz-chip>Tag</ytz-chip>
 *
 * @example
 * // Deletable chip
 * <ytz-chip deletable>Remove me</ytz-chip>
 *
 * @example
 * // Disabled chip
 * <ytz-chip deletable disabled>Can't delete</ytz-chip>
 */

/**
 * @class YtzChip
 * @extends HTMLElement
 */
class YtzChip extends HTMLElement {
  static observedAttributes = ['deletable', 'disabled']

  /** @type {HTMLButtonElement|null} */
  #deleteButton = null

  connectedCallback() {
    this.#setup()
  }

  disconnectedCallback() {
    this.#deleteButton?.removeEventListener('click', this.#handleDelete)
    this.removeEventListener('keydown', this.#handleKeydown)
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (this.isConnected) {
      this.#setup()
    }
  }

  #setup() {
    // Remove existing delete button if any
    this.#deleteButton?.remove()
    this.#deleteButton = null

    // Add delete button if deletable
    if (this.hasAttribute('deletable')) {
      this.#deleteButton = document.createElement('button')
      this.#deleteButton.type = 'button'
      this.#deleteButton.setAttribute('aria-label', 'Delete')
      this.#deleteButton.className = 'ytz-chip-delete'
      this.#deleteButton.textContent = '\u00D7' // × character
      this.#deleteButton.disabled = this.disabled
      this.#deleteButton.addEventListener('click', this.#handleDelete)
      this.appendChild(this.#deleteButton)
    }

    // Keyboard support for delete
    this.removeEventListener('keydown', this.#handleKeydown)
    if (this.hasAttribute('deletable')) {
      this.addEventListener('keydown', this.#handleKeydown)
    }
  }

  #handleDelete = (e) => {
    e.stopPropagation()
    if (this.disabled) return

    this.dispatchEvent(new CustomEvent('delete', {
      bubbles: true,
      detail: { chip: this }
    }))
  }

  #handleKeydown = (e) => {
    if (this.disabled) return

    if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault()
      this.dispatchEvent(new CustomEvent('delete', {
        bubbles: true,
        detail: { chip: this }
      }))
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
    if (this.#deleteButton) {
      this.#deleteButton.disabled = value
    }
  }

  /**
   * Get/set the deletable state.
   * @type {boolean}
   */
  get deletable() {
    return this.hasAttribute('deletable')
  }

  set deletable(value) {
    if (value) {
      this.setAttribute('deletable', '')
    } else {
      this.removeAttribute('deletable')
    }
  }
}

customElements.define('ytz-chip', YtzChip)

export { YtzChip }
