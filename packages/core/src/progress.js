/**
 * ytz-progress - Progress indicator Web Component.
 * Supports both indeterminate (spinner) and determinate (progress bar) modes,
 * with circular and linear visual variants.
 *
 * @module @grimoire/yetzirah-core/progress
 * @example
 * // Indeterminate circular spinner (default)
 * <ytz-progress></ytz-progress>
 *
 * @example
 * // Determinate circular progress
 * <ytz-progress value="75"></ytz-progress>
 *
 * @example
 * // Linear progress bar
 * <ytz-progress linear value="50"></ytz-progress>
 *
 * @example
 * // Indeterminate linear (loading bar)
 * <ytz-progress linear></ytz-progress>
 */

import { register } from './utils/register.js'

/** SVG circle properties for circular spinner */
const CIRCLE_SIZE = 44
const CIRCLE_RADIUS = 20
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS

/**
 * @class YtzProgress
 * @extends HTMLElement
 */
class YtzProgress extends HTMLElement {
  static observedAttributes = ['value', 'linear', 'size', 'label']

  /** @type {SVGCircleElement|null} */
  #circleTrack = null
  /** @type {SVGCircleElement|null} */
  #circleProgress = null
  /** @type {HTMLDivElement|null} */
  #linearTrack = null
  /** @type {HTMLDivElement|null} */
  #linearBar = null

  connectedCallback() {
    this.setAttribute('role', 'progressbar')
    this.#render()
    this.#updateARIA()
  }

  disconnectedCallback() {
    // Clean up internal references
    this.#circleTrack = null
    this.#circleProgress = null
    this.#linearTrack = null
    this.#linearBar = null
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (!this.isConnected) return

    if (name === 'linear') {
      // Re-render when switching between modes
      this.#render()
    } else if (name === 'value') {
      this.#updateProgress()
    } else if (name === 'size') {
      this.#updateSize()
    }

    // Always update ARIA on attribute changes
    this.#updateARIA()
  }

  #render() {
    // Clear existing content
    this.innerHTML = ''

    if (this.linear) {
      this.#renderLinear()
    } else {
      this.#renderCircular()
    }

    this.#updateProgress()
    this.#updateSize()
  }

  #renderCircular() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('viewBox', `0 0 ${CIRCLE_SIZE} ${CIRCLE_SIZE}`)
    svg.setAttribute('class', 'ytz-progress-circular')
    svg.setAttribute('aria-hidden', 'true')

    // Track circle (background)
    this.#circleTrack = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    this.#circleTrack.setAttribute('class', 'ytz-progress-track')
    this.#circleTrack.setAttribute('cx', String(CIRCLE_SIZE / 2))
    this.#circleTrack.setAttribute('cy', String(CIRCLE_SIZE / 2))
    this.#circleTrack.setAttribute('r', String(CIRCLE_RADIUS))
    this.#circleTrack.setAttribute('fill', 'none')
    this.#circleTrack.setAttribute('stroke-width', '4')

    // Progress circle
    this.#circleProgress = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    this.#circleProgress.setAttribute('class', 'ytz-progress-indicator')
    this.#circleProgress.setAttribute('cx', String(CIRCLE_SIZE / 2))
    this.#circleProgress.setAttribute('cy', String(CIRCLE_SIZE / 2))
    this.#circleProgress.setAttribute('r', String(CIRCLE_RADIUS))
    this.#circleProgress.setAttribute('fill', 'none')
    this.#circleProgress.setAttribute('stroke-width', '4')
    this.#circleProgress.setAttribute('stroke-linecap', 'round')
    this.#circleProgress.setAttribute('stroke-dasharray', String(CIRCLE_CIRCUMFERENCE))

    svg.appendChild(this.#circleTrack)
    svg.appendChild(this.#circleProgress)
    this.appendChild(svg)
  }

  #renderLinear() {
    this.#linearTrack = document.createElement('div')
    this.#linearTrack.className = 'ytz-progress-track'
    this.#linearTrack.setAttribute('aria-hidden', 'true')

    this.#linearBar = document.createElement('div')
    this.#linearBar.className = 'ytz-progress-indicator'

    this.#linearTrack.appendChild(this.#linearBar)
    this.appendChild(this.#linearTrack)
  }

  #updateProgress() {
    const value = this.value
    const isIndeterminate = value === null

    // Set data attribute for CSS styling
    if (isIndeterminate) {
      this.setAttribute('data-indeterminate', '')
    } else {
      this.removeAttribute('data-indeterminate')
    }

    // Update the visual representation
    if (this.linear) {
      if (this.#linearBar) {
        if (isIndeterminate) {
          this.#linearBar.style.width = ''
        } else {
          this.#linearBar.style.width = `${value}%`
        }
      }
    } else {
      if (this.#circleProgress) {
        if (isIndeterminate) {
          // Indeterminate: partial circle that rotates
          this.#circleProgress.style.strokeDashoffset = String(CIRCLE_CIRCUMFERENCE * 0.75)
        } else {
          // Determinate: show progress as arc
          const offset = CIRCLE_CIRCUMFERENCE * (1 - value / 100)
          this.#circleProgress.style.strokeDashoffset = String(offset)
        }
      }
    }

    // Update CSS custom property for advanced styling
    this.style.setProperty('--progress-percent', value !== null ? String(value) : '0')
  }

  #updateSize() {
    // Size is handled via CSS using data-size attribute
    const size = this.getAttribute('size')
    if (size && ['small', 'medium', 'large'].includes(size)) {
      this.setAttribute('data-size', size)
    } else {
      this.setAttribute('data-size', 'medium')
    }
  }

  #updateARIA() {
    const value = this.value
    const label = this.getAttribute('label')

    if (value === null) {
      // Indeterminate: remove value attributes per WAI-ARIA spec
      this.removeAttribute('aria-valuenow')
      this.removeAttribute('aria-valuemin')
      this.removeAttribute('aria-valuemax')
    } else {
      // Determinate: set value attributes
      this.setAttribute('aria-valuenow', String(value))
      this.setAttribute('aria-valuemin', '0')
      this.setAttribute('aria-valuemax', '100')
    }

    // Apply label if provided
    if (label) {
      this.setAttribute('aria-label', label)
    } else {
      this.removeAttribute('aria-label')
    }
  }

  // Property getters/setters

  /**
   * Get/set the progress value (0-100). Null means indeterminate.
   * @type {number|null}
   */
  get value() {
    const attr = this.getAttribute('value')
    if (attr === null) return null
    const num = parseFloat(attr)
    if (isNaN(num)) return null
    // Clamp to 0-100
    return Math.min(100, Math.max(0, num))
  }

  set value(val) {
    if (val === null || val === undefined) {
      this.removeAttribute('value')
    } else {
      const clamped = Math.min(100, Math.max(0, Number(val)))
      this.setAttribute('value', String(clamped))
    }
  }

  /**
   * Get/set whether this is a linear progress bar.
   * @type {boolean}
   */
  get linear() {
    return this.hasAttribute('linear')
  }

  set linear(val) {
    if (val) {
      this.setAttribute('linear', '')
    } else {
      this.removeAttribute('linear')
    }
  }

  /**
   * Read-only: true if no value is set (indeterminate mode).
   * @type {boolean}
   */
  get indeterminate() {
    return this.value === null
  }

  /**
   * Get/set the size variant.
   * @type {string}
   */
  get size() {
    return this.getAttribute('size') || 'medium'
  }

  set size(val) {
    if (['small', 'medium', 'large'].includes(val)) {
      this.setAttribute('size', val)
    }
  }
}

register('ytz-progress', YtzProgress)

export { YtzProgress }
