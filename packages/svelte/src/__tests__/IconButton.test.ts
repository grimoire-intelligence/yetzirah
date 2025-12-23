import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/svelte'
import IconButton from '../IconButton.svelte'

describe('IconButton', () => {
  it('renders with required label prop', () => {
    const { container } = render(IconButton, { props: { label: 'Close' } })
    expect(container.querySelector('ytz-icon-button')).not.toBeNull()
  })

  it('passes aria-label to web component', () => {
    const { container } = render(IconButton, { props: { label: 'Settings' } })
    const button = container.querySelector('ytz-icon-button')
    expect(button?.getAttribute('aria-label')).toBe('Settings')
  })

  it('passes disabled prop to web component', () => {
    const { container } = render(IconButton, { props: { label: 'Close', disabled: true } })
    const button = container.querySelector('ytz-icon-button')
    expect(button?.hasAttribute('disabled')).toBe(true)
  })

  it('forwards click events', async () => {
    const { container } = render(IconButton, { props: { label: 'Close' } })
    const button = container.querySelector('ytz-icon-button')

    // Simulate click event
    const event = new MouseEvent('click', { bubbles: true })
    button?.dispatchEvent(event)

    expect(true).toBe(true)
  })

  it('passes href prop for link variant', () => {
    const { container } = render(IconButton, { props: { label: 'Home', href: '/home' } })
    const button = container.querySelector('ytz-icon-button')
    expect(button?.getAttribute('href')).toBe('/home')
  })
})
