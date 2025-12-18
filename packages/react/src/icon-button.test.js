/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { createRef } from 'react'
import { IconButton } from './icon-button.js'

describe('IconButton', () => {
  test('renders children', () => {
    render(<IconButton aria-label="Close">X</IconButton>)
    expect(screen.getByText('X')).toBeInTheDocument()
  })

  test('renders as ytz-icon-button element', () => {
    render(<IconButton aria-label="Close">X</IconButton>)
    const button = screen.getByText('X').closest('ytz-icon-button')
    expect(button).toBeInTheDocument()
  })

  test('passes aria-label attribute', () => {
    render(<IconButton aria-label="Close dialog">X</IconButton>)
    const button = screen.getByText('X').closest('ytz-icon-button')
    expect(button).toHaveAttribute('aria-label', 'Close dialog')
  })

  test('calls onClick handler', () => {
    const handleClick = jest.fn()
    render(<IconButton aria-label="Click me" onClick={handleClick}>+</IconButton>)
    fireEvent.click(screen.getByText('+'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  test('passes className as class attribute', () => {
    render(<IconButton aria-label="Styled" className="custom-icon-btn">*</IconButton>)
    const button = screen.getByText('*').closest('ytz-icon-button')
    expect(button).toHaveAttribute('class', 'custom-icon-btn')
  })

  test('forwards ref to ytz-icon-button element', () => {
    const ref = createRef()
    render(<IconButton ref={ref} aria-label="Ref test">R</IconButton>)
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current.tagName.toLowerCase()).toBe('ytz-icon-button')
  })

  test('handles disabled state', () => {
    render(<IconButton aria-label="Disabled" disabled>D</IconButton>)
    const button = screen.getByText('D').closest('ytz-icon-button')
    expect(button).toHaveAttribute('disabled')
  })

  test('passes tooltip attribute when true', () => {
    render(<IconButton aria-label="With tooltip" tooltip>T</IconButton>)
    const button = screen.getByText('T').closest('ytz-icon-button')
    expect(button).toHaveAttribute('tooltip')
  })

  test('does not pass tooltip attribute when false', () => {
    render(<IconButton aria-label="No tooltip" tooltip={false}>N</IconButton>)
    const button = screen.getByText('N').closest('ytz-icon-button')
    expect(button).not.toHaveAttribute('tooltip')
  })

  test('passes data attributes through', () => {
    render(<IconButton aria-label="Data" data-action="delete">D</IconButton>)
    const button = screen.getByText('D').closest('ytz-icon-button')
    expect(button).toHaveAttribute('data-action', 'delete')
  })

  test('renders SVG children correctly', () => {
    render(
      <IconButton aria-label="SVG icon">
        <svg data-testid="icon" viewBox="0 0 24 24">
          <path d="M12 2L2 22h20L12 2z" />
        </svg>
      </IconButton>
    )
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })
})
