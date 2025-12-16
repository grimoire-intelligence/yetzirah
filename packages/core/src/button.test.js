/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals'
import './button.js'

describe('YtzButton', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  describe('rendering', () => {
    test('renders button element when no href', () => {
      document.body.innerHTML = '<ytz-button>Click me</ytz-button>'
      const ytzButton = document.querySelector('ytz-button')
      const inner = ytzButton.querySelector('button')

      expect(inner).not.toBeNull()
      expect(inner.textContent).toBe('Click me')
    })

    test('renders anchor element when href provided', () => {
      document.body.innerHTML = '<ytz-button href="/test">Link</ytz-button>'
      const ytzButton = document.querySelector('ytz-button')
      const inner = ytzButton.querySelector('a')

      expect(inner).not.toBeNull()
      expect(inner.href).toContain('/test')
      expect(inner.textContent).toBe('Link')
    })
  })

  describe('default classes', () => {
    test('prepends button defaults for button element', () => {
      document.body.innerHTML = '<ytz-button>Click</ytz-button>'
      const inner = document.querySelector('ytz-button button')

      expect(inner.className).toContain('pointer')
      expect(inner.className).toContain('font-inherit')
      expect(inner.className).toContain('bg-transparent')
      // Note: bn (border-none) is NOT included - users control borders
    })

    test('prepends anchor defaults for anchor element', () => {
      document.body.innerHTML = '<ytz-button href="#">Link</ytz-button>'
      const inner = document.querySelector('ytz-button a')

      expect(inner.className).toContain('pointer')
      expect(inner.className).toContain('font-inherit')
      expect(inner.className).toContain('no-underline')
      expect(inner.className).toContain('dib')
    })

    test('preserves user classes after defaults', () => {
      document.body.innerHTML = '<ytz-button class="ph3 pv2 bg-blue">Styled</ytz-button>'
      const inner = document.querySelector('ytz-button button')

      expect(inner.className).toBe('pointer font-inherit bg-transparent ph3 pv2 bg-blue')
    })
  })

  describe('button attributes', () => {
    test('defaults to type="button"', () => {
      document.body.innerHTML = '<ytz-button>Click</ytz-button>'
      const inner = document.querySelector('ytz-button button')

      expect(inner.type).toBe('button')
    })

    test('respects type attribute', () => {
      document.body.innerHTML = '<ytz-button type="submit">Submit</ytz-button>'
      const inner = document.querySelector('ytz-button button')

      expect(inner.type).toBe('submit')
    })

    test('handles disabled attribute', () => {
      document.body.innerHTML = '<ytz-button disabled>Disabled</ytz-button>'
      const inner = document.querySelector('ytz-button button')

      expect(inner.disabled).toBe(true)
    })
  })

  describe('accessibility attributes', () => {
    test('passes through aria-* attributes', () => {
      document.body.innerHTML = '<ytz-button aria-label="Close" aria-pressed="true">X</ytz-button>'
      const inner = document.querySelector('ytz-button button')

      expect(inner.getAttribute('aria-label')).toBe('Close')
      expect(inner.getAttribute('aria-pressed')).toBe('true')
    })

    test('passes through data-* attributes', () => {
      document.body.innerHTML = '<ytz-button data-testid="my-button" data-action="submit">Click</ytz-button>'
      const inner = document.querySelector('ytz-button button')

      expect(inner.getAttribute('data-testid')).toBe('my-button')
      expect(inner.getAttribute('data-action')).toBe('submit')
    })
  })

  describe('dynamic updates', () => {
    test('re-renders when href is added', () => {
      document.body.innerHTML = '<ytz-button>Click</ytz-button>'
      const ytzButton = document.querySelector('ytz-button')

      expect(ytzButton.querySelector('button')).not.toBeNull()

      ytzButton.setAttribute('href', '/new')

      expect(ytzButton.querySelector('a')).not.toBeNull()
      expect(ytzButton.querySelector('button')).toBeNull()
    })

    test('re-renders when href is removed', () => {
      document.body.innerHTML = '<ytz-button href="/test">Link</ytz-button>'
      const ytzButton = document.querySelector('ytz-button')

      expect(ytzButton.querySelector('a')).not.toBeNull()

      ytzButton.removeAttribute('href')

      expect(ytzButton.querySelector('button')).not.toBeNull()
      expect(ytzButton.querySelector('a')).toBeNull()
    })
  })

  describe('click handling', () => {
    test('button responds to click events', () => {
      const handler = jest.fn()
      document.body.innerHTML = '<ytz-button>Click</ytz-button>'
      const inner = document.querySelector('ytz-button button')

      inner.addEventListener('click', handler)
      inner.click()

      expect(handler).toHaveBeenCalledTimes(1)
    })

    test('anchor responds to click events', () => {
      const handler = jest.fn((e) => e.preventDefault())
      document.body.innerHTML = '<ytz-button href="#">Link</ytz-button>'
      const inner = document.querySelector('ytz-button a')

      inner.addEventListener('click', handler)
      inner.click()

      expect(handler).toHaveBeenCalledTimes(1)
    })
  })
})
