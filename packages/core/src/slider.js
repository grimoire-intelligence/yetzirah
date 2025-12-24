/**
 * ytz-slider - Slider/Range Web Component.
 * An accessible slider with keyboard control and optional range support.
 *
 * @module @grimoire/yetzirah-core/slider
 * @example
 * <ytz-slider min="0" max="100" value="50"></ytz-slider>
 *
 * @example
 * // With step
 * <ytz-slider min="0" max="100" value="50" step="10"></ytz-slider>
 *
 * @example
 * // Disabled
 * <ytz-slider min="0" max="100" value="50" disabled></ytz-slider>
 */

import { register } from './utils/register.js'

/**
 * @class YtzSlider
 * @extends HTMLElement
 */
class YtzSlider extends HTMLElement {
  static observedAttributes = ['min', 'max', 'value', 'step', 'disabled']

  /** @type {HTMLDivElement|null} */
  #track = null
  /** @type {HTMLDivElement|null} */
  #thumb = null
  /** @type {boolean} */
  #dragging = false

  connectedCallback() {
    this.#setup()
    this.#updateDisplay()
  }

  disconnectedCallback() {
    this.removeEventListener('keydown', this.#handleKeydown)
    this.#thumb?.removeEventListener('mousedown', this.#handleMouseDown)
    document.removeEventListener('mousemove', this.#handleMouseMove)
    document.removeEventListener('mouseup', this.#handleMouseUp)
    this.#thumb?.removeEventListener('touchstart', this.#handleTouchStart)
    document.removeEventListener('touchmove', this.#handleTouchMove)
    document.removeEventListener('touchend', this.#handleTouchEnd)
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (this.isConnected && oldVal !== newVal) {
      this.#updateDisplay()
    }
  }

  #setup() {
    // Set up ARIA
    this.setAttribute('role', 'slider')
    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '0')
    }

    // Create track and thumb if not present
    if (!this.#track) {
      this.#track = document.createElement('div')
      this.#track.className = 'ytz-slider-track'
      this.appendChild(this.#track)
    }

    if (!this.#thumb) {
      this.#thumb = document.createElement('div')
      this.#thumb.className = 'ytz-slider-thumb'
      this.appendChild(this.#thumb)
    }

    // Event listeners
    this.addEventListener('keydown', this.#handleKeydown)
    this.#thumb.addEventListener('mousedown', this.#handleMouseDown)
    this.#thumb.addEventListener('touchstart', this.#handleTouchStart, { passive: false })
    this.addEventListener('click', this.#handleTrackClick)
  }

  #handleKeydown = (e) => {
    if (this.disabled) return

    const step = this.step
    const bigStep = step * 10
    let newValue = this.value

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        e.preventDefault()
        newValue = Math.min(this.max, this.value + step)
        break
      case 'ArrowLeft':
      case 'ArrowDown':
        e.preventDefault()
        newValue = Math.max(this.min, this.value - step)
        break
      case 'PageUp':
        e.preventDefault()
        newValue = Math.min(this.max, this.value + bigStep)
        break
      case 'PageDown':
        e.preventDefault()
        newValue = Math.max(this.min, this.value - bigStep)
        break
      case 'Home':
        e.preventDefault()
        newValue = this.min
        break
      case 'End':
        e.preventDefault()
        newValue = this.max
        break
      default:
        return
    }

    if (newValue !== this.value) {
      this.value = newValue
      this.#dispatchChange()
    }
  }

  #handleMouseDown = (e) => {
    if (this.disabled) return
    e.preventDefault()
    this.#dragging = true
    document.addEventListener('mousemove', this.#handleMouseMove)
    document.addEventListener('mouseup', this.#handleMouseUp)
  }

  #handleMouseMove = (e) => {
    if (!this.#dragging) return
    this.#updateValueFromPointer(e.clientX)
  }

  #handleMouseUp = () => {
    if (this.#dragging) {
      this.#dragging = false
      document.removeEventListener('mousemove', this.#handleMouseMove)
      document.removeEventListener('mouseup', this.#handleMouseUp)
      this.#dispatchChange()
    }
  }

  #handleTouchStart = (e) => {
    if (this.disabled) return
    e.preventDefault()
    this.#dragging = true
    document.addEventListener('touchmove', this.#handleTouchMove, { passive: false })
    document.addEventListener('touchend', this.#handleTouchEnd)
  }

  #handleTouchMove = (e) => {
    if (!this.#dragging) return
    e.preventDefault()
    const touch = e.touches[0]
    this.#updateValueFromPointer(touch.clientX)
  }

  #handleTouchEnd = () => {
    if (this.#dragging) {
      this.#dragging = false
      document.removeEventListener('touchmove', this.#handleTouchMove)
      document.removeEventListener('touchend', this.#handleTouchEnd)
      this.#dispatchChange()
    }
  }

  #handleTrackClick = (e) => {
    if (this.disabled) return
    if (e.target === this.#thumb) return
    this.#updateValueFromPointer(e.clientX)
    this.#dispatchChange()
  }

  #updateValueFromPointer(clientX) {
    const rect = this.getBoundingClientRect()
    const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    const range = this.max - this.min
    let newValue = this.min + percent * range

    // Snap to step
    const step = this.step
    newValue = Math.round(newValue / step) * step
    newValue = Math.max(this.min, Math.min(this.max, newValue))

    this.value = newValue
  }

  #updateDisplay() {
    const percent = ((this.value - this.min) / (this.max - this.min)) * 100

    // Update ARIA attributes
    this.setAttribute('aria-valuemin', String(this.min))
    this.setAttribute('aria-valuemax', String(this.max))
    this.setAttribute('aria-valuenow', String(this.value))
    this.setAttribute('aria-disabled', String(this.disabled))

    // Position thumb
    if (this.#thumb) {
      this.#thumb.style.left = `${percent}%`
    }

    // Update track fill (via CSS custom property)
    this.style.setProperty('--slider-percent', `${percent}%`)
  }

  #dispatchChange() {
    this.dispatchEvent(new CustomEvent('change', {
      bubbles: true,
      detail: { value: this.value }
    }))
  }

  // Property getters/setters
  get min() {
    return parseFloat(this.getAttribute('min')) || 0
  }

  set min(val) {
    this.setAttribute('min', String(val))
  }

  get max() {
    return parseFloat(this.getAttribute('max')) || 100
  }

  set max(val) {
    this.setAttribute('max', String(val))
  }

  get value() {
    const val = parseFloat(this.getAttribute('value'))
    if (isNaN(val)) return this.min
    return Math.max(this.min, Math.min(this.max, val))
  }

  set value(val) {
    const num = Math.max(this.min, Math.min(this.max, parseFloat(val) || 0))
    this.setAttribute('value', String(num))
  }

  get step() {
    return parseFloat(this.getAttribute('step')) || 1
  }

  set step(val) {
    this.setAttribute('step', String(val))
  }

  get disabled() {
    return this.hasAttribute('disabled')
  }

  set disabled(val) {
    if (val) {
      this.setAttribute('disabled', '')
    } else {
      this.removeAttribute('disabled')
    }
  }
}

register('ytz-slider', YtzSlider)

export { YtzSlider }
