/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals'
import { render, screen, fireEvent, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { createRef } from 'react'
import { Tooltip } from './tooltip.js'

describe('Tooltip', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  test('renders children as trigger', () => {
    render(
      <Tooltip content="Tooltip text">
        <button>Trigger</button>
      </Tooltip>
    )
    expect(screen.getByText('Trigger')).toBeInTheDocument()
  })

  test('renders content in slot', () => {
    render(
      <Tooltip content="Tooltip text">
        <button>Trigger</button>
      </Tooltip>
    )
    expect(screen.getByText('Tooltip text')).toBeInTheDocument()
  })

  test('passes placement attribute', () => {
    render(
      <Tooltip content="Tooltip text" placement="bottom">
        <button>Trigger</button>
      </Tooltip>
    )
    const tooltip = screen.getByText('Trigger').closest('ytz-tooltip')
    expect(tooltip).toHaveAttribute('placement', 'bottom')
  })

  test('passes delay attribute', () => {
    render(
      <Tooltip content="Tooltip text" delay={500}>
        <button>Trigger</button>
      </Tooltip>
    )
    const tooltip = screen.getByText('Trigger').closest('ytz-tooltip')
    expect(tooltip).toHaveAttribute('delay', '500')
  })

  test('passes offset attribute', () => {
    render(
      <Tooltip content="Tooltip text" offset={16}>
        <button>Trigger</button>
      </Tooltip>
    )
    const tooltip = screen.getByText('Trigger').closest('ytz-tooltip')
    expect(tooltip).toHaveAttribute('offset', '16')
  })

  test('calls onShow when show event fires', async () => {
    const handleShow = jest.fn()
    render(
      <Tooltip content="Tooltip text" onShow={handleShow}>
        <button>Trigger</button>
      </Tooltip>
    )

    const tooltip = screen.getByText('Trigger').closest('ytz-tooltip')

    await act(async () => {
      tooltip.dispatchEvent(new CustomEvent('show', { bubbles: true }))
    })

    expect(handleShow).toHaveBeenCalledTimes(1)
  })

  test('calls onHide when hide event fires', async () => {
    const handleHide = jest.fn()
    render(
      <Tooltip content="Tooltip text" onHide={handleHide}>
        <button>Trigger</button>
      </Tooltip>
    )

    const tooltip = screen.getByText('Trigger').closest('ytz-tooltip')

    await act(async () => {
      tooltip.dispatchEvent(new CustomEvent('hide', { bubbles: true }))
    })

    expect(handleHide).toHaveBeenCalledTimes(1)
  })

  test('forwards ref to ytz-tooltip element', () => {
    const ref = createRef()
    render(
      <Tooltip ref={ref} content="Tooltip text">
        <button>Trigger</button>
      </Tooltip>
    )
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current.tagName.toLowerCase()).toBe('ytz-tooltip')
  })

  test('passes className to content span', () => {
    render(
      <Tooltip content="Tooltip text" className="tooltip-style">
        <button>Trigger</button>
      </Tooltip>
    )
    const contentSpan = screen.getByText('Tooltip text')
    expect(contentSpan).toHaveAttribute('class', 'tooltip-style')
  })

  test('passes aria attributes through', () => {
    render(
      <Tooltip content="Tooltip text" aria-label="Help tooltip">
        <button>Trigger</button>
      </Tooltip>
    )
    const tooltip = screen.getByText('Trigger').closest('ytz-tooltip')
    expect(tooltip).toHaveAttribute('aria-label', 'Help tooltip')
  })

  test('passes data attributes through', () => {
    render(
      <Tooltip content="Tooltip text" data-testid="my-tooltip">
        <button>Trigger</button>
      </Tooltip>
    )
    expect(screen.getByTestId('my-tooltip')).toBeInTheDocument()
  })
})
