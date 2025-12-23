/**
 * ytz-listbox - Keyboard-navigable list selection with single/multi-select modes.
 * @module @grimoire/yetzirah-core/listbox
 */

import { createKeyNav } from './utils/key-nav.js'

let listboxId = 0

class YtzListbox extends HTMLElement {
  static observedAttributes = ['multiple', 'disabled']
  #keyNav = null
  #selected = new Set()
  #id = null

  connectedCallback() { this.#setup() }
  disconnectedCallback() { this.#cleanup() }

  attributeChangedCallback(name, oldVal, newVal) {
    if (!this.isConnected) return
    if (name === 'multiple') this.setAttribute('aria-multiselectable', newVal !== null ? 'true' : 'false')
    if (name === 'disabled') this.#updateDisabledState()
  }

  get multiple() { return this.hasAttribute('multiple') }
  set multiple(v) { v ? this.setAttribute('multiple', '') : this.removeAttribute('multiple') }

  get disabled() { return this.hasAttribute('disabled') }
  set disabled(v) { v ? this.setAttribute('disabled', '') : this.removeAttribute('disabled') }

  get value() {
    return this.multiple ? [...this.#selected] : ([...this.#selected][0] || '')
  }
  set value(v) {
    this.#selected.clear()
    if (Array.isArray(v)) v.forEach(val => this.#selected.add(val))
    else if (v) this.#selected.add(v)
    this.#updateSelectedState()
  }

  get options() { return [...this.querySelectorAll('ytz-option')] }
  get selectedOptions() { return [...this.querySelectorAll('ytz-option[selected]')] }

  #setup() {
    this.#id = `ytz-listbox-${++listboxId}`
    if (!this.id) this.id = this.#id
    this.setAttribute('role', 'listbox')
    if (this.multiple) this.setAttribute('aria-multiselectable', 'true')
    if (!this.hasAttribute('tabindex')) this.setAttribute('tabindex', '0')

    this.#keyNav = createKeyNav(
      () => [...this.querySelectorAll('ytz-option:not([disabled])')],
      { orientation: 'vertical', wrap: true, autoActivate: false }
    )

    this.addEventListener('keydown', this.#handleKeyDown)
    this.addEventListener('option-click', this.#handleOptionClick)
    this.addEventListener('focus', this.#handleFocus)

    this.querySelectorAll('ytz-option[selected]').forEach(opt => {
      const value = opt.getAttribute('value') || opt.textContent?.trim()
      if (value) this.#selected.add(value)
    })
    this.#updateSelectedState()
  }

  #cleanup() {
    this.removeEventListener('keydown', this.#handleKeyDown)
    this.removeEventListener('option-click', this.#handleOptionClick)
    this.removeEventListener('focus', this.#handleFocus)
  }

  #handleFocus = () => {
    const selected = this.querySelector('ytz-option[selected]:not([disabled])')
    const first = this.querySelector('ytz-option:not([disabled])')
    ;(selected || first)?.focus()
  }

  #handleKeyDown = (e) => {
    if (this.disabled) return
    this.#keyNav?.handleKeyDown(e)
    if (e.key === 'Enter' || e.key === ' ') {
      const focused = this.querySelector('ytz-option:focus')
      if (focused && !focused.hasAttribute('disabled')) {
        e.preventDefault()
        this.#selectOption(focused)
      }
    }
  }

  #handleOptionClick = (e) => {
    if (this.disabled) return
    const option = e.detail?.option
    if (option && !option.hasAttribute('disabled')) this.#selectOption(option)
  }

  #selectOption(option) {
    const value = option.getAttribute('value') || option.textContent?.trim()
    if (!value) return

    if (this.multiple) {
      this.#selected.has(value) ? this.#selected.delete(value) : this.#selected.add(value)
    } else {
      this.#selected.clear()
      this.#selected.add(value)
    }
    this.#updateSelectedState()
    this.dispatchEvent(new CustomEvent('change', { bubbles: true, detail: { value: this.value, option } }))
  }

  #updateSelectedState() {
    this.querySelectorAll('ytz-option').forEach(opt => {
      const value = opt.getAttribute('value') || opt.textContent?.trim()
      const isSelected = this.#selected.has(value)
      opt.toggleAttribute('selected', isSelected)
      opt.setAttribute('aria-selected', String(isSelected))
    })
  }

  #updateDisabledState() {
    if (this.disabled) {
      this.setAttribute('aria-disabled', 'true')
      this.removeAttribute('tabindex')
    } else {
      this.removeAttribute('aria-disabled')
      this.setAttribute('tabindex', '0')
    }
  }

  clear() {
    this.#selected.clear()
    this.#updateSelectedState()
    this.dispatchEvent(new CustomEvent('clear', { bubbles: true }))
  }

  selectAll() {
    if (!this.multiple) return
    this.querySelectorAll('ytz-option:not([disabled])').forEach(opt => {
      const value = opt.getAttribute('value') || opt.textContent?.trim()
      if (value) this.#selected.add(value)
    })
    this.#updateSelectedState()
  }
}

customElements.define('ytz-listbox', YtzListbox)

export { YtzListbox }
