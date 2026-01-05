/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals'
import { render, screen, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { createRef } from 'react'
import { Snackbar } from './snackbar.js'
import { useSnackbar } from './use-snackbar.js'
import { SnackbarProvider, useSnackbarContext } from './snackbar-provider.js'

describe('Snackbar', () => {
  test('renders children', () => {
    render(<Snackbar>Test message</Snackbar>)
    expect(screen.getByText('Test message')).toBeInTheDocument()
  })

  test('renders as ytz-snackbar element', () => {
    render(<Snackbar>Message</Snackbar>)
    const snackbar = screen.getByText('Message').closest('ytz-snackbar')
    expect(snackbar).toBeInTheDocument()
  })

  test('sets open attribute when open prop is true', () => {
    render(<Snackbar open>Open snackbar</Snackbar>)
    const snackbar = screen.getByText('Open snackbar').closest('ytz-snackbar')
    expect(snackbar).toHaveAttribute('open')
  })

  test('removes open attribute when open prop is false', () => {
    const { rerender } = render(<Snackbar open>Snackbar</Snackbar>)
    const snackbar = screen.getByText('Snackbar').closest('ytz-snackbar')
    expect(snackbar).toHaveAttribute('open')

    rerender(<Snackbar open={false}>Snackbar</Snackbar>)
    expect(snackbar).not.toHaveAttribute('open')
  })

  test('calls onDismiss when dismiss event fires', () => {
    const handleDismiss = jest.fn()
    render(<Snackbar onDismiss={handleDismiss}>Dismissible</Snackbar>)
    const snackbar = screen.getByText('Dismissible').closest('ytz-snackbar')

    const event = new CustomEvent('dismiss', { bubbles: true })
    snackbar.dispatchEvent(event)

    expect(handleDismiss).toHaveBeenCalledTimes(1)
  })

  test('passes duration prop', () => {
    render(<Snackbar duration={3000}>Quick message</Snackbar>)
    const snackbar = screen.getByText('Quick message').closest('ytz-snackbar')
    expect(snackbar).toHaveAttribute('duration', '3000')
  })

  test('passes position prop', () => {
    render(<Snackbar position="top-right">Positioned</Snackbar>)
    const snackbar = screen.getByText('Positioned').closest('ytz-snackbar')
    expect(snackbar).toHaveAttribute('position', 'top-right')
  })

  test('passes dismissible prop', () => {
    render(<Snackbar dismissible>Dismissible</Snackbar>)
    const snackbar = screen.getByText('Dismissible').closest('ytz-snackbar')
    expect(snackbar).toHaveAttribute('dismissible')
  })

  test('passes max-visible prop', () => {
    render(<Snackbar maxVisible={5}>Limited</Snackbar>)
    const snackbar = screen.getByText('Limited').closest('ytz-snackbar')
    expect(snackbar).toHaveAttribute('max-visible', '5')
  })

  test('passes className as class attribute', () => {
    render(<Snackbar className="custom-snackbar">Styled</Snackbar>)
    const snackbar = screen.getByText('Styled').closest('ytz-snackbar')
    expect(snackbar).toHaveAttribute('class', 'custom-snackbar')
  })

  test('forwards ref with show and dismiss methods', () => {
    const ref = createRef()
    render(<Snackbar ref={ref}>Ref test</Snackbar>)

    expect(ref.current).toHaveProperty('show')
    expect(ref.current).toHaveProperty('dismiss')
    expect(typeof ref.current.show).toBe('function')
    expect(typeof ref.current.dismiss).toBe('function')
  })

  test('ref element property returns ytz-snackbar element', () => {
    const ref = createRef()
    render(<Snackbar ref={ref}>Element test</Snackbar>)

    expect(ref.current.element).toBeInstanceOf(HTMLElement)
    expect(ref.current.element.tagName.toLowerCase()).toBe('ytz-snackbar')
  })

  test('passes aria attributes through', () => {
    render(<Snackbar aria-live="polite">Accessible</Snackbar>)
    const snackbar = screen.getByText('Accessible').closest('ytz-snackbar')
    expect(snackbar).toHaveAttribute('aria-live', 'polite')
  })
})

describe('useSnackbar', () => {
  function TestComponent({ options }) {
    const { open, message, show, dismiss, snackbarProps } = useSnackbar(options)
    return (
      <div>
        <button onClick={() => show('Hello!')}>Show</button>
        <button onClick={dismiss}>Dismiss</button>
        <span data-testid="open">{open ? 'open' : 'closed'}</span>
        <span data-testid="message">{message}</span>
        <Snackbar {...snackbarProps}>{message}</Snackbar>
      </div>
    )
  }

  test('starts with closed state', () => {
    render(<TestComponent />)
    expect(screen.getByTestId('open')).toHaveTextContent('closed')
  })

  test('show opens snackbar with message', () => {
    render(<TestComponent />)

    act(() => {
      screen.getByText('Show').click()
    })

    expect(screen.getByTestId('open')).toHaveTextContent('open')
    expect(screen.getByTestId('message')).toHaveTextContent('Hello!')
  })

  test('dismiss closes snackbar', () => {
    render(<TestComponent />)

    act(() => {
      screen.getByText('Show').click()
    })
    expect(screen.getByTestId('open')).toHaveTextContent('open')

    act(() => {
      screen.getByText('Dismiss').click()
    })
    expect(screen.getByTestId('open')).toHaveTextContent('closed')
  })

  test('uses default options', () => {
    render(<TestComponent options={{ duration: 3000, position: 'top-right' }} />)

    act(() => {
      screen.getByText('Show').click()
    })

    const snackbar = document.querySelector('ytz-snackbar')
    expect(snackbar).toHaveAttribute('duration', '3000')
    expect(snackbar).toHaveAttribute('position', 'top-right')
  })
})

describe('SnackbarProvider', () => {
  function TestConsumer() {
    const { showSnackbar, dismissAll } = useSnackbarContext()
    return (
      <div>
        <button onClick={() => showSnackbar('Test notification')}>Show</button>
        <button onClick={dismissAll}>Dismiss All</button>
      </div>
    )
  }

  test('provides context to children', () => {
    render(
      <SnackbarProvider>
        <TestConsumer />
      </SnackbarProvider>
    )

    expect(screen.getByText('Show')).toBeInTheDocument()
  })

  test('showSnackbar renders a snackbar', () => {
    render(
      <SnackbarProvider>
        <TestConsumer />
      </SnackbarProvider>
    )

    act(() => {
      screen.getByText('Show').click()
    })

    expect(screen.getByText('Test notification')).toBeInTheDocument()
  })

  test('dismissAll removes all snackbars', () => {
    render(
      <SnackbarProvider>
        <TestConsumer />
      </SnackbarProvider>
    )

    act(() => {
      screen.getByText('Show').click()
      screen.getByText('Show').click()
    })

    const snackbars = document.querySelectorAll('ytz-snackbar')
    expect(snackbars.length).toBe(2)

    act(() => {
      screen.getByText('Dismiss All').click()
    })

    const remaining = document.querySelectorAll('ytz-snackbar')
    expect(remaining.length).toBe(0)
  })

  test('throws error when used outside provider', () => {
    const consoleError = console.error
    console.error = jest.fn()

    expect(() => {
      render(<TestConsumer />)
    }).toThrow('useSnackbarContext must be used within a SnackbarProvider')

    console.error = consoleError
  })
})
