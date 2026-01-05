/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { createRef } from 'react'
import { Progress, Spinner, CircularProgress, LinearProgress } from './progress.js'

describe('Progress', () => {
  test('renders as ytz-progress element', () => {
    render(<Progress aria-label="Loading" />)
    const progress = document.querySelector('ytz-progress')
    expect(progress).toBeInTheDocument()
  })

  test('renders indeterminate when no value', () => {
    render(<Progress aria-label="Loading" />)
    const progress = document.querySelector('ytz-progress')
    expect(progress).not.toHaveAttribute('value')
  })

  test('sets value attribute when value prop is provided', () => {
    render(<Progress value={75} aria-label="Loading" />)
    const progress = document.querySelector('ytz-progress')
    expect(progress).toHaveAttribute('value', '75')
  })

  test('removes value attribute when value becomes null', () => {
    const { rerender } = render(<Progress value={50} aria-label="Loading" />)
    const progress = document.querySelector('ytz-progress')
    expect(progress).toHaveAttribute('value', '50')

    rerender(<Progress value={null} aria-label="Loading" />)
    expect(progress).not.toHaveAttribute('value')
  })

  test('sets linear attribute when linear prop is true', () => {
    render(<Progress linear aria-label="Loading" />)
    const progress = document.querySelector('ytz-progress')
    expect(progress).toHaveAttribute('linear')
  })

  test('does not set linear attribute when linear prop is false', () => {
    render(<Progress linear={false} aria-label="Loading" />)
    const progress = document.querySelector('ytz-progress')
    expect(progress).not.toHaveAttribute('linear')
  })

  test('passes size prop', () => {
    render(<Progress size="small" aria-label="Loading" />)
    const progress = document.querySelector('ytz-progress')
    expect(progress).toHaveAttribute('size', 'small')
  })

  test('passes label prop', () => {
    render(<Progress label="Download progress" />)
    const progress = document.querySelector('ytz-progress')
    expect(progress).toHaveAttribute('label', 'Download progress')
  })

  test('passes className as class attribute', () => {
    render(<Progress className="custom-progress" aria-label="Loading" />)
    const progress = document.querySelector('ytz-progress')
    expect(progress).toHaveAttribute('class', 'custom-progress')
  })

  test('forwards ref to ytz-progress element', () => {
    const ref = createRef()
    render(<Progress ref={ref} aria-label="Loading" />)
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current.tagName.toLowerCase()).toBe('ytz-progress')
  })

  test('passes data-testid attribute through', () => {
    render(<Progress data-testid="loading-progress" aria-label="Loading" />)
    const progress = document.querySelector('ytz-progress')
    expect(progress).toHaveAttribute('data-testid', 'loading-progress')
  })

  test('passes data attributes through', () => {
    render(<Progress data-testid="my-progress" aria-label="Loading" />)
    const progress = document.querySelector('ytz-progress')
    expect(progress).toHaveAttribute('data-testid', 'my-progress')
  })
})

describe('Spinner', () => {
  test('renders as ytz-progress element', () => {
    render(<Spinner aria-label="Loading" />)
    const progress = document.querySelector('ytz-progress')
    expect(progress).toBeInTheDocument()
  })

  test('does not set linear attribute', () => {
    render(<Spinner aria-label="Loading" />)
    const progress = document.querySelector('ytz-progress')
    expect(progress).not.toHaveAttribute('linear')
  })

  test('passes size prop', () => {
    render(<Spinner size="small" aria-label="Loading" />)
    const progress = document.querySelector('ytz-progress')
    expect(progress).toHaveAttribute('size', 'small')
  })

  test('forwards ref', () => {
    const ref = createRef()
    render(<Spinner ref={ref} aria-label="Loading" />)
    expect(ref.current.tagName.toLowerCase()).toBe('ytz-progress')
  })
})

describe('CircularProgress', () => {
  test('renders as circular (no linear attribute)', () => {
    render(<CircularProgress aria-label="Loading" />)
    const progress = document.querySelector('ytz-progress')
    expect(progress).not.toHaveAttribute('linear')
  })

  test('accepts value prop', () => {
    render(<CircularProgress value={50} aria-label="Loading" />)
    const progress = document.querySelector('ytz-progress')
    expect(progress).toHaveAttribute('value', '50')
  })
})

describe('LinearProgress', () => {
  test('sets linear attribute', () => {
    render(<LinearProgress aria-label="Loading" />)
    const progress = document.querySelector('ytz-progress')
    expect(progress).toHaveAttribute('linear')
  })

  test('accepts value prop', () => {
    render(<LinearProgress value={75} aria-label="Loading" />)
    const progress = document.querySelector('ytz-progress')
    expect(progress).toHaveAttribute('value', '75')
    expect(progress).toHaveAttribute('linear')
  })

  test('forwards ref', () => {
    const ref = createRef()
    render(<LinearProgress ref={ref} aria-label="Loading" />)
    expect(ref.current.tagName.toLowerCase()).toBe('ytz-progress')
  })
})
