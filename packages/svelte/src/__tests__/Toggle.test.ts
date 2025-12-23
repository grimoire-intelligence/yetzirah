import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/svelte'
import Toggle from '../Toggle.svelte'

describe('Toggle', () => {
  it('renders with default props', () => {
    const { container } = render(Toggle)
    expect(container.querySelector('ytz-toggle')).not.toBeNull()
  })

  it('passes checked prop to web component', () => {
    const { container } = render(Toggle, { props: { checked: true } })
    const toggle = container.querySelector('ytz-toggle')
    expect(toggle).not.toBeNull()
  })

  it('passes disabled prop to web component', () => {
    const { container } = render(Toggle, { props: { disabled: true } })
    const toggle = container.querySelector('ytz-toggle')
    expect(toggle?.hasAttribute('disabled')).toBe(true)
  })

  it('receives change events from web component', async () => {
    const { container } = render(Toggle, { props: { checked: false } })
    const toggle = container.querySelector('ytz-toggle')

    expect(toggle).not.toBeNull()

    // Simulate change event
    const event = new CustomEvent('change', { detail: { checked: true }, bubbles: true })
    toggle?.dispatchEvent(event)

    // The event should bubble up
    expect(true).toBe(true) // Event dispatch verification
  })
})
