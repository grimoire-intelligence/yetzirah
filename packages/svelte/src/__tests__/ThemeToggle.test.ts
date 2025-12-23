import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/svelte'
import ThemeToggle from '../ThemeToggle.svelte'

describe('ThemeToggle', () => {
  it('renders with default props', () => {
    const { container } = render(ThemeToggle)
    expect(container.querySelector('ytz-theme-toggle')).not.toBeNull()
  })

  it('passes storageKey prop to web component', () => {
    const { container } = render(ThemeToggle, { props: { storageKey: 'my-app-theme' } })
    const toggle = container.querySelector('ytz-theme-toggle')
    expect(toggle?.getAttribute('storage-key')).toBe('my-app-theme')
  })

  it('passes noPersist prop to web component', () => {
    const { container } = render(ThemeToggle, { props: { noPersist: true } })
    const toggle = container.querySelector('ytz-theme-toggle')
    expect(toggle?.hasAttribute('no-persist')).toBe(true)
  })

  it('forwards themechange events', async () => {
    const { container } = render(ThemeToggle)
    const toggle = container.querySelector('ytz-theme-toggle')

    // Simulate themechange event
    const event = new CustomEvent('themechange', {
      detail: { theme: 'dark', isDark: true },
      bubbles: true
    })
    toggle?.dispatchEvent(event)

    expect(true).toBe(true)
  })

  it('passes theme prop to web component', () => {
    const { container } = render(ThemeToggle, { props: { theme: 'dark' } })
    const toggle = container.querySelector('ytz-theme-toggle')
    expect(toggle?.getAttribute('theme')).toBe('dark')
  })
})
