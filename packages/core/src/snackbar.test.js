/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals'
import './snackbar.js'

describe('YtzSnackbar', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('rendering', () => {
    test('renders hidden by default', () => {
      document.body.innerHTML = '<ytz-snackbar>Message</ytz-snackbar>'
      const snackbar = document.querySelector('ytz-snackbar')

      expect(snackbar.hidden).toBe(true)
    })

    test('renders visible when open attribute is present', () => {
      document.body.innerHTML = '<ytz-snackbar open>Message</ytz-snackbar>'
      const snackbar = document.querySelector('ytz-snackbar')

      expect(snackbar.hidden).toBe(false)
    })

    test('has correct ARIA attributes', () => {
      document.body.innerHTML = '<ytz-snackbar>Message</ytz-snackbar>'
      const snackbar = document.querySelector('ytz-snackbar')

      expect(snackbar.getAttribute('role')).toBe('status')
      expect(snackbar.getAttribute('aria-live')).toBe('polite')
      expect(snackbar.getAttribute('aria-atomic')).toBe('true')
    })

    test('renders close button when dismissible', () => {
      document.body.innerHTML = '<ytz-snackbar dismissible>Message</ytz-snackbar>'
      const snackbar = document.querySelector('ytz-snackbar')
      const closeBtn = snackbar.querySelector('.ytz-snackbar-close')

      expect(closeBtn).not.toBeNull()
      expect(closeBtn.getAttribute('aria-label')).toBe('Dismiss')
    })

    test('does not render close button by default', () => {
      document.body.innerHTML = '<ytz-snackbar>Message</ytz-snackbar>'
      const snackbar = document.querySelector('ytz-snackbar')
      const closeBtn = snackbar.querySelector('.ytz-snackbar-close')

      expect(closeBtn).toBeNull()
    })
  })

  describe('open/close behavior', () => {
    test('shows snackbar when open attribute is added', () => {
      document.body.innerHTML = '<ytz-snackbar>Message</ytz-snackbar>'
      const snackbar = document.querySelector('ytz-snackbar')

      expect(snackbar.hidden).toBe(true)
      snackbar.setAttribute('open', '')
      expect(snackbar.hidden).toBe(false)
    })

    test('hides snackbar when open attribute is removed', () => {
      document.body.innerHTML = '<ytz-snackbar open>Message</ytz-snackbar>'
      const snackbar = document.querySelector('ytz-snackbar')

      expect(snackbar.hidden).toBe(false)
      snackbar.removeAttribute('open')
      expect(snackbar.hidden).toBe(true)
    })

    test('dispatches dismiss event on close', () => {
      document.body.innerHTML = '<ytz-snackbar open>Message</ytz-snackbar>'
      const snackbar = document.querySelector('ytz-snackbar')
      const handler = jest.fn()

      snackbar.addEventListener('dismiss', handler)
      snackbar.removeAttribute('open')

      expect(handler).toHaveBeenCalledTimes(1)
      expect(handler.mock.calls[0][0].detail.reason).toBe('manual')
    })

    test('show() method opens snackbar', () => {
      document.body.innerHTML = '<ytz-snackbar>Message</ytz-snackbar>'
      const snackbar = document.querySelector('ytz-snackbar')

      snackbar.show()

      expect(snackbar.hasAttribute('open')).toBe(true)
      expect(snackbar.hidden).toBe(false)
    })

    test('show() method with message updates content', () => {
      document.body.innerHTML = '<ytz-snackbar>Original</ytz-snackbar>'
      const snackbar = document.querySelector('ytz-snackbar')

      snackbar.show('New message')

      expect(snackbar.textContent).toContain('New message')
    })

    test('dismiss() method closes snackbar', () => {
      document.body.innerHTML = '<ytz-snackbar open>Message</ytz-snackbar>'
      const snackbar = document.querySelector('ytz-snackbar')

      snackbar.dismiss()

      expect(snackbar.hasAttribute('open')).toBe(false)
      expect(snackbar.hidden).toBe(true)
    })
  })

  describe('auto-dismiss', () => {
    test('auto-dismisses after default duration (5000ms)', () => {
      document.body.innerHTML = '<ytz-snackbar open>Message</ytz-snackbar>'
      const snackbar = document.querySelector('ytz-snackbar')
      const handler = jest.fn()

      snackbar.addEventListener('dismiss', handler)

      jest.advanceTimersByTime(4999)
      expect(handler).not.toHaveBeenCalled()

      jest.advanceTimersByTime(1)
      expect(handler).toHaveBeenCalledTimes(1)
      expect(handler.mock.calls[0][0].detail.reason).toBe('timeout')
    })

    test('auto-dismisses after custom duration', () => {
      document.body.innerHTML = '<ytz-snackbar open duration="2000">Message</ytz-snackbar>'
      const snackbar = document.querySelector('ytz-snackbar')
      const handler = jest.fn()

      snackbar.addEventListener('dismiss', handler)

      jest.advanceTimersByTime(1999)
      expect(handler).not.toHaveBeenCalled()

      jest.advanceTimersByTime(1)
      expect(handler).toHaveBeenCalledTimes(1)
    })

    test('duration="0" disables auto-dismiss', () => {
      document.body.innerHTML = '<ytz-snackbar open duration="0">Message</ytz-snackbar>'
      const snackbar = document.querySelector('ytz-snackbar')
      const handler = jest.fn()

      snackbar.addEventListener('dismiss', handler)

      jest.advanceTimersByTime(10000)
      expect(handler).not.toHaveBeenCalled()
    })
  })

  describe('position', () => {
    test('defaults to bottom-center', () => {
      document.body.innerHTML = '<ytz-snackbar>Message</ytz-snackbar>'
      const snackbar = document.querySelector('ytz-snackbar')

      expect(snackbar.position).toBe('bottom-center')
    })

    test('accepts valid position values', () => {
      const positions = ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right']

      for (const pos of positions) {
        document.body.innerHTML = `<ytz-snackbar position="${pos}">Message</ytz-snackbar>`
        const snackbar = document.querySelector('ytz-snackbar')

        expect(snackbar.position).toBe(pos)
      }
    })

    test('falls back to bottom-center for invalid position', () => {
      document.body.innerHTML = '<ytz-snackbar position="invalid">Message</ytz-snackbar>'
      const snackbar = document.querySelector('ytz-snackbar')

      expect(snackbar.position).toBe('bottom-center')
    })
  })

  describe('dismissible close button', () => {
    test('clicking close button dismisses snackbar', () => {
      document.body.innerHTML = '<ytz-snackbar open dismissible>Message</ytz-snackbar>'
      const snackbar = document.querySelector('ytz-snackbar')
      const closeBtn = snackbar.querySelector('.ytz-snackbar-close')

      closeBtn.click()

      expect(snackbar.hasAttribute('open')).toBe(false)
    })

    test('adding dismissible attribute adds close button', () => {
      document.body.innerHTML = '<ytz-snackbar>Message</ytz-snackbar>'
      const snackbar = document.querySelector('ytz-snackbar')

      expect(snackbar.querySelector('.ytz-snackbar-close')).toBeNull()

      snackbar.setAttribute('dismissible', '')

      expect(snackbar.querySelector('.ytz-snackbar-close')).not.toBeNull()
    })

    test('removing dismissible attribute removes close button', () => {
      document.body.innerHTML = '<ytz-snackbar dismissible>Message</ytz-snackbar>'
      const snackbar = document.querySelector('ytz-snackbar')

      expect(snackbar.querySelector('.ytz-snackbar-close')).not.toBeNull()

      snackbar.removeAttribute('dismissible')

      expect(snackbar.querySelector('.ytz-snackbar-close')).toBeNull()
    })
  })

  describe('property getters/setters', () => {
    test('open property', () => {
      document.body.innerHTML = '<ytz-snackbar>Message</ytz-snackbar>'
      const snackbar = document.querySelector('ytz-snackbar')

      expect(snackbar.open).toBe(false)

      snackbar.open = true
      expect(snackbar.hasAttribute('open')).toBe(true)

      snackbar.open = false
      expect(snackbar.hasAttribute('open')).toBe(false)
    })

    test('duration property', () => {
      document.body.innerHTML = '<ytz-snackbar>Message</ytz-snackbar>'
      const snackbar = document.querySelector('ytz-snackbar')

      expect(snackbar.duration).toBe(5000) // default

      snackbar.duration = 3000
      expect(snackbar.getAttribute('duration')).toBe('3000')
      expect(snackbar.duration).toBe(3000)
    })

    test('position property', () => {
      document.body.innerHTML = '<ytz-snackbar>Message</ytz-snackbar>'
      const snackbar = document.querySelector('ytz-snackbar')

      expect(snackbar.position).toBe('bottom-center') // default

      snackbar.position = 'top-right'
      expect(snackbar.getAttribute('position')).toBe('top-right')
    })

    test('dismissible property', () => {
      document.body.innerHTML = '<ytz-snackbar>Message</ytz-snackbar>'
      const snackbar = document.querySelector('ytz-snackbar')

      expect(snackbar.dismissible).toBe(false)

      snackbar.dismissible = true
      expect(snackbar.hasAttribute('dismissible')).toBe(true)
    })

    test('maxVisible property', () => {
      document.body.innerHTML = '<ytz-snackbar>Message</ytz-snackbar>'
      const snackbar = document.querySelector('ytz-snackbar')

      expect(snackbar.maxVisible).toBe(3) // default

      snackbar.maxVisible = 5
      expect(snackbar.getAttribute('max-visible')).toBe('5')
    })
  })

  describe('queue management', () => {
    test('sets offset CSS property when stacked', () => {
      document.body.innerHTML = `
        <ytz-snackbar id="s1" open position="bottom-center">First</ytz-snackbar>
        <ytz-snackbar id="s2" open position="bottom-center">Second</ytz-snackbar>
      `
      const s1 = document.querySelector('#s1')
      const s2 = document.querySelector('#s2')

      // Both should have offset CSS property set
      expect(s1.style.getPropertyValue('--ytz-snackbar-offset')).toBeDefined()
      expect(s2.style.getPropertyValue('--ytz-snackbar-offset')).toBeDefined()
    })
  })
})
