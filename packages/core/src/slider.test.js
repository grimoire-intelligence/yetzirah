/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals'
import './slider.js'

describe('YtzSlider', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  describe('rendering', () => {
    test('renders with role="slider"', () => {
      document.body.innerHTML = '<ytz-slider></ytz-slider>'
      const slider = document.querySelector('ytz-slider')

      expect(slider.getAttribute('role')).toBe('slider')
    })

    test('is focusable by default', () => {
      document.body.innerHTML = '<ytz-slider></ytz-slider>'
      const slider = document.querySelector('ytz-slider')

      expect(slider.getAttribute('tabindex')).toBe('0')
    })

    test('creates track and thumb elements', () => {
      document.body.innerHTML = '<ytz-slider></ytz-slider>'
      const slider = document.querySelector('ytz-slider')

      expect(slider.querySelector('.ytz-slider-track')).not.toBeNull()
      expect(slider.querySelector('.ytz-slider-thumb')).not.toBeNull()
    })
  })

  describe('attributes and properties', () => {
    test('defaults to min=0, max=100, value=0, step=1', () => {
      document.body.innerHTML = '<ytz-slider></ytz-slider>'
      const slider = document.querySelector('ytz-slider')

      expect(slider.min).toBe(0)
      expect(slider.max).toBe(100)
      expect(slider.value).toBe(0)
      expect(slider.step).toBe(1)
    })

    test('respects min, max, value attributes', () => {
      document.body.innerHTML = '<ytz-slider min="10" max="200" value="50"></ytz-slider>'
      const slider = document.querySelector('ytz-slider')

      expect(slider.min).toBe(10)
      expect(slider.max).toBe(200)
      expect(slider.value).toBe(50)
    })

    test('respects step attribute', () => {
      document.body.innerHTML = '<ytz-slider step="5"></ytz-slider>'
      const slider = document.querySelector('ytz-slider')

      expect(slider.step).toBe(5)
    })

    test('clamps value to min/max', () => {
      document.body.innerHTML = '<ytz-slider min="0" max="100" value="150"></ytz-slider>'
      const slider = document.querySelector('ytz-slider')

      expect(slider.value).toBe(100)
    })

    test('property setters update attributes', () => {
      document.body.innerHTML = '<ytz-slider></ytz-slider>'
      const slider = document.querySelector('ytz-slider')

      slider.min = 5
      slider.max = 50
      slider.value = 25
      slider.step = 5

      expect(slider.getAttribute('min')).toBe('5')
      expect(slider.getAttribute('max')).toBe('50')
      expect(slider.getAttribute('value')).toBe('25')
      expect(slider.getAttribute('step')).toBe('5')
    })
  })

  describe('ARIA attributes', () => {
    test('sets aria-valuemin', () => {
      document.body.innerHTML = '<ytz-slider min="10"></ytz-slider>'
      const slider = document.querySelector('ytz-slider')

      expect(slider.getAttribute('aria-valuemin')).toBe('10')
    })

    test('sets aria-valuemax', () => {
      document.body.innerHTML = '<ytz-slider max="200"></ytz-slider>'
      const slider = document.querySelector('ytz-slider')

      expect(slider.getAttribute('aria-valuemax')).toBe('200')
    })

    test('sets aria-valuenow', () => {
      document.body.innerHTML = '<ytz-slider value="50"></ytz-slider>'
      const slider = document.querySelector('ytz-slider')

      expect(slider.getAttribute('aria-valuenow')).toBe('50')
    })

    test('updates aria-valuenow on value change', () => {
      document.body.innerHTML = '<ytz-slider value="50"></ytz-slider>'
      const slider = document.querySelector('ytz-slider')

      slider.value = 75
      expect(slider.getAttribute('aria-valuenow')).toBe('75')
    })
  })

  describe('keyboard interaction', () => {
    test('ArrowRight increases value', () => {
      document.body.innerHTML = '<ytz-slider value="50"></ytz-slider>'
      const slider = document.querySelector('ytz-slider')

      slider.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))

      expect(slider.value).toBe(51)
    })

    test('ArrowUp increases value', () => {
      document.body.innerHTML = '<ytz-slider value="50"></ytz-slider>'
      const slider = document.querySelector('ytz-slider')

      slider.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }))

      expect(slider.value).toBe(51)
    })

    test('ArrowLeft decreases value', () => {
      document.body.innerHTML = '<ytz-slider value="50"></ytz-slider>'
      const slider = document.querySelector('ytz-slider')

      slider.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }))

      expect(slider.value).toBe(49)
    })

    test('ArrowDown decreases value', () => {
      document.body.innerHTML = '<ytz-slider value="50"></ytz-slider>'
      const slider = document.querySelector('ytz-slider')

      slider.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))

      expect(slider.value).toBe(49)
    })

    test('PageUp increases by 10 steps', () => {
      document.body.innerHTML = '<ytz-slider value="50" step="1"></ytz-slider>'
      const slider = document.querySelector('ytz-slider')

      slider.dispatchEvent(new KeyboardEvent('keydown', { key: 'PageUp', bubbles: true }))

      expect(slider.value).toBe(60)
    })

    test('PageDown decreases by 10 steps', () => {
      document.body.innerHTML = '<ytz-slider value="50" step="1"></ytz-slider>'
      const slider = document.querySelector('ytz-slider')

      slider.dispatchEvent(new KeyboardEvent('keydown', { key: 'PageDown', bubbles: true }))

      expect(slider.value).toBe(40)
    })

    test('Home goes to min', () => {
      document.body.innerHTML = '<ytz-slider min="10" max="100" value="50"></ytz-slider>'
      const slider = document.querySelector('ytz-slider')

      slider.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }))

      expect(slider.value).toBe(10)
    })

    test('End goes to max', () => {
      document.body.innerHTML = '<ytz-slider min="0" max="100" value="50"></ytz-slider>'
      const slider = document.querySelector('ytz-slider')

      slider.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }))

      expect(slider.value).toBe(100)
    })

    test('respects step when using arrow keys', () => {
      document.body.innerHTML = '<ytz-slider value="50" step="5"></ytz-slider>'
      const slider = document.querySelector('ytz-slider')

      slider.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))

      expect(slider.value).toBe(55)
    })

    test('does not go below min', () => {
      document.body.innerHTML = '<ytz-slider min="0" value="0"></ytz-slider>'
      const slider = document.querySelector('ytz-slider')

      slider.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }))

      expect(slider.value).toBe(0)
    })

    test('does not go above max', () => {
      document.body.innerHTML = '<ytz-slider max="100" value="100"></ytz-slider>'
      const slider = document.querySelector('ytz-slider')

      slider.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))

      expect(slider.value).toBe(100)
    })

    test('ignores keyboard when disabled', () => {
      document.body.innerHTML = '<ytz-slider value="50" disabled></ytz-slider>'
      const slider = document.querySelector('ytz-slider')

      slider.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))

      expect(slider.value).toBe(50)
    })
  })

  describe('change event', () => {
    test('dispatches change event on keyboard interaction', () => {
      document.body.innerHTML = '<ytz-slider value="50"></ytz-slider>'
      const slider = document.querySelector('ytz-slider')
      const handler = jest.fn()

      slider.addEventListener('change', handler)
      slider.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))

      expect(handler).toHaveBeenCalledTimes(1)
      expect(handler.mock.calls[0][0].detail.value).toBe(51)
    })
  })

  describe('disabled state', () => {
    test('disabled property getter', () => {
      document.body.innerHTML = '<ytz-slider disabled></ytz-slider>'
      const slider = document.querySelector('ytz-slider')

      expect(slider.disabled).toBe(true)
    })

    test('disabled property setter', () => {
      document.body.innerHTML = '<ytz-slider></ytz-slider>'
      const slider = document.querySelector('ytz-slider')

      slider.disabled = true
      expect(slider.hasAttribute('disabled')).toBe(true)
      expect(slider.getAttribute('aria-disabled')).toBe('true')

      slider.disabled = false
      expect(slider.hasAttribute('disabled')).toBe(false)
      expect(slider.getAttribute('aria-disabled')).toBe('false')
    })
  })

  describe('thumb positioning', () => {
    test('positions thumb based on value', () => {
      document.body.innerHTML = '<ytz-slider min="0" max="100" value="50"></ytz-slider>'
      const slider = document.querySelector('ytz-slider')
      const thumb = slider.querySelector('.ytz-slider-thumb')

      expect(thumb.style.left).toBe('50%')
    })

    test('positions thumb at 0% for min value', () => {
      document.body.innerHTML = '<ytz-slider min="0" max="100" value="0"></ytz-slider>'
      const slider = document.querySelector('ytz-slider')
      const thumb = slider.querySelector('.ytz-slider-thumb')

      expect(thumb.style.left).toBe('0%')
    })

    test('positions thumb at 100% for max value', () => {
      document.body.innerHTML = '<ytz-slider min="0" max="100" value="100"></ytz-slider>'
      const slider = document.querySelector('ytz-slider')
      const thumb = slider.querySelector('.ytz-slider-thumb')

      expect(thumb.style.left).toBe('100%')
    })

    test('updates thumb position on value change', () => {
      document.body.innerHTML = '<ytz-slider min="0" max="100" value="0"></ytz-slider>'
      const slider = document.querySelector('ytz-slider')
      const thumb = slider.querySelector('.ytz-slider-thumb')

      slider.value = 75
      expect(thumb.style.left).toBe('75%')
    })
  })

  describe('CSS custom properties', () => {
    test('sets --slider-percent custom property', () => {
      document.body.innerHTML = '<ytz-slider min="0" max="100" value="50"></ytz-slider>'
      const slider = document.querySelector('ytz-slider')

      expect(slider.style.getPropertyValue('--slider-percent')).toBe('50%')
    })
  })
})
