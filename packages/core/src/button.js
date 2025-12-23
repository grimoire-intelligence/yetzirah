/**
 * ytz-button - Polymorphic button/anchor Web Component.
 * Renders <a> when href provided, <button> otherwise.
 *
 * @module @grimoire/yetzirah-core/button
 * @example
 * // Link button
 * <ytz-button href="/dashboard" class="ph3 pv2 br2 white bg-blue">Dashboard</ytz-button>
 *
 * @example
 * // Action button
 * <ytz-button onclick="handleSubmit()" class="ph3 pv2 br2 white bg-blue">Submit</ytz-button>
 */

import { register } from './utils/register.js'

/** @type {string} Default classes for anchor elements */
const ANCHOR_DEFAULTS = 'pointer font-inherit no-underline dib'

/** @type {string} Default classes for button elements (no border reset - user controls borders) */
const BUTTON_DEFAULTS = 'pointer font-inherit bg-transparent'

/**
 * @class YtzButton
 * @extends HTMLElement
 */
class YtzButton extends HTMLElement {
  connectedCallback() {
    this.#render()
  }

  static get observedAttributes() {
    return ['href', 'disabled', 'type', 'class']
  }

  attributeChangedCallback() {
    if (this.isConnected) this.#render()
  }

  #render() {
    const href = this.getAttribute('href')
    const userClass = this.getAttribute('class') || ''
    const isAnchor = href != null

    const el = document.createElement(isAnchor ? 'a' : 'button')
    const defaults = isAnchor ? ANCHOR_DEFAULTS : BUTTON_DEFAULTS
    el.className = defaults + (userClass ? ' ' + userClass : '')

    if (isAnchor) {
      el.href = href
    } else {
      el.type = this.getAttribute('type') || 'button'
      if (this.hasAttribute('disabled')) el.disabled = true
    }

    // Copy aria-* and data-* attributes
    for (const attr of this.attributes) {
      if (attr.name.startsWith('aria-') || attr.name.startsWith('data-')) {
        el.setAttribute(attr.name, attr.value)
      }
    }

    el.innerHTML = this.#contentCache || this.innerHTML
    this.#contentCache = el.innerHTML

    this.replaceChildren(el)
  }

  /** @type {string|null} Cache innerHTML to preserve across re-renders */
  #contentCache = null
}

register('ytz-button', YtzButton)

export { YtzButton }
