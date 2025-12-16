/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals'
import './disclosure.js'

describe('YtzDisclosure', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  describe('rendering', () => {
    test('content is hidden by default', () => {
      document.body.innerHTML = `
        <ytz-disclosure>
          <button>Toggle</button>
          <div>Content</div>
        </ytz-disclosure>
      `
      const content = document.querySelector('ytz-disclosure > div')
      expect(content.hidden).toBe(true)
    })

    test('content is visible when open attribute present', () => {
      document.body.innerHTML = `
        <ytz-disclosure open>
          <button>Toggle</button>
          <div>Content</div>
        </ytz-disclosure>
      `
      const content = document.querySelector('ytz-disclosure > div')
      expect(content.hidden).toBe(false)
    })
  })

  describe('ARIA attributes', () => {
    test('trigger has aria-expanded=false when closed', () => {
      document.body.innerHTML = `
        <ytz-disclosure>
          <button>Toggle</button>
          <div>Content</div>
        </ytz-disclosure>
      `
      const trigger = document.querySelector('ytz-disclosure button')
      expect(trigger.getAttribute('aria-expanded')).toBe('false')
    })

    test('trigger has aria-expanded=true when open', () => {
      document.body.innerHTML = `
        <ytz-disclosure open>
          <button>Toggle</button>
          <div>Content</div>
        </ytz-disclosure>
      `
      const trigger = document.querySelector('ytz-disclosure button')
      expect(trigger.getAttribute('aria-expanded')).toBe('true')
    })

    test('trigger has aria-controls pointing to content', () => {
      document.body.innerHTML = `
        <ytz-disclosure>
          <button>Toggle</button>
          <div>Content</div>
        </ytz-disclosure>
      `
      const trigger = document.querySelector('ytz-disclosure button')
      const content = document.querySelector('ytz-disclosure > div')

      expect(trigger.getAttribute('aria-controls')).toBe(content.id)
      expect(content.id).toMatch(/^ytz-disclosure-\d+$/)
    })

    test('preserves existing content id', () => {
      document.body.innerHTML = `
        <ytz-disclosure>
          <button>Toggle</button>
          <div id="my-content">Content</div>
        </ytz-disclosure>
      `
      const trigger = document.querySelector('ytz-disclosure button')
      const content = document.querySelector('#my-content')

      expect(trigger.getAttribute('aria-controls')).toBe('my-content')
      expect(content.id).toBe('my-content')
    })
  })

  describe('toggle behavior', () => {
    test('clicking trigger opens disclosure', () => {
      document.body.innerHTML = `
        <ytz-disclosure>
          <button>Toggle</button>
          <div>Content</div>
        </ytz-disclosure>
      `
      const disclosure = document.querySelector('ytz-disclosure')
      const trigger = disclosure.querySelector('button')
      const content = disclosure.querySelector('div')

      trigger.click()

      expect(disclosure.hasAttribute('open')).toBe(true)
      expect(content.hidden).toBe(false)
      expect(trigger.getAttribute('aria-expanded')).toBe('true')
    })

    test('clicking trigger closes open disclosure', () => {
      document.body.innerHTML = `
        <ytz-disclosure open>
          <button>Toggle</button>
          <div>Content</div>
        </ytz-disclosure>
      `
      const disclosure = document.querySelector('ytz-disclosure')
      const trigger = disclosure.querySelector('button')
      const content = disclosure.querySelector('div')

      trigger.click()

      expect(disclosure.hasAttribute('open')).toBe(false)
      expect(content.hidden).toBe(true)
      expect(trigger.getAttribute('aria-expanded')).toBe('false')
    })
  })

  describe('toggle event', () => {
    test('dispatches toggle event with open=true when opening', () => {
      document.body.innerHTML = `
        <ytz-disclosure>
          <button>Toggle</button>
          <div>Content</div>
        </ytz-disclosure>
      `
      const disclosure = document.querySelector('ytz-disclosure')
      const handler = jest.fn()
      disclosure.addEventListener('toggle', handler)

      disclosure.querySelector('button').click()

      expect(handler).toHaveBeenCalledTimes(1)
      expect(handler.mock.calls[0][0].detail).toEqual({ open: true })
    })

    test('dispatches toggle event with open=false when closing', () => {
      document.body.innerHTML = `
        <ytz-disclosure open>
          <button>Toggle</button>
          <div>Content</div>
        </ytz-disclosure>
      `
      const disclosure = document.querySelector('ytz-disclosure')
      const handler = jest.fn()
      disclosure.addEventListener('toggle', handler)

      disclosure.querySelector('button').click()

      expect(handler).toHaveBeenCalledTimes(1)
      expect(handler.mock.calls[0][0].detail).toEqual({ open: false })
    })

    test('toggle event bubbles', () => {
      document.body.innerHTML = `
        <div id="parent">
          <ytz-disclosure>
            <button>Toggle</button>
            <div>Content</div>
          </ytz-disclosure>
        </div>
      `
      const parent = document.querySelector('#parent')
      const handler = jest.fn()
      parent.addEventListener('toggle', handler)

      document.querySelector('ytz-disclosure button').click()

      expect(handler).toHaveBeenCalledTimes(1)
    })
  })

  describe('dynamic updates', () => {
    test('adding open attribute shows content', () => {
      document.body.innerHTML = `
        <ytz-disclosure>
          <button>Toggle</button>
          <div>Content</div>
        </ytz-disclosure>
      `
      const disclosure = document.querySelector('ytz-disclosure')
      const content = disclosure.querySelector('div')
      const trigger = disclosure.querySelector('button')

      expect(content.hidden).toBe(true)

      disclosure.setAttribute('open', '')

      expect(content.hidden).toBe(false)
      expect(trigger.getAttribute('aria-expanded')).toBe('true')
    })

    test('removing open attribute hides content', () => {
      document.body.innerHTML = `
        <ytz-disclosure open>
          <button>Toggle</button>
          <div>Content</div>
        </ytz-disclosure>
      `
      const disclosure = document.querySelector('ytz-disclosure')
      const content = disclosure.querySelector('div')
      const trigger = disclosure.querySelector('button')

      expect(content.hidden).toBe(false)

      disclosure.removeAttribute('open')

      expect(content.hidden).toBe(true)
      expect(trigger.getAttribute('aria-expanded')).toBe('false')
    })
  })

  describe('public API', () => {
    test('open getter returns boolean state', () => {
      document.body.innerHTML = `
        <ytz-disclosure>
          <button>Toggle</button>
          <div>Content</div>
        </ytz-disclosure>
      `
      const disclosure = document.querySelector('ytz-disclosure')

      expect(disclosure.open).toBe(false)

      disclosure.setAttribute('open', '')
      expect(disclosure.open).toBe(true)
    })

    test('open setter updates attribute', () => {
      document.body.innerHTML = `
        <ytz-disclosure>
          <button>Toggle</button>
          <div>Content</div>
        </ytz-disclosure>
      `
      const disclosure = document.querySelector('ytz-disclosure')

      disclosure.open = true
      expect(disclosure.hasAttribute('open')).toBe(true)

      disclosure.open = false
      expect(disclosure.hasAttribute('open')).toBe(false)
    })

    test('toggle() method toggles state', () => {
      document.body.innerHTML = `
        <ytz-disclosure>
          <button>Toggle</button>
          <div>Content</div>
        </ytz-disclosure>
      `
      const disclosure = document.querySelector('ytz-disclosure')

      expect(disclosure.open).toBe(false)

      disclosure.toggle()
      expect(disclosure.open).toBe(true)

      disclosure.toggle()
      expect(disclosure.open).toBe(false)
    })

    test('toggle() dispatches event', () => {
      document.body.innerHTML = `
        <ytz-disclosure>
          <button>Toggle</button>
          <div>Content</div>
        </ytz-disclosure>
      `
      const disclosure = document.querySelector('ytz-disclosure')
      const handler = jest.fn()
      disclosure.addEventListener('toggle', handler)

      disclosure.toggle()

      expect(handler).toHaveBeenCalledTimes(1)
    })
  })

  describe('edge cases', () => {
    test('handles missing button gracefully', () => {
      document.body.innerHTML = `
        <ytz-disclosure>
          <div>Content only</div>
        </ytz-disclosure>
      `
      // Should not throw
      const disclosure = document.querySelector('ytz-disclosure')
      expect(disclosure).toBeTruthy()
    })

    test('handles missing content gracefully', () => {
      document.body.innerHTML = `
        <ytz-disclosure>
          <button>Toggle only</button>
        </ytz-disclosure>
      `
      // Should not throw
      const disclosure = document.querySelector('ytz-disclosure')
      expect(disclosure).toBeTruthy()
    })
  })
})
