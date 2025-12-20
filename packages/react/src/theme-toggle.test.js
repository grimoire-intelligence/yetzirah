/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { createRef } from 'react'
import { ThemeToggle } from './theme-toggle.js'

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
}
Object.defineProperty(window, 'localStorage', { value: localStorageMock })

// Mock matchMedia
const matchMediaMock = jest.fn().mockImplementation(query => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn()
}))
Object.defineProperty(window, 'matchMedia', { value: matchMediaMock })

describe('ThemeToggle', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    document.documentElement.classList.remove('dark-mode')
    document.documentElement.removeAttribute('data-theme')
  })

  test('renders as ytz-theme-toggle element', () => {
    render(<ThemeToggle />)
    const toggle = document.querySelector('ytz-theme-toggle')
    expect(toggle).toBeInTheDocument()
  })

  test('renders children', () => {
    render(<ThemeToggle>Custom Theme Label</ThemeToggle>)
    expect(screen.getByText('Custom Theme Label')).toBeInTheDocument()
  })

  test('passes className as class attribute', () => {
    render(<ThemeToggle className="custom-class">Theme</ThemeToggle>)
    const toggle = document.querySelector('ytz-theme-toggle')
    expect(toggle).toHaveAttribute('class', 'custom-class')
  })

  test('passes storageKey prop', () => {
    render(<ThemeToggle storageKey="my-theme-key">Theme</ThemeToggle>)
    const toggle = document.querySelector('ytz-theme-toggle')
    expect(toggle).toHaveAttribute('storage-key', 'my-theme-key')
  })

  test('passes noPersist prop', () => {
    render(<ThemeToggle noPersist>Theme</ThemeToggle>)
    const toggle = document.querySelector('ytz-theme-toggle')
    expect(toggle).toHaveAttribute('no-persist')
  })

  test('does not set no-persist when noPersist is false', () => {
    render(<ThemeToggle noPersist={false}>Theme</ThemeToggle>)
    const toggle = document.querySelector('ytz-theme-toggle')
    expect(toggle).not.toHaveAttribute('no-persist')
  })

  test('calls onThemeChange handler on themechange event', () => {
    const handleThemeChange = jest.fn()
    render(<ThemeToggle onThemeChange={handleThemeChange}>Theme</ThemeToggle>)
    const toggle = document.querySelector('ytz-theme-toggle')

    const event = new CustomEvent('themechange', {
      bubbles: true,
      detail: { theme: 'dark', isDark: true }
    })
    toggle.dispatchEvent(event)

    expect(handleThemeChange).toHaveBeenCalledTimes(1)
    expect(handleThemeChange.mock.calls[0][0].detail).toEqual({ theme: 'dark', isDark: true })
  })

  test('forwards ref to ytz-theme-toggle element', () => {
    const ref = createRef()
    render(<ThemeToggle ref={ref}>Ref test</ThemeToggle>)
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current.tagName.toLowerCase()).toBe('ytz-theme-toggle')
  })

  test('passes aria attributes through', () => {
    render(<ThemeToggle aria-describedby="help-text">Theme</ThemeToggle>)
    const toggle = document.querySelector('ytz-theme-toggle')
    expect(toggle).toHaveAttribute('aria-describedby', 'help-text')
  })
})
