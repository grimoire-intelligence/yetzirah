/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals'
import { render, screen, fireEvent, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { createRef } from 'react'
import { Disclosure } from './disclosure.js'

describe('Disclosure', () => {
  test('renders children', () => {
    render(
      <Disclosure>
        <button>Toggle</button>
        <div>Content</div>
      </Disclosure>
    )
    expect(screen.getByText('Toggle')).toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  test('controlled mode - open prop controls state', async () => {
    const { rerender } = render(
      <Disclosure open={false}>
        <button>Toggle</button>
        <div>Content</div>
      </Disclosure>
    )

    const disclosure = screen.getByText('Toggle').closest('ytz-disclosure')
    expect(disclosure).not.toHaveAttribute('open')

    rerender(
      <Disclosure open={true}>
        <button>Toggle</button>
        <div>Content</div>
      </Disclosure>
    )

    expect(disclosure).toHaveAttribute('open')
  })

  test('defaultOpen sets initial open state', () => {
    render(
      <Disclosure defaultOpen>
        <button>Toggle</button>
        <div>Content</div>
      </Disclosure>
    )
    const disclosure = screen.getByText('Toggle').closest('ytz-disclosure')
    expect(disclosure).toHaveAttribute('open')
  })

  test('calls onToggle when toggled', async () => {
    const handleToggle = jest.fn()
    render(
      <Disclosure onToggle={handleToggle}>
        <button>Toggle</button>
        <div>Content</div>
      </Disclosure>
    )

    const button = screen.getByText('Toggle')

    await act(async () => {
      fireEvent.click(button)
    })

    expect(handleToggle).toHaveBeenCalledWith(true)
  })

  test('forwards ref to ytz-disclosure element', () => {
    const ref = createRef()
    render(
      <Disclosure ref={ref}>
        <button>Toggle</button>
        <div>Content</div>
      </Disclosure>
    )
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current.tagName.toLowerCase()).toBe('ytz-disclosure')
  })

  test('passes className as class attribute', () => {
    render(
      <Disclosure className="test-class">
        <button>Toggle</button>
        <div>Content</div>
      </Disclosure>
    )
    const disclosure = screen.getByText('Toggle').closest('ytz-disclosure')
    expect(disclosure).toHaveAttribute('class', 'test-class')
  })

  test('passes aria attributes through', () => {
    render(
      <Disclosure aria-label="Expandable section">
        <button>Toggle</button>
        <div>Content</div>
      </Disclosure>
    )
    const disclosure = screen.getByText('Toggle').closest('ytz-disclosure')
    expect(disclosure).toHaveAttribute('aria-label', 'Expandable section')
  })

  test('passes data attributes through', () => {
    render(
      <Disclosure data-testid="my-disclosure">
        <button>Toggle</button>
        <div>Content</div>
      </Disclosure>
    )
    expect(screen.getByTestId('my-disclosure')).toBeInTheDocument()
  })
})
