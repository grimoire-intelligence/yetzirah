/**
 * ytz-autocomplete - Text input with filterable dropdown selection.
 * Supports single and multi-select modes with async loading.
 *
 * @module @grimoire/yetzirah-core/autocomplete
 * @example
 * <ytz-autocomplete>
 *   <input slot="input" placeholder="Search...">
 *   <ytz-option value="apple">Apple</ytz-option>
 *   <ytz-option value="banana">Banana</ytz-option>
 * </ytz-autocomplete>
 *
 * @example
 * // Multi-select mode
 * <ytz-autocomplete multiple>
 *   <input slot="input" placeholder="Select...">
 *   <ytz-option value="a">Option A</ytz-option>
 *   <ytz-option value="b">Option B</ytz-option>
 * </ytz-autocomplete>
 */

import { position } from './utils/position.js'
import { createKeyNav } from './utils/key-nav.js'
import { clickOutside } from './utils/click-outside.js'

let autocompleteId = 0

/**
 * @class YtzAutocomplete
 * @extends HTMLElement
 */
class YtzAutocomplete extends HTMLElement {
  static observedAttributes = ['open', 'multiple', 'loading']

  /** @type {HTMLInputElement|null} */
  #input = null
  /** @type {HTMLElement|null} */
  #listbox = null
  /** @type {string|null} */
  #listboxId = null
  /** @type {ReturnType<typeof createKeyNav>|null} */
  #keyNav = null
  /** @type {ReturnType<typeof clickOutside>|null} */
  #clickOutsideHandler = null
  /** @type {Set<string>} */
  #selected = new Set()
  /** @type {boolean} - Flag to prevent focus from re-opening after selection */
  #justClosed = false

  connectedCallback() {
    this.#setup()
  }

  disconnectedCallback() {
    this.#cleanup()
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (!this.isConnected) return
    if (name === 'open') {
      newVal !== null ? this.#showListbox() : this.#hideListbox()
    }
    if (name === 'loading') {
      this.#updateLoadingState()
    }
  }

  /** @returns {boolean} */
  get open() { return this.hasAttribute('open') }
  set open(v) { v ? this.setAttribute('open', '') : this.removeAttribute('open') }

  /** @returns {boolean} */
  get multiple() { return this.hasAttribute('multiple') }
  set multiple(v) { v ? this.setAttribute('multiple', '') : this.removeAttribute('multiple') }

  /** @returns {boolean} */
  get loading() { return this.hasAttribute('loading') }
  set loading(v) { v ? this.setAttribute('loading', '') : this.removeAttribute('loading') }

  /** @returns {boolean} */
  get filter() { return this.getAttribute('filter') !== 'false' }
  set filter(v) { this.setAttribute('filter', (v && v !== 'false') ? 'true' : 'false') }

  /** @returns {string|string[]} */
  get value() {
    return this.multiple ? [...this.#selected] : ([...this.#selected][0] || '')
  }
  set value(v) {
    this.#selected.clear()
    if (Array.isArray(v)) {
      v.forEach(val => this.#selected.add(val))
    } else if (v) {
      this.#selected.add(v)
    }
    this.#updateSelectedState()
  }

  /** @returns {string} */
  get inputValue() { return this.#input?.value || '' }
  set inputValue(v) { if (this.#input) this.#input.value = v }

  #setup() {
    this.#input = this.querySelector('[slot="input"]') || this.querySelector('input')
    if (!this.#input) return

    this.#listboxId = `ytz-autocomplete-${++autocompleteId}`

    // Create listbox wrapper
    this.#listbox = document.createElement('div')
    this.#listbox.setAttribute('role', 'listbox')
    this.#listbox.id = this.#listboxId
    this.#listbox.hidden = true
    if (this.multiple) {
      this.#listbox.setAttribute('aria-multiselectable', 'true')
    }

    // Move option children into listbox
    const options = [...this.querySelectorAll('ytz-option')]
    options.forEach(opt => this.#listbox.appendChild(opt))
    this.appendChild(this.#listbox)

    // ARIA on input
    this.#input.setAttribute('role', 'combobox')
    this.#input.setAttribute('aria-autocomplete', 'list')
    this.#input.setAttribute('aria-controls', this.#listboxId)
    this.#input.setAttribute('aria-expanded', 'false')
    this.#input.setAttribute('aria-haspopup', 'listbox')

    // Keyboard navigation
    this.#keyNav = createKeyNav(
      () => [...this.#listbox.querySelectorAll('ytz-option:not([hidden]):not([disabled])')],
      { orientation: 'vertical', wrap: true, autoActivate: false }
    )

    this.#input.addEventListener('input', this.#handleInput)
    this.#input.addEventListener('focus', this.#handleInputFocus)
    this.#input.addEventListener('keydown', this.#handleInputKeyDown)
    this.addEventListener('keydown', this.#handleKeyDown)
    this.addEventListener('option-click', this.#handleOptionClick)

    // Read initial selected state from HTML
    this.#listbox.querySelectorAll('ytz-option[selected]').forEach(opt => {
      const value = opt.getAttribute('value') || opt.textContent?.trim()
      if (value) this.#selected.add(value)
    })
    this.#updateSelectedState()

    // Initialize loading slot visibility
    this.#updateLoadingState()
  }

  #cleanup() {
    this.#input?.removeEventListener('input', this.#handleInput)
    this.#input?.removeEventListener('focus', this.#handleInputFocus)
    this.#input?.removeEventListener('keydown', this.#handleInputKeyDown)
    this.removeEventListener('keydown', this.#handleKeyDown)
    this.removeEventListener('option-click', this.#handleOptionClick)
    this.#clickOutsideHandler?.destroy()
  }

  #handleInput = () => {
    if (!this.open) this.open = true
    if (this.filter) this.#filterOptions()
    this.dispatchEvent(new CustomEvent('input-change', {
      bubbles: true,
      detail: { value: this.#input.value }
    }))
  }

  #handleInputFocus = () => {
    // Don't re-open if we just closed from a selection
    if (this.#justClosed) {
      this.#justClosed = false
      return
    }
    const hasOptions = this.#listbox?.querySelector('ytz-option:not([hidden])')
    if (hasOptions && !this.loading) this.open = true
  }

  #handleInputKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      e.stopPropagation() // Prevent bubbling to #handleKeyDown
      if (!this.open) this.open = true
      const firstOption = this.#listbox?.querySelector('ytz-option:not([hidden]):not([disabled])')
      firstOption?.focus()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      e.stopPropagation() // Prevent bubbling to #handleKeyDown
      if (!this.open) this.open = true
      const options = this.#listbox?.querySelectorAll('ytz-option:not([hidden]):not([disabled])')
      options?.[options.length - 1]?.focus()
    } else if (e.key === 'Escape' && this.open) {
      e.preventDefault()
      e.stopPropagation()
      this.open = false
    } else if (e.key === 'Enter' && this.open) {
      // Select first visible option on Enter from input
      const firstOption = this.#listbox?.querySelector('ytz-option:not([hidden]):not([disabled])')
      if (firstOption) {
        e.preventDefault()
        this.#selectOption(firstOption)
      }
    }
  }

  #handleKeyDown = (e) => {
    if (!this.open) return

    if (e.key === 'Escape') {
      e.preventDefault()
      this.open = false
      this.#input?.focus()
      return
    }

    // Handle navigation when option is focused
    if (document.activeElement?.tagName === 'YTZ-OPTION') {
      this.#keyNav?.handleKeyDown(e)

      if (e.key === 'Enter' || e.key === ' ') {
        const focused = this.#listbox?.querySelector('ytz-option:focus')
        if (focused && !focused.hasAttribute('disabled')) {
          e.preventDefault()
          this.#selectOption(focused)
        }
      }

      if (e.key === 'Tab') {
        e.preventDefault()
        this.#input?.focus()
      }
    }
  }

  #handleOptionClick = (e) => {
    const option = e.detail?.option
    if (option && !option.hasAttribute('disabled')) {
      this.#selectOption(option)
    }
  }

  #selectOption(option) {
    const value = option.getAttribute('value') || option.textContent?.trim()
    if (!value) return

    if (this.multiple) {
      if (this.#selected.has(value)) {
        this.#selected.delete(value)
      } else {
        this.#selected.add(value)
      }
    } else {
      this.#selected.clear()
      this.#selected.add(value)
      this.#input.value = option.textContent?.trim() || value
      this.#justClosed = true // Prevent focus from re-opening
      this.open = false
      this.#input?.focus()
    }

    this.#updateSelectedState()

    this.dispatchEvent(new CustomEvent('change', {
      bubbles: true,
      detail: { value: this.value, option }
    }))
  }

  #updateSelectedState() {
    const options = this.#listbox?.querySelectorAll('ytz-option') || []
    options.forEach(opt => {
      const value = opt.getAttribute('value') || opt.textContent?.trim()
      const isSelected = this.#selected.has(value)
      opt.toggleAttribute('selected', isSelected)
      opt.setAttribute('aria-selected', String(isSelected))
    })
  }

  #filterOptions() {
    const query = this.#input?.value.toLowerCase() || ''
    const options = this.#listbox?.querySelectorAll('ytz-option') || []

    options.forEach(opt => {
      const text = opt.textContent?.toLowerCase() || ''
      opt.hidden = !text.includes(query)
    })
  }

  #showListbox() {
    if (!this.#input || !this.#listbox) return

    this.#listbox.hidden = false
    this.#input.setAttribute('aria-expanded', 'true')
    this.#updatePosition()

    this.#clickOutsideHandler = clickOutside(this, () => {
      this.open = false
    })

    window.addEventListener('scroll', this.#updatePosition, { passive: true, capture: true })
    window.addEventListener('resize', this.#updatePosition, { passive: true })

    this.dispatchEvent(new CustomEvent('open', { bubbles: true }))
  }

  #hideListbox() {
    if (!this.#input || !this.#listbox) return

    this.#listbox.hidden = true
    this.#input.setAttribute('aria-expanded', 'false')

    this.#clickOutsideHandler?.destroy()
    this.#clickOutsideHandler = null
    window.removeEventListener('scroll', this.#updatePosition, { capture: true })
    window.removeEventListener('resize', this.#updatePosition)

    this.dispatchEvent(new CustomEvent('close', { bubbles: true }))
  }

  #updatePosition = () => {
    if (!this.#input || !this.#listbox) return

    const { x, y } = position(this.#input, this.#listbox, {
      placement: 'bottom',
      offset: 4
    })

    this.#listbox.style.position = 'fixed'
    this.#listbox.style.left = `${x}px`
    this.#listbox.style.top = `${y}px`
    this.#listbox.style.minWidth = `${this.#input.offsetWidth}px`
  }

  #updateLoadingState() {
    const loadingSlot = this.querySelector('[slot="loading"]')
    if (loadingSlot) {
      loadingSlot.hidden = !this.loading
    }
  }

  show() { this.open = true }
  hide() { this.open = false }
  toggle() { this.open = !this.open }

  clear() {
    this.#selected.clear()
    this.#updateSelectedState()
    if (this.#input) this.#input.value = ''
    this.dispatchEvent(new CustomEvent('clear', { bubbles: true }))
  }

  /**
   * Add options programmatically.
   * @param {Array<{value: string, label: string, disabled?: boolean}>} options
   */
  setOptions(options) {
    if (!this.#listbox) return
    this.#listbox.innerHTML = ''
    options.forEach(({ value, label, disabled }) => {
      const opt = document.createElement('ytz-option')
      opt.setAttribute('value', value)
      opt.textContent = label
      if (disabled) opt.setAttribute('disabled', '')
      this.#listbox.appendChild(opt)
    })
    this.#updateSelectedState()
  }
}

/**
 * ytz-option - Individual option in autocomplete.
 * @attr value - Option value
 * @attr disabled - When present, option is not selectable
 * @attr selected - When present, option is selected
 */
class YtzOption extends HTMLElement {
  connectedCallback() {
    this.setAttribute('role', 'option')
    if (!this.hasAttribute('tabindex') && !this.hasAttribute('disabled')) {
      this.setAttribute('tabindex', '-1')
    }
    if (this.hasAttribute('disabled')) {
      this.setAttribute('aria-disabled', 'true')
    }
    this.setAttribute('aria-selected', this.hasAttribute('selected') ? 'true' : 'false')
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
    this.dispatchEvent(new CustomEvent('option-click', {
      bubbles: true,
      detail: { option: this }
    }))
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

  /** @returns {boolean} */
  get selected() { return this.hasAttribute('selected') }
  set selected(v) {
    v ? this.setAttribute('selected', '') : this.removeAttribute('selected')
    this.setAttribute('aria-selected', String(v))
  }

  /** @returns {string|null} */
  get value() { return this.getAttribute('value') }
  set value(v) { v ? this.setAttribute('value', v) : this.removeAttribute('value') }
}

customElements.define('ytz-autocomplete', YtzAutocomplete)
customElements.define('ytz-option', YtzOption)

export { YtzAutocomplete, YtzOption }
