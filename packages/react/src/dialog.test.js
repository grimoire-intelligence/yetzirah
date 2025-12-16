/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals'
import { render, screen, fireEvent, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { createRef } from 'react'
import { Dialog } from './dialog.js'

describe('Dialog', () => {
  test('renders children', () => {
    render(
      <Dialog open>
        <p>Dialog content</p>
      </Dialog>
    )
    expect(screen.getByText('Dialog content')).toBeInTheDocument()
  })

  test('syncs open prop to attribute', () => {
    const { rerender } = render(
      <Dialog open={false}>
        <p>Content</p>
      </Dialog>
    )

    const dialog = screen.getByText('Content').closest('ytz-dialog')
    expect(dialog).not.toHaveAttribute('open')

    rerender(
      <Dialog open={true}>
        <p>Content</p>
      </Dialog>
    )

    expect(dialog).toHaveAttribute('open')
  })

  test('calls onClose when close event fires', async () => {
    const handleClose = jest.fn()
    render(
      <Dialog open onClose={handleClose}>
        <p>Content</p>
      </Dialog>
    )

    const dialog = screen.getByText('Content').closest('ytz-dialog')

    await act(async () => {
      dialog.dispatchEvent(new CustomEvent('close', { bubbles: true }))
    })

    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  test('forwards ref to ytz-dialog element', () => {
    const ref = createRef()
    render(
      <Dialog ref={ref} open>
        <p>Content</p>
      </Dialog>
    )
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current.tagName.toLowerCase()).toBe('ytz-dialog')
  })

  test('passes className as class attribute', () => {
    render(
      <Dialog open className="pa4 bg-white">
        <p>Content</p>
      </Dialog>
    )
    const dialog = screen.getByText('Content').closest('ytz-dialog')
    expect(dialog).toHaveAttribute('class', 'pa4 bg-white')
  })

  test('passes static attribute when true', () => {
    render(
      <Dialog open static>
        <p>Content</p>
      </Dialog>
    )
    const dialog = screen.getByText('Content').closest('ytz-dialog')
    expect(dialog).toHaveAttribute('static')
  })

  test('does not pass static attribute when false', () => {
    render(
      <Dialog open static={false}>
        <p>Content</p>
      </Dialog>
    )
    const dialog = screen.getByText('Content').closest('ytz-dialog')
    expect(dialog).not.toHaveAttribute('static')
  })

  test('passes aria attributes through', () => {
    render(
      <Dialog open aria-labelledby="dialog-title">
        <h2 id="dialog-title">Title</h2>
      </Dialog>
    )
    const dialog = screen.getByText('Title').closest('ytz-dialog')
    expect(dialog).toHaveAttribute('aria-labelledby', 'dialog-title')
  })

  test('passes data attributes through', () => {
    render(
      <Dialog open data-testid="my-dialog">
        <p>Content</p>
      </Dialog>
    )
    expect(screen.getByTestId('my-dialog')).toBeInTheDocument()
  })
})
