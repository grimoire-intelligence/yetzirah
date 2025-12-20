/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals'
import './toggle.js'

describe('YtzToggle', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  describe('rendering', () => {
    test('renders with role="switch"', () => {
      document.body.innerHTML = '<ytz-toggle>Toggle me</ytz-toggle>'
      const toggle = document.querySelector('ytz-toggle')

      expect(toggle.getAttribute('role')).toBe('switch')
    })

    test('is focusable by default', () => {
      document.body.innerHTML = '<ytz-toggle>Toggle me</ytz-toggle>'
      const toggle = document.querySelector('ytz-toggle')

      expect(toggle.getAttribute('tabindex')).toBe('0')
    })

    test('preserves custom tabindex', () => {
      document.body.innerHTML = '<ytz-toggle tabindex="-1">Toggle me</ytz-toggle>'
      const toggle = document.querySelector('ytz-toggle')

      expect(toggle.getAttribute('tabindex')).toBe('-1')
    })
  })

  describe('checked state', () => {
    test('defaults to unchecked', () => {
      document.body.innerHTML = '<ytz-toggle>Toggle</ytz-toggle>'
      const toggle = document.querySelector('ytz-toggle')

      expect(toggle.checked).toBe(false)
      expect(toggle.getAttribute('aria-checked')).toBe('false')
    })

    test('respects checked attribute', () => {
      document.body.innerHTML = '<ytz-toggle checked>Toggle</ytz-toggle>'
      const toggle = document.querySelector('ytz-toggle')

      expect(toggle.checked).toBe(true)
      expect(toggle.getAttribute('aria-checked')).toBe('true')
    })

    test('toggles on click', () => {
      document.body.innerHTML = '<ytz-toggle>Toggle</ytz-toggle>'
      const toggle = document.querySelector('ytz-toggle')

      toggle.click()
      expect(toggle.checked).toBe(true)
      expect(toggle.getAttribute('aria-checked')).toBe('true')

      toggle.click()
      expect(toggle.checked).toBe(false)
      expect(toggle.getAttribute('aria-checked')).toBe('false')
    })

    test('dispatches change event on toggle', () => {
      document.body.innerHTML = '<ytz-toggle>Toggle</ytz-toggle>'
      const toggle = document.querySelector('ytz-toggle')
      const handler = jest.fn()

      toggle.addEventListener('change', handler)
      toggle.click()

      expect(handler).toHaveBeenCalledTimes(1)
      expect(handler.mock.calls[0][0].detail.checked).toBe(true)
    })

    test('can set checked property', () => {
      document.body.innerHTML = '<ytz-toggle>Toggle</ytz-toggle>'
      const toggle = document.querySelector('ytz-toggle')

      toggle.checked = true
      expect(toggle.hasAttribute('checked')).toBe(true)
      expect(toggle.getAttribute('aria-checked')).toBe('true')

      toggle.checked = false
      expect(toggle.hasAttribute('checked')).toBe(false)
      expect(toggle.getAttribute('aria-checked')).toBe('false')
    })
  })

  describe('disabled state', () => {
    test('defaults to enabled', () => {
      document.body.innerHTML = '<ytz-toggle>Toggle</ytz-toggle>'
      const toggle = document.querySelector('ytz-toggle')

      expect(toggle.disabled).toBe(false)
      expect(toggle.getAttribute('aria-disabled')).toBe('false')
    })

    test('respects disabled attribute', () => {
      document.body.innerHTML = '<ytz-toggle disabled>Toggle</ytz-toggle>'
      const toggle = document.querySelector('ytz-toggle')

      expect(toggle.disabled).toBe(true)
      expect(toggle.getAttribute('aria-disabled')).toBe('true')
    })

    test('ignores click when disabled', () => {
      document.body.innerHTML = '<ytz-toggle disabled>Toggle</ytz-toggle>'
      const toggle = document.querySelector('ytz-toggle')
      const handler = jest.fn()

      toggle.addEventListener('change', handler)
      toggle.click()

      expect(toggle.checked).toBe(false)
      expect(handler).not.toHaveBeenCalled()
    })

    test('can set disabled property', () => {
      document.body.innerHTML = '<ytz-toggle>Toggle</ytz-toggle>'
      const toggle = document.querySelector('ytz-toggle')

      toggle.disabled = true
      expect(toggle.hasAttribute('disabled')).toBe(true)
      expect(toggle.getAttribute('aria-disabled')).toBe('true')

      toggle.disabled = false
      expect(toggle.hasAttribute('disabled')).toBe(false)
      expect(toggle.getAttribute('aria-disabled')).toBe('false')
    })
  })

  describe('keyboard interaction', () => {
    test('toggles on Space key', () => {
      document.body.innerHTML = '<ytz-toggle>Toggle</ytz-toggle>'
      const toggle = document.querySelector('ytz-toggle')

      toggle.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }))
      expect(toggle.checked).toBe(true)

      toggle.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }))
      expect(toggle.checked).toBe(false)
    })

    test('toggles on Enter key', () => {
      document.body.innerHTML = '<ytz-toggle>Toggle</ytz-toggle>'
      const toggle = document.querySelector('ytz-toggle')

      toggle.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
      expect(toggle.checked).toBe(true)
    })

    test('ignores keyboard when disabled', () => {
      document.body.innerHTML = '<ytz-toggle disabled>Toggle</ytz-toggle>'
      const toggle = document.querySelector('ytz-toggle')

      toggle.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }))
      expect(toggle.checked).toBe(false)
    })
  })

  describe('toggle() method', () => {
    test('toggle() changes state', () => {
      document.body.innerHTML = '<ytz-toggle>Toggle</ytz-toggle>'
      const toggle = document.querySelector('ytz-toggle')

      toggle.toggle()
      expect(toggle.checked).toBe(true)

      toggle.toggle()
      expect(toggle.checked).toBe(false)
    })
  })
})
