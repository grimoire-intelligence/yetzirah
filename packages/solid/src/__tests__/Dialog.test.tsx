import { render } from '@solidjs/testing-library'
import { createSignal } from 'solid-js'
import { describe, test, expect, vi } from 'vitest'
import { Dialog } from '../Dialog'

describe('Dialog', () => {
  test('renders children', () => {
    const { container } = render(() => <Dialog>Test Content</Dialog>)
    const dialog = container.querySelector('ytz-dialog')
    expect(dialog).toBeTruthy()
    expect(dialog?.textContent).toBe('Test Content')
  })

  test('syncs open prop reactively', async () => {
    const [open, setOpen] = createSignal(false)
    const { container } = render(() => <Dialog open={open()}>Content</Dialog>)

    const dialog = container.querySelector('ytz-dialog')
    expect(dialog).not.toHaveAttribute('open')

    setOpen(true)
    await Promise.resolve()
    expect(dialog).toHaveAttribute('open')

    setOpen(false)
    await Promise.resolve()
    expect(dialog).not.toHaveAttribute('open')
  })

  test('calls onClose callback', async () => {
    const handleClose = vi.fn()
    const { container } = render(() => (
      <Dialog open onClose={handleClose}>Content</Dialog>
    ))

    const dialog = container.querySelector('ytz-dialog')!
    dialog.dispatchEvent(new CustomEvent('close', { bubbles: true }))

    expect(handleClose).toHaveBeenCalled()
  })
})
