/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals'
import { render, screen, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { createRef } from 'react'
import { Drawer } from './drawer.js'

describe('Drawer', () => {
  test('renders children', () => {
    render(
      <Drawer open>
        <p>Drawer content</p>
      </Drawer>
    )
    expect(screen.getByText('Drawer content')).toBeInTheDocument()
  })

  test('syncs open prop to attribute', () => {
    const { rerender } = render(
      <Drawer open={false}>
        <p>Content</p>
      </Drawer>
    )

    const drawer = screen.getByText('Content').closest('ytz-drawer')
    expect(drawer).not.toHaveAttribute('open')

    rerender(
      <Drawer open={true}>
        <p>Content</p>
      </Drawer>
    )

    expect(drawer).toHaveAttribute('open')
  })

  test('calls onClose when close event fires', async () => {
    const handleClose = jest.fn()
    render(
      <Drawer open onClose={handleClose}>
        <p>Content</p>
      </Drawer>
    )

    const drawer = screen.getByText('Content').closest('ytz-drawer')

    await act(async () => {
      drawer.dispatchEvent(new CustomEvent('close', { bubbles: true }))
    })

    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  test('forwards ref to ytz-drawer element', () => {
    const ref = createRef()
    render(
      <Drawer ref={ref} open>
        <p>Content</p>
      </Drawer>
    )
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current.tagName.toLowerCase()).toBe('ytz-drawer')
  })

  test('passes className as class attribute', () => {
    render(
      <Drawer open className="w5 h-100 bg-white">
        <p>Content</p>
      </Drawer>
    )
    const drawer = screen.getByText('Content').closest('ytz-drawer')
    expect(drawer).toHaveAttribute('class', 'w5 h-100 bg-white')
  })

  test('passes anchor attribute', () => {
    render(
      <Drawer open anchor="right">
        <p>Content</p>
      </Drawer>
    )
    const drawer = screen.getByText('Content').closest('ytz-drawer')
    expect(drawer).toHaveAttribute('anchor', 'right')
  })

  test('defaults anchor to left', () => {
    render(
      <Drawer open>
        <p>Content</p>
      </Drawer>
    )
    const drawer = screen.getByText('Content').closest('ytz-drawer')
    expect(drawer).toHaveAttribute('anchor', 'left')
  })

  test('passes static attribute when true', () => {
    render(
      <Drawer open static>
        <p>Content</p>
      </Drawer>
    )
    const drawer = screen.getByText('Content').closest('ytz-drawer')
    expect(drawer).toHaveAttribute('static')
  })

  test('does not pass static attribute when false', () => {
    render(
      <Drawer open static={false}>
        <p>Content</p>
      </Drawer>
    )
    const drawer = screen.getByText('Content').closest('ytz-drawer')
    expect(drawer).not.toHaveAttribute('static')
  })

  test('passes aria attributes through', () => {
    render(
      <Drawer open aria-labelledby="drawer-title">
        <h2 id="drawer-title">Title</h2>
      </Drawer>
    )
    const drawer = screen.getByText('Title').closest('ytz-drawer')
    expect(drawer).toHaveAttribute('aria-labelledby', 'drawer-title')
  })

  test('passes data attributes through', () => {
    render(
      <Drawer open data-testid="my-drawer">
        <p>Content</p>
      </Drawer>
    )
    expect(screen.getByTestId('my-drawer')).toBeInTheDocument()
  })
})
