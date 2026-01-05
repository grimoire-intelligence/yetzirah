import { render } from '@solidjs/testing-library'
import { createSignal } from 'solid-js'
import { describe, test, expect, vi } from 'vitest'
import { Disclosure } from '../Disclosure'

describe('Disclosure', () => {
  test('renders children', () => {
    const { container } = render(() => <Disclosure>Content</Disclosure>)
    const disclosure = container.querySelector('ytz-disclosure')
    expect(disclosure).toBeTruthy()
    expect(disclosure?.textContent).toBe('Content')
  })

  test('syncs open prop reactively', async () => {
    const [open, setOpen] = createSignal(false)
    const { container } = render(() => <Disclosure open={open()}>Content</Disclosure>)

    const disclosure = container.querySelector('ytz-disclosure')
    expect(disclosure).not.toHaveAttribute('open')

    setOpen(true)
    await Promise.resolve()
    expect(disclosure).toHaveAttribute('open')

    setOpen(false)
    await Promise.resolve()
    expect(disclosure).not.toHaveAttribute('open')
  })

  test('calls onToggle callback with open state', async () => {
    const handleToggle = vi.fn()
    const { container } = render(() => (
      <Disclosure open onToggle={handleToggle}>Content</Disclosure>
    ))

    const disclosure = container.querySelector('ytz-disclosure')!
    disclosure.dispatchEvent(new CustomEvent('toggle', {
      bubbles: true,
      detail: { open: false }
    }))

    expect(handleToggle).toHaveBeenCalledWith(false)
  })

  test('handles toggle event with empty detail', async () => {
    const handleToggle = vi.fn()
    const { container } = render(() => (
      <Disclosure onToggle={handleToggle}>Content</Disclosure>
    ))

    const disclosure = container.querySelector('ytz-disclosure')!
    disclosure.dispatchEvent(new CustomEvent('toggle', {
      bubbles: true,
      detail: {}
    }))

    expect(handleToggle).toHaveBeenCalledWith(false)
  })
})
