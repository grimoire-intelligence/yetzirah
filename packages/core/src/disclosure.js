/**
 * ytz-disclosure - Expandable content Web Component.
 * Toggles content visibility with proper ARIA attributes.
 *
 * @module @yetzirah/core/disclosure
 * @example
 * <ytz-disclosure>
 *   <button>Show Details</button>
 *   <div>Hidden content...</div>
 * </ytz-disclosure>
 *
 * @example
 * // Initially open
 * <ytz-disclosure open>
 *   <button>Hide Details</button>
 *   <div>Visible content...</div>
 * </ytz-disclosure>
 */

let disclosureId = 0

/**
 * @class YtzDisclosure
 * @extends HTMLElement
 */
class YtzDisclosure extends HTMLElement {
  static observedAttributes = ['open']

  /** @type {HTMLElement|null} */
  #trigger = null
  /** @type {HTMLElement|null} */
  #content = null
  /** @type {string|null} */
  #contentId = null

  connectedCallback() {
    this.#setup()
    this.#updateState()
  }

  disconnectedCallback() {
    this.#trigger?.removeEventListener('click', this.#handleClick)
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (name === 'open' && this.isConnected) {
      this.#updateState()
    }
  }

  #setup() {
    // Find trigger (first button) and content (next sibling element)
    this.#trigger = this.querySelector('button')
    this.#content = this.#trigger?.nextElementSibling

    if (!this.#trigger || !this.#content) return

    // Generate unique ID for content if needed
    this.#contentId = this.#content.id || `ytz-disclosure-${++disclosureId}`
    this.#content.id = this.#contentId

    // Set up ARIA linkage
    this.#trigger.setAttribute('aria-controls', this.#contentId)

    // Attach click listener
    this.#trigger.addEventListener('click', this.#handleClick)
  }

  #handleClick = () => {
    this.toggle()
  }

  #updateState() {
    const isOpen = this.hasAttribute('open')

    if (this.#trigger) {
      this.#trigger.setAttribute('aria-expanded', String(isOpen))
    }

    if (this.#content) {
      this.#content.hidden = !isOpen
    }
  }

  /**
   * Toggle the disclosure open/closed state.
   * Dispatches a 'toggle' event with the new state.
   */
  toggle() {
    const willOpen = !this.hasAttribute('open')

    if (willOpen) {
      this.setAttribute('open', '')
    } else {
      this.removeAttribute('open')
    }

    this.dispatchEvent(new CustomEvent('toggle', {
      bubbles: true,
      detail: { open: willOpen }
    }))
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
}

customElements.define('ytz-disclosure', YtzDisclosure)

export { YtzDisclosure }
