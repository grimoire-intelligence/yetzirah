/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals'
import './theme-toggle.js'

// Mock matchMedia for jsdom
const mockMatchMedia = (matches = false) => {
  const listeners = []
  return jest.fn().mockImplementation(query => ({
    matches,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: (event, cb) => listeners.push(cb),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
    _listeners: listeners
  }))
}

describe('YtzThemeToggle', () => {
  let element

  beforeEach(() => {
    // Mock matchMedia
    window.matchMedia = mockMatchMedia()

    // Clean up document state
    document.documentElement.classList.remove('dark-mode')
    document.documentElement.removeAttribute('data-theme')
    localStorage.clear()

    element = document.createElement('ytz-theme-toggle')
  })

  afterEach(() => {
    element?.remove()
  })

  test('registers custom element', () => {
    expect(customElements.get('ytz-theme-toggle')).toBeDefined()
  })

  test('creates inner ytz-toggle element', () => {
    document.body.appendChild(element)
    const toggle = element.querySelector('ytz-toggle')
    expect(toggle).not.toBeNull()
  })

  test('sets aria-label on inner toggle', () => {
    document.body.appendChild(element)
    const toggle = element.querySelector('ytz-toggle')
    expect(toggle.getAttribute('aria-label')).toBe('Toggle dark mode')
  })

  test('provides default label text', () => {
    document.body.appendChild(element)
    const toggle = element.querySelector('ytz-toggle')
    expect(toggle.textContent.trim()).toBe('Dark mode')
  })

  test('preserves custom label text', () => {
    element.textContent = 'Night mode'
    document.body.appendChild(element)
    const toggle = element.querySelector('ytz-toggle')
    expect(toggle.textContent.trim()).toBe('Night mode')
  })

  test('applies dark-mode class when toggled on', () => {
    document.body.appendChild(element)
    const toggle = element.querySelector('ytz-toggle')

    toggle.dispatchEvent(new CustomEvent('change', {
      bubbles: true,
      detail: { checked: true }
    }))

    expect(document.documentElement.classList.contains('dark-mode')).toBe(true)
  })

  test('removes dark-mode class when toggled off', () => {
    document.documentElement.classList.add('dark-mode')
    document.body.appendChild(element)
    const toggle = element.querySelector('ytz-toggle')

    toggle.dispatchEvent(new CustomEvent('change', {
      bubbles: true,
      detail: { checked: false }
    }))

    expect(document.documentElement.classList.contains('dark-mode')).toBe(false)
  })

  test('sets data-theme attribute', () => {
    document.body.appendChild(element)
    const toggle = element.querySelector('ytz-toggle')

    toggle.dispatchEvent(new CustomEvent('change', {
      bubbles: true,
      detail: { checked: true }
    }))

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })

  test('saves theme to localStorage', () => {
    document.body.appendChild(element)
    const toggle = element.querySelector('ytz-toggle')

    toggle.dispatchEvent(new CustomEvent('change', {
      bubbles: true,
      detail: { checked: true }
    }))

    expect(localStorage.getItem('yetzirah-theme')).toBe('dark')
  })

  test('uses custom storage key', () => {
    element.setAttribute('storage-key', 'my-theme')
    document.body.appendChild(element)
    const toggle = element.querySelector('ytz-toggle')

    toggle.dispatchEvent(new CustomEvent('change', {
      bubbles: true,
      detail: { checked: true }
    }))

    expect(localStorage.getItem('my-theme')).toBe('dark')
  })

  test('does not persist when no-persist attribute set', () => {
    element.setAttribute('no-persist', '')
    document.body.appendChild(element)
    const toggle = element.querySelector('ytz-toggle')

    toggle.dispatchEvent(new CustomEvent('change', {
      bubbles: true,
      detail: { checked: true }
    }))

    expect(localStorage.getItem('yetzirah-theme')).toBeNull()
  })

  test('dispatches themechange event', () => {
    document.body.appendChild(element)
    const toggle = element.querySelector('ytz-toggle')
    const handler = jest.fn()
    element.addEventListener('themechange', handler)

    toggle.dispatchEvent(new CustomEvent('change', {
      bubbles: true,
      detail: { checked: true }
    }))

    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: { theme: 'dark', isDark: true }
      })
    )
  })

  test('theme getter returns current theme', () => {
    document.body.appendChild(element)
    expect(element.theme).toBe('light')

    document.documentElement.classList.add('dark-mode')
    expect(element.theme).toBe('dark')
  })

  test('theme setter applies theme', () => {
    document.body.appendChild(element)
    element.theme = 'dark'

    expect(document.documentElement.classList.contains('dark-mode')).toBe(true)
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })

  test('isDark getter returns boolean', () => {
    document.body.appendChild(element)
    expect(element.isDark).toBe(false)

    element.theme = 'dark'
    expect(element.isDark).toBe(true)
  })

  test('toggle() method switches theme', () => {
    document.body.appendChild(element)
    expect(element.theme).toBe('light')

    element.toggle()
    expect(element.theme).toBe('dark')

    element.toggle()
    expect(element.theme).toBe('light')
  })

  test('restores saved theme on connect', () => {
    localStorage.setItem('yetzirah-theme', 'dark')
    document.body.appendChild(element)

    expect(document.documentElement.classList.contains('dark-mode')).toBe(true)
  })

  test('storageKey property getter/setter', () => {
    expect(element.storageKey).toBe('yetzirah-theme')

    element.storageKey = 'custom-key'
    expect(element.getAttribute('storage-key')).toBe('custom-key')
    expect(element.storageKey).toBe('custom-key')
  })
})
