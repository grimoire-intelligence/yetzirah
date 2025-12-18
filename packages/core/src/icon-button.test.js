/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals'
import './icon-button.js'

describe('YtzIconButton', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    jest.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    console.warn.mockRestore()
  })

  describe('rendering', () => {
    test('renders inner button element', () => {
      document.body.innerHTML = '<ytz-icon-button aria-label="Close"><span>X</span></ytz-icon-button>'
      const iconButton = document.querySelector('ytz-icon-button')
      const inner = iconButton.querySelector('button.ytz-icon-button-inner')

      expect(inner).not.toBeNull()
      expect(inner.querySelector('span').textContent).toBe('X')
    })

    test('applies default classes', () => {
      document.body.innerHTML = '<ytz-icon-button aria-label="Close"><span>X</span></ytz-icon-button>'
      const inner = document.querySelector('ytz-icon-button button')

      expect(inner.className).toContain('pointer')
      expect(inner.className).toContain('bn')
      expect(inner.className).toContain('bg-transparent')
    })

    test('preserves user classes', () => {
      document.body.innerHTML = '<ytz-icon-button aria-label="Close" class="pa2 br-100"><span>X</span></ytz-icon-button>'
      const inner = document.querySelector('ytz-icon-button button')

      expect(inner.className).toContain('pa2')
      expect(inner.className).toContain('br-100')
    })
  })

  describe('accessibility', () => {
    test('warns when aria-label missing', () => {
      document.body.innerHTML = '<ytz-icon-button><span>X</span></ytz-icon-button>'

      expect(console.warn).toHaveBeenCalledWith(
        'ytz-icon-button: aria-label is required for accessibility'
      )
    })

    test('does not warn when aria-label present', () => {
      document.body.innerHTML = '<ytz-icon-button aria-label="Close"><span>X</span></ytz-icon-button>'

      expect(console.warn).not.toHaveBeenCalled()
    })

    test('passes aria-label to inner button', () => {
      document.body.innerHTML = '<ytz-icon-button aria-label="Close"><span>X</span></ytz-icon-button>'
      const inner = document.querySelector('ytz-icon-button button')

      expect(inner.getAttribute('aria-label')).toBe('Close')
    })

    test('passes through other aria-* attributes', () => {
      document.body.innerHTML = '<ytz-icon-button aria-label="Toggle" aria-pressed="false"><span>T</span></ytz-icon-button>'
      const inner = document.querySelector('ytz-icon-button button')

      expect(inner.getAttribute('aria-pressed')).toBe('false')
    })

    test('passes through data-* attributes', () => {
      document.body.innerHTML = '<ytz-icon-button aria-label="Close" data-testid="close-btn"><span>X</span></ytz-icon-button>'
      const inner = document.querySelector('ytz-icon-button button')

      expect(inner.getAttribute('data-testid')).toBe('close-btn')
    })
  })

  describe('disabled state', () => {
    test('disabled property getter', () => {
      document.body.innerHTML = '<ytz-icon-button aria-label="Close" disabled><span>X</span></ytz-icon-button>'
      const iconButton = document.querySelector('ytz-icon-button')

      expect(iconButton.disabled).toBe(true)
    })

    test('disabled property setter', () => {
      document.body.innerHTML = '<ytz-icon-button aria-label="Close"><span>X</span></ytz-icon-button>'
      const iconButton = document.querySelector('ytz-icon-button')

      iconButton.disabled = true
      expect(iconButton.hasAttribute('disabled')).toBe(true)
      expect(iconButton.querySelector('button').disabled).toBe(true)

      iconButton.disabled = false
      expect(iconButton.hasAttribute('disabled')).toBe(false)
      expect(iconButton.querySelector('button').disabled).toBe(false)
    })

    test('inner button reflects disabled state', () => {
      document.body.innerHTML = '<ytz-icon-button aria-label="Close" disabled><span>X</span></ytz-icon-button>'
      const inner = document.querySelector('ytz-icon-button button')

      expect(inner.disabled).toBe(true)
    })
  })

  describe('tooltip', () => {
    test('shows tooltip on mouseenter when tooltip attribute present', () => {
      document.body.innerHTML = '<ytz-icon-button aria-label="Settings" tooltip><span>S</span></ytz-icon-button>'
      const iconButton = document.querySelector('ytz-icon-button')

      iconButton.dispatchEvent(new MouseEvent('mouseenter'))

      const tooltip = document.querySelector('.ytz-icon-button-tooltip')
      expect(tooltip).not.toBeNull()
      expect(tooltip.textContent).toBe('Settings')
      expect(tooltip.getAttribute('role')).toBe('tooltip')
    })

    test('hides tooltip on mouseleave', () => {
      document.body.innerHTML = '<ytz-icon-button aria-label="Settings" tooltip><span>S</span></ytz-icon-button>'
      const iconButton = document.querySelector('ytz-icon-button')

      iconButton.dispatchEvent(new MouseEvent('mouseenter'))
      expect(document.querySelector('.ytz-icon-button-tooltip')).not.toBeNull()

      iconButton.dispatchEvent(new MouseEvent('mouseleave'))
      expect(document.querySelector('.ytz-icon-button-tooltip')).toBeNull()
    })

    test('shows tooltip on focus', () => {
      document.body.innerHTML = '<ytz-icon-button aria-label="Settings" tooltip><span>S</span></ytz-icon-button>'
      const iconButton = document.querySelector('ytz-icon-button')

      iconButton.dispatchEvent(new FocusEvent('focus'))

      const tooltip = document.querySelector('.ytz-icon-button-tooltip')
      expect(tooltip).not.toBeNull()
    })

    test('hides tooltip on blur', () => {
      document.body.innerHTML = '<ytz-icon-button aria-label="Settings" tooltip><span>S</span></ytz-icon-button>'
      const iconButton = document.querySelector('ytz-icon-button')

      iconButton.dispatchEvent(new FocusEvent('focus'))
      iconButton.dispatchEvent(new FocusEvent('blur'))

      expect(document.querySelector('.ytz-icon-button-tooltip')).toBeNull()
    })

    test('no tooltip without tooltip attribute', () => {
      document.body.innerHTML = '<ytz-icon-button aria-label="Settings"><span>S</span></ytz-icon-button>'
      const iconButton = document.querySelector('ytz-icon-button')

      iconButton.dispatchEvent(new MouseEvent('mouseenter'))

      expect(document.querySelector('.ytz-icon-button-tooltip')).toBeNull()
    })
  })

  describe('click handling', () => {
    test('inner button responds to clicks', () => {
      document.body.innerHTML = '<ytz-icon-button aria-label="Close"><span>X</span></ytz-icon-button>'
      const inner = document.querySelector('ytz-icon-button button')
      const handler = jest.fn()

      inner.addEventListener('click', handler)
      inner.click()

      expect(handler).toHaveBeenCalledTimes(1)
    })
  })

  describe('dynamic updates', () => {
    test('re-renders when aria-label changes', () => {
      document.body.innerHTML = '<ytz-icon-button aria-label="Close"><span>X</span></ytz-icon-button>'
      const iconButton = document.querySelector('ytz-icon-button')

      iconButton.setAttribute('aria-label', 'Delete')

      expect(iconButton.querySelector('button').getAttribute('aria-label')).toBe('Delete')
    })
  })
})
