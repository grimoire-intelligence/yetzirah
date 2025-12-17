/**
 * ytz-menu - Dropdown menu with keyboard navigation.
 * Opens on trigger click, positions relative to trigger, closes on click outside/escape.
 *
 * @module @yetzirah/core/menu
 * @example
 * <ytz-menu>
 *   <button slot="trigger">Open Menu</button>
 *   <ytz-menuitem>Edit</ytz-menuitem>
 *   <ytz-menuitem>Delete</ytz-menuitem>
 * </ytz-menu>
 *
 * @example
 * <ytz-menu placement="bottom-start">
 *   <button slot="trigger">Actions</button>
 *   <ytz-menuitem value="edit">Edit</ytz-menuitem>
 *   <ytz-menuitem disabled>Archive</ytz-menuitem>
 * </ytz-menu>
 */

import { position } from './utils/position.js'
import { createKeyNav } from './utils/key-nav.js'
import { clickOutside } from './utils/click-outside.js'

let menuId = 0

/**
 * @class YtzMenu
 * @extends HTMLElement
 */
class YtzMenu extends HTMLElement {
  static observedAttributes = ['open', 'placement']

  /** @type {HTMLElement|null} */
  #trigger = null
  /** @type {HTMLElement|null} */
  #popup = null
  /** @type {string|null} */
  #menuId = null
  /** @type {ReturnType<typeof createKeyNav>|null} */
  #keyNav = null
  /** @type {ReturnType<typeof clickOutside>|null} */
  #clickOutsideHandler = null
  /** @type {number} */
  #lastCloseTime = 0

  connectedCallback() {
    this.#setup()
  }

  disconnectedCallback() {
    this.#cleanup()
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (!this.isConnected) return
    if (name === 'open') {
      newVal !== null ? this.#showMenu() : this.#hideMenu()
    }
  }

  /** @returns {boolean} */
  get open() { return this.hasAttribute('open') }
  set open(v) { v ? this.setAttribute('open', '') : this.removeAttribute('open') }

  /** @returns {string} */
  get placement() { return this.getAttribute('placement') || 'bottom-start' }
  set placement(v) { v ? this.setAttribute('placement', v) : this.removeAttribute('placement') }

  #setup() {
    this.#trigger = this.querySelector('[slot="trigger"]')
    if (!this.#trigger) return

    this.#menuId = `ytz-menu-${++menuId}`

    // Create popup wrapper for menu items
    this.#popup = document.createElement('div')
    this.#popup.setAttribute('role', 'menu')
    this.#popup.id = this.#menuId
    this.#popup.hidden = true

    // Move all menuitem children into popup
    const items = [...this.querySelectorAll('ytz-menuitem')]
    items.forEach(item => this.#popup.appendChild(item))
    this.appendChild(this.#popup)

    // ARIA on trigger
    this.#trigger.setAttribute('aria-haspopup', 'menu')
    this.#trigger.setAttribute('aria-controls', this.#menuId)
    this.#trigger.setAttribute('aria-expanded', 'false')

    // Keyboard navigation
    this.#keyNav = createKeyNav(
      () => [...this.#popup.querySelectorAll('ytz-menuitem:not([disabled])')],
      { orientation: 'vertical', wrap: true, autoActivate: false }
    )

    this.#trigger.addEventListener('click', this.#handleTriggerClick)
    this.addEventListener('keydown', this.#handleKeyDown)
  }

  #cleanup() {
    this.#trigger?.removeEventListener('click', this.#handleTriggerClick)
    this.removeEventListener('keydown', this.#handleKeyDown)
    this.#clickOutsideHandler?.destroy()
  }

  #handleTriggerClick = () => { this.open = !this.open }

  #handleKeyDown = (e) => {
    if (!this.open) return

    if (e.key === 'Escape') {
      e.preventDefault()
      this.open = false
      this.#trigger?.focus()
      return
    }

    this.#keyNav?.handleKeyDown(e)

    if (e.key === 'Enter' || e.key === ' ') {
      const focused = this.#popup?.querySelector('ytz-menuitem:focus')
      if (focused && !focused.hasAttribute('disabled')) {
        e.preventDefault()
        focused.click()
      }
    }
  }

  #showMenu() {
    if (!this.#trigger || !this.#popup) return
    // Prevent re-opening if we just closed (e.g., click-outside + toggle in same event)
    if (performance.now() - this.#lastCloseTime < 10) {
      // Remove attribute to keep state consistent since we're blocking the open
      this.removeAttribute('open')
      return
    }

    // Pre-position as fixed but invisible to get correct layout
    this.#popup.style.position = 'fixed'
    this.#popup.style.visibility = 'hidden'
    this.#popup.hidden = false

    // Force synchronous reflow so popup has layout dimensions
    void this.#popup.offsetHeight

    // Calculate and apply position
    const basePlacement = this.placement.split('-')[0] || 'bottom'
    const { x, y } = position(this.#trigger, this.#popup, {
      placement: basePlacement,
      offset: 4
    })
    this.#popup.style.left = `${x}px`
    this.#popup.style.top = `${y}px`

    // Now make visible
    this.#popup.style.visibility = ''
    this.#trigger.setAttribute('aria-expanded', 'true')

    const firstItem = this.#popup.querySelector('ytz-menuitem:not([disabled])')
    firstItem?.focus()

    // Defer click-outside setup to next event loop tick to avoid triggering on same click
    setTimeout(() => {
      // Only set up if still open (user might have closed it already)
      if (!this.open) return
      this.#clickOutsideHandler = clickOutside(this.#popup, () => {
        this.open = false
      }, { ignore: this.#trigger })
    }, 0)

    window.addEventListener('scroll', this.#updatePosition, { passive: true, capture: true })
    window.addEventListener('resize', this.#updatePosition, { passive: true })

    this.dispatchEvent(new CustomEvent('open', { bubbles: true }))
  }

  #hideMenu() {
    if (!this.#trigger || !this.#popup) return

    // Record close time to prevent re-opening in the same event
    this.#lastCloseTime = performance.now()

    this.#popup.hidden = true
    this.#trigger.setAttribute('aria-expanded', 'false')

    this.#clickOutsideHandler?.destroy()
    this.#clickOutsideHandler = null
    window.removeEventListener('scroll', this.#updatePosition, { capture: true })
    window.removeEventListener('resize', this.#updatePosition)

    this.dispatchEvent(new CustomEvent('close', { bubbles: true }))
  }

  #updatePosition = () => {
    if (!this.#trigger || !this.#popup) return

    const basePlacement = this.placement.split('-')[0] || 'bottom'
    const { x, y } = position(this.#trigger, this.#popup, {
      placement: basePlacement,
      offset: 4
    })

    this.#popup.style.position = 'fixed'
    this.#popup.style.left = `${x}px`
    this.#popup.style.top = `${y}px`
  }

  show() { this.open = true }
  hide() { this.open = false }
  toggle() { this.open = !this.open }
}

/**
 * ytz-menuitem - Individual menu item.
 * @attr disabled - When present, item is not selectable
 * @attr value - Optional value for select event
 */
class YtzMenuItem extends HTMLElement {
  connectedCallback() {
    this.setAttribute('role', 'menuitem')
    if (!this.hasAttribute('tabindex') && !this.hasAttribute('disabled')) {
      this.setAttribute('tabindex', '-1')
    }
    if (this.hasAttribute('disabled')) {
      this.setAttribute('aria-disabled', 'true')
    }
    this.addEventListener('click', this.#handleClick)
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.#handleClick)
  }

  #handleClick = (e) => {
    if (this.hasAttribute('disabled')) {
      e.preventDefault()
      e.stopPropagation()
      return
    }

    const menu = this.closest('ytz-menu')
    if (menu) {
      this.dispatchEvent(new CustomEvent('select', {
        bubbles: true,
        detail: { value: this.getAttribute('value') || this.textContent?.trim() }
      }))
      menu.open = false
    }
  }

  /** @returns {boolean} */
  get disabled() { return this.hasAttribute('disabled') }
  set disabled(v) {
    if (v) {
      this.setAttribute('disabled', '')
      this.setAttribute('aria-disabled', 'true')
      this.removeAttribute('tabindex')
    } else {
      this.removeAttribute('disabled')
      this.removeAttribute('aria-disabled')
      this.setAttribute('tabindex', '-1')
    }
  }

  /** @returns {string|null} */
  get value() { return this.getAttribute('value') }
  set value(v) { v ? this.setAttribute('value', v) : this.removeAttribute('value') }
}

customElements.define('ytz-menu', YtzMenu)
customElements.define('ytz-menuitem', YtzMenuItem)

export { YtzMenu, YtzMenuItem }
