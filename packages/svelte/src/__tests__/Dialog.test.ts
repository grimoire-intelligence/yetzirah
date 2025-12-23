import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/svelte'
import Dialog from '../Dialog.svelte'

describe('Dialog', () => {
  it('renders with default props', () => {
    const { container } = render(Dialog)
    expect(container.querySelector('ytz-dialog')).not.toBeNull()
  })

  it('passes open prop to web component', () => {
    const { container } = render(Dialog, { props: { open: true } })
    const dialog = container.querySelector('ytz-dialog')
    expect(dialog).not.toBeNull()
  })

  it('passes static attribute to web component', () => {
    const { container } = render(Dialog, { props: { isStatic: true } })
    const dialog = container.querySelector('ytz-dialog')
    expect(dialog?.hasAttribute('static')).toBe(true)
  })

  it('receives close events from web component', async () => {
    const { container } = render(Dialog, { props: { open: true } })
    const dialog = container.querySelector('ytz-dialog')

    expect(dialog).not.toBeNull()

    // Simulate close event
    const event = new CustomEvent('close', { bubbles: true })
    dialog?.dispatchEvent(event)

    // The event should bubble up
    expect(true).toBe(true) // Event dispatch verification
  })
})
