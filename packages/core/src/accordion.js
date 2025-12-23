/**
 * ytz-accordion - Coordinated disclosure container.
 * Manages multiple accordion items with optional exclusive mode.
 *
 * @module @grimoire/yetzirah-core/accordion
 * @example
 * <ytz-accordion>
 *   <ytz-accordion-item>
 *     <button>Section 1</button>
 *     <div>Content 1</div>
 *   </ytz-accordion-item>
 *   <ytz-accordion-item>
 *     <button>Section 2</button>
 *     <div>Content 2</div>
 *   </ytz-accordion-item>
 * </ytz-accordion>
 *
 * @example
 * // Exclusive mode - only one item open at a time
 * <ytz-accordion exclusive>
 *   <ytz-accordion-item open>...</ytz-accordion-item>
 *   <ytz-accordion-item>...</ytz-accordion-item>
 * </ytz-accordion>
 */

import { register } from './utils/register.js'

let accordionItemId = 0

/**
 * @class YtzAccordion
 * @extends HTMLElement
 */
class YtzAccordion extends HTMLElement {
  connectedCallback() {
    this.addEventListener('toggle', this.#handleItemToggle)
  }

  disconnectedCallback() {
    this.removeEventListener('toggle', this.#handleItemToggle)
  }

  /**
   * Whether exclusive mode is enabled (only one item open at a time).
   * @type {boolean}
   */
  get exclusive() {
    return this.hasAttribute('exclusive')
  }

  set exclusive(value) {
    if (value) {
      this.setAttribute('exclusive', '')
    } else {
      this.removeAttribute('exclusive')
    }
  }

  /**
   * Get all accordion items.
   * @returns {YtzAccordionItem[]}
   */
  get items() {
    return Array.from(this.querySelectorAll(':scope > ytz-accordion-item'))
  }

  /**
   * Handle toggle event from accordion item.
   * In exclusive mode, close other items when one opens.
   * @param {CustomEvent} e
   */
  #handleItemToggle = (e) => {
    if (!this.exclusive || !e.detail.open) return

    const openedItem = e.target
    this.items.forEach(item => {
      if (item !== openedItem && item.open) {
        item.open = false
      }
    })
  }
}

/**
 * ytz-accordion-item - Individual accordion panel.
 * Functions like ytz-disclosure but coordinates with parent accordion.
 *
 * @attr open - When present, content is visible
 *
 * @example
 * <ytz-accordion-item>
 *   <button>Toggle Section</button>
 *   <div>
 *     <div>Content goes here...</div>
 *   </div>
 * </ytz-accordion-item>
 */
class YtzAccordionItem extends HTMLElement {
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
    this.#contentId = this.#content.id || `ytz-accordion-content-${++accordionItemId}`
    this.#content.id = this.#contentId

    // Generate ID for trigger if needed (for aria-labelledby on content)
    this.#trigger.id = this.#trigger.id || `ytz-accordion-trigger-${accordionItemId}`

    // Set up ARIA attributes
    this.#trigger.setAttribute('aria-controls', this.#contentId)
    this.#content.setAttribute('aria-labelledby', this.#trigger.id)
    this.#content.setAttribute('role', 'region')

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
   * Toggle the accordion item open/closed state.
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

register('ytz-accordion', YtzAccordion)
register('ytz-accordion-item', YtzAccordionItem)

export { YtzAccordion, YtzAccordionItem }
