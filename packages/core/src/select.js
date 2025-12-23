/**
 * ytz-select - Dropdown select with trigger button and listbox.
 * @module @grimoire/yetzirah-core/select
 */
import { position } from './utils/position.js'
import { createKeyNav } from './utils/key-nav.js'
import { register } from './utils/register.js'

let selectId = 0

class YtzSelect extends HTMLElement {
  static observedAttributes = ['open', 'multiple', 'disabled', 'placeholder']
  #trigger = null
  #listbox = null
  #keyNav = null
  #selected = new Set()
  #id = null
  #customTrigger = false

  connectedCallback() {
    this.#setup()
    if (this.hasAttribute('open')) this.#show()
    if (this.disabled) this.#updateDisabledState()
  }
  disconnectedCallback() { this.#cleanup() }

  attributeChangedCallback(name, oldVal, newVal) {
    if (!this.isConnected) return
    if (name === 'open') newVal !== null ? this.#show() : this.#hide()
    if (name === 'multiple') this.#listbox?.setAttribute('aria-multiselectable', newVal !== null ? 'true' : 'false')
    if (name === 'disabled') this.#updateDisabledState()
  }

  get open() { return this.hasAttribute('open') }
  set open(v) { v ? this.setAttribute('open', '') : this.removeAttribute('open') }
  get multiple() { return this.hasAttribute('multiple') }
  set multiple(v) { v ? this.setAttribute('multiple', '') : this.removeAttribute('multiple') }
  get disabled() { return this.hasAttribute('disabled') }
  set disabled(v) { v ? this.setAttribute('disabled', '') : this.removeAttribute('disabled') }
  get placeholder() { return this.getAttribute('placeholder') || 'Select...' }
  set placeholder(v) { this.setAttribute('placeholder', v) }

  get value() { return this.multiple ? [...this.#selected] : ([...this.#selected][0] || '') }
  set value(v) {
    this.#selected.clear()
    if (Array.isArray(v)) v.forEach(val => this.#selected.add(val))
    else if (v) this.#selected.add(v)
    this.#updateSelectedState()
    this.#updateTriggerText()
  }

  get options() { return [...this.querySelectorAll('ytz-option')] }
  get selectedOptions() { return [...this.querySelectorAll('ytz-option[selected]')] }

  #setup() {
    this.#id = `ytz-select-${++selectId}`
    if (!this.id) this.id = this.#id
    this.#trigger = this.querySelector('[slot="trigger"]')
    this.#customTrigger = !!this.#trigger
    if (!this.#trigger) {
      this.#trigger = document.createElement('button')
      this.#trigger.setAttribute('slot', 'trigger')
      this.#trigger.className = this.getAttribute('trigger-class') || ''
      this.prepend(this.#trigger)
    }
    this.#listbox = document.createElement('div')
    this.#listbox.id = `${this.#id}-listbox`
    this.#listbox.setAttribute('role', 'listbox')
    this.#listbox.hidden = true
    if (this.multiple) this.#listbox.setAttribute('aria-multiselectable', 'true')
    this.querySelectorAll('ytz-option').forEach(opt => this.#listbox.appendChild(opt))
    this.appendChild(this.#listbox)
    this.#trigger.setAttribute('aria-haspopup', 'listbox')
    this.#trigger.setAttribute('aria-expanded', 'false')
    this.#trigger.setAttribute('aria-controls', this.#listbox.id)
    this.#keyNav = createKeyNav(
      () => [...this.#listbox.querySelectorAll('ytz-option:not([disabled])')],
      { orientation: 'vertical', wrap: true, autoActivate: false }
    )
    this.querySelectorAll('ytz-option[selected]').forEach(opt => {
      const val = opt.getAttribute('value') || opt.textContent?.trim()
      if (val) this.#selected.add(val)
    })
    this.#updateSelectedState()
    if (!this.#customTrigger) this.#updateTriggerText()
    this.#trigger.addEventListener('click', this.#handleTriggerClick)
    this.#trigger.addEventListener('keydown', this.#handleTriggerKeyDown)
    this.#listbox.addEventListener('keydown', this.#handleListboxKeyDown)
    this.addEventListener('option-click', this.#handleOptionClick)
  }

  #cleanup() {
    this.#trigger?.removeEventListener('click', this.#handleTriggerClick)
    this.#trigger?.removeEventListener('keydown', this.#handleTriggerKeyDown)
    this.#listbox?.removeEventListener('keydown', this.#handleListboxKeyDown)
    this.removeEventListener('option-click', this.#handleOptionClick)
    document.removeEventListener('click', this.#handleOutsideClick)
    document.removeEventListener('keydown', this.#handleEscape)
  }

  #handleTriggerClick = (e) => { if (this.disabled) return; e.stopPropagation(); this.open = !this.open }
  #handleTriggerKeyDown = (e) => {
    if (this.disabled) return
    if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) { e.preventDefault(); this.open = true }
  }

  #handleListboxKeyDown = (e) => {
    this.#keyNav?.handleKeyDown(e)
    if (e.key === 'Enter' || e.key === ' ') {
      const focused = this.#listbox.querySelector('ytz-option:focus')
      if (focused && !focused.hasAttribute('disabled')) { e.preventDefault(); this.#selectOption(focused) }
    }
    if (e.key === 'Tab') { e.preventDefault(); this.open = false; this.#trigger?.focus() }
  }

  #handleOptionClick = (e) => {
    if (this.disabled) return
    const option = e.detail?.option
    if (option && !option.hasAttribute('disabled')) this.#selectOption(option)
  }

  #handleOutsideClick = (e) => { if (!this.contains(e.target)) this.open = false }
  #handleEscape = (e) => { if (e.key === 'Escape' && this.open) { e.preventDefault(); this.open = false; this.#trigger?.focus() } }

  #selectOption(option) {
    const value = option.getAttribute('value') || option.textContent?.trim()
    if (!value) return
    if (this.multiple) {
      this.#selected.has(value) ? this.#selected.delete(value) : this.#selected.add(value)
    } else {
      this.#selected.clear()
      this.#selected.add(value)
      this.open = false
      this.#trigger?.focus()
    }
    this.#updateSelectedState()
    if (!this.#customTrigger) this.#updateTriggerText()
    this.dispatchEvent(new CustomEvent('change', { bubbles: true, detail: { value: this.value, option } }))
  }

  #updateSelectedState() {
    this.querySelectorAll('ytz-option').forEach(opt => {
      const val = opt.getAttribute('value') || opt.textContent?.trim()
      const isSelected = this.#selected.has(val)
      opt.toggleAttribute('selected', isSelected)
      opt.setAttribute('aria-selected', String(isSelected))
    })
  }

  #updateTriggerText() {
    if (!this.#trigger || this.#customTrigger) return
    const selected = this.selectedOptions
    if (selected.length === 0) this.#trigger.textContent = this.placeholder
    else if (this.multiple) this.#trigger.textContent = selected.map(o => o.textContent?.trim()).join(', ')
    else this.#trigger.textContent = selected[0]?.textContent?.trim() || this.placeholder
  }

  #updateDisabledState() {
    if (this.disabled) { this.#trigger?.setAttribute('disabled', ''); this.#trigger?.setAttribute('aria-disabled', 'true') }
    else { this.#trigger?.removeAttribute('disabled'); this.#trigger?.removeAttribute('aria-disabled') }
  }

  #show() {
    if (!this.#listbox || this.disabled) return
    this.#trigger?.setAttribute('aria-expanded', 'true')
    this.#listbox.hidden = false
    this.#updatePosition()
    setTimeout(() => document.addEventListener('click', this.#handleOutsideClick), 0)
    document.addEventListener('keydown', this.#handleEscape)
    requestAnimationFrame(() => {
      const selected = this.#listbox.querySelector('ytz-option[selected]:not([disabled])')
      const first = this.#listbox.querySelector('ytz-option:not([disabled])')
      ;(selected || first)?.focus()
    })
    this.dispatchEvent(new CustomEvent('open', { bubbles: true }))
  }

  #hide() {
    if (!this.#listbox) return
    this.#trigger?.setAttribute('aria-expanded', 'false')
    this.#listbox.hidden = true
    document.removeEventListener('click', this.#handleOutsideClick)
    document.removeEventListener('keydown', this.#handleEscape)
    this.dispatchEvent(new CustomEvent('close', { bubbles: true }))
  }

  #updatePosition = () => {
    if (!this.#trigger || !this.#listbox) return
    const { x, y, placement } = position(this.#trigger, this.#listbox, { placement: 'bottom', offset: 4 })
    this.#listbox.style.position = 'fixed'
    this.#listbox.style.left = `${x}px`
    this.#listbox.style.top = `${y}px`
    this.#listbox.style.minWidth = `${this.#trigger.offsetWidth}px`
    this.#listbox.dataset.placement = placement
  }

  show() { this.open = true }
  hide() { this.open = false }
  toggle() { this.open = !this.open }
  clear() {
    this.#selected.clear()
    this.#updateSelectedState()
    if (!this.#customTrigger) this.#updateTriggerText()
    this.dispatchEvent(new CustomEvent('clear', { bubbles: true }))
  }
}

register('ytz-select', YtzSelect)
export { YtzSelect }
