/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals'
import { render, screen, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { createRef } from 'react'
import { Popover } from './popover.js'

describe('Popover', () => {
  test('renders trigger and content children', () => {
    render(
      <Popover open>
        <button>Trigger</button>
        <div>Popover content</div>
      </Popover>
    )
    expect(screen.getByText('Trigger')).toBeInTheDocument()
    expect(screen.getByText('Popover content')).toBeInTheDocument()
  })

  test('syncs controlled open prop to attribute', () => {
    const { rerender } = render(
      <Popover open={false}>
        <button>Trigger</button>
        <div>Content</div>
      </Popover>
    )

    const popover = screen.getByText('Trigger').closest('ytz-popover')
    expect(popover).not.toHaveAttribute('open')

    rerender(
      <Popover open={true}>
        <button>Trigger</button>
        <div>Content</div>
      </Popover>
    )

    expect(popover).toHaveAttribute('open')
  })

  test('calls onOpenChange with true when show event fires', async () => {
    const handleOpenChange = jest.fn()
    render(
      <Popover onOpenChange={handleOpenChange}>
        <button>Trigger</button>
        <div>Content</div>
      </Popover>
    )

    const popover = screen.getByText('Trigger').closest('ytz-popover')

    await act(async () => {
      popover.dispatchEvent(new CustomEvent('show', { bubbles: true }))
    })

    expect(handleOpenChange).toHaveBeenCalledWith(true)
  })

  test('calls onOpenChange with false when hide event fires', async () => {
    const handleOpenChange = jest.fn()
    render(
      <Popover open onOpenChange={handleOpenChange}>
        <button>Trigger</button>
        <div>Content</div>
      </Popover>
    )

    const popover = screen.getByText('Trigger').closest('ytz-popover')

    await act(async () => {
      popover.dispatchEvent(new CustomEvent('hide', { bubbles: true }))
    })

    expect(handleOpenChange).toHaveBeenCalledWith(false)
  })

  test('calls onShow when show event fires', async () => {
    const handleShow = jest.fn()
    render(
      <Popover onShow={handleShow}>
        <button>Trigger</button>
        <div>Content</div>
      </Popover>
    )

    const popover = screen.getByText('Trigger').closest('ytz-popover')

    await act(async () => {
      popover.dispatchEvent(new CustomEvent('show', { bubbles: true }))
    })

    expect(handleShow).toHaveBeenCalledTimes(1)
  })

  test('calls onHide when hide event fires', async () => {
    const handleHide = jest.fn()
    render(
      <Popover open onHide={handleHide}>
        <button>Trigger</button>
        <div>Content</div>
      </Popover>
    )

    const popover = screen.getByText('Trigger').closest('ytz-popover')

    await act(async () => {
      popover.dispatchEvent(new CustomEvent('hide', { bubbles: true }))
    })

    expect(handleHide).toHaveBeenCalledTimes(1)
  })

  test('passes placement attribute', () => {
    render(
      <Popover placement="top">
        <button>Trigger</button>
        <div>Content</div>
      </Popover>
    )
    const popover = screen.getByText('Trigger').closest('ytz-popover')
    expect(popover).toHaveAttribute('placement', 'top')
  })

  test('passes offset attribute', () => {
    render(
      <Popover offset={16}>
        <button>Trigger</button>
        <div>Content</div>
      </Popover>
    )
    const popover = screen.getByText('Trigger').closest('ytz-popover')
    expect(popover).toHaveAttribute('offset', '16')
  })

  test('passes className to content wrapper', () => {
    render(
      <Popover open className="pa3 bg-white">
        <button>Trigger</button>
        <div>Content</div>
      </Popover>
    )
    const contentWrapper = screen.getByText('Content').closest('[slot="content"]')
    expect(contentWrapper).toHaveAttribute('class', 'pa3 bg-white')
  })

  test('forwards ref to ytz-popover element', () => {
    const ref = createRef()
    render(
      <Popover ref={ref}>
        <button>Trigger</button>
        <div>Content</div>
      </Popover>
    )
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current.tagName.toLowerCase()).toBe('ytz-popover')
  })

  test('passes aria attributes through', () => {
    render(
      <Popover aria-label="Settings menu">
        <button>Trigger</button>
        <div>Content</div>
      </Popover>
    )
    const popover = screen.getByText('Trigger').closest('ytz-popover')
    expect(popover).toHaveAttribute('aria-label', 'Settings menu')
  })

  test('passes data attributes through', () => {
    render(
      <Popover data-testid="my-popover">
        <button>Trigger</button>
        <div>Content</div>
      </Popover>
    )
    expect(screen.getByTestId('my-popover')).toBeInTheDocument()
  })

  test('works with single child (trigger only)', () => {
    render(
      <Popover>
        <button>Trigger only</button>
      </Popover>
    )
    expect(screen.getByText('Trigger only')).toBeInTheDocument()
  })

  test('wraps content in slot div', () => {
    render(
      <Popover open>
        <button>Trigger</button>
        <span>Content text</span>
      </Popover>
    )
    const slot = document.querySelector('[slot="content"]')
    expect(slot).toBeInTheDocument()
    expect(slot.querySelector('span')).toHaveTextContent('Content text')
  })
})
