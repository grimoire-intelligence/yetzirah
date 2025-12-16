/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { createRef } from 'react'
import { Button } from './button.js'

describe('Button', () => {
  test('renders children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  test('passes href to ytz-button', () => {
    render(<Button href="/test">Link</Button>)
    const button = screen.getByText('Link').closest('ytz-button')
    expect(button).toHaveAttribute('href', '/test')
  })

  test('calls onClick handler', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click</Button>)
    fireEvent.click(screen.getByText('Click'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  test('passes className as class attribute', () => {
    render(<Button className="test-class">Styled</Button>)
    const button = screen.getByText('Styled').closest('ytz-button')
    expect(button).toHaveAttribute('class', 'test-class')
  })

  test('forwards ref to ytz-button element', () => {
    const ref = createRef()
    render(<Button ref={ref}>Ref test</Button>)
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current.tagName.toLowerCase()).toBe('ytz-button')
  })

  test('handles disabled state', () => {
    render(<Button disabled>Disabled</Button>)
    const button = screen.getByText('Disabled').closest('ytz-button')
    expect(button).toHaveAttribute('disabled')
  })

  test('passes type attribute for form buttons', () => {
    render(<Button type="submit">Submit</Button>)
    const button = screen.getByText('Submit').closest('ytz-button')
    expect(button).toHaveAttribute('type', 'submit')
  })

  test('passes aria attributes through', () => {
    render(<Button aria-label="Close dialog">X</Button>)
    const button = screen.getByText('X').closest('ytz-button')
    expect(button).toHaveAttribute('aria-label', 'Close dialog')
  })
})
