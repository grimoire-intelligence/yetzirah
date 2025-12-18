/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { createRef } from 'react'
import { Chip } from './chip.js'

describe('Chip', () => {
  test('renders children', () => {
    render(<Chip>JavaScript</Chip>)
    expect(screen.getByText('JavaScript')).toBeInTheDocument()
  })

  test('renders as ytz-chip element', () => {
    render(<Chip>Tag</Chip>)
    const chip = screen.getByText('Tag').closest('ytz-chip')
    expect(chip).toBeInTheDocument()
  })

  test('passes deletable attribute when true', () => {
    render(<Chip deletable>Deletable</Chip>)
    const chip = screen.getByText('Deletable').closest('ytz-chip')
    expect(chip).toHaveAttribute('deletable')
  })

  test('does not pass deletable attribute when false', () => {
    render(<Chip deletable={false}>Not deletable</Chip>)
    const chip = screen.getByText('Not deletable').closest('ytz-chip')
    expect(chip).not.toHaveAttribute('deletable')
  })

  test('calls onDelete handler on delete event', () => {
    const handleDelete = jest.fn()
    render(<Chip deletable onDelete={handleDelete}>Delete me</Chip>)
    const chip = screen.getByText('Delete me').closest('ytz-chip')

    const event = new CustomEvent('delete', {
      bubbles: true,
      detail: { chip }
    })
    chip.dispatchEvent(event)

    expect(handleDelete).toHaveBeenCalledTimes(1)
  })

  test('passes className as class attribute', () => {
    render(<Chip className="custom-chip">Styled</Chip>)
    const chip = screen.getByText('Styled').closest('ytz-chip')
    expect(chip).toHaveAttribute('class', 'custom-chip')
  })

  test('forwards ref to ytz-chip element', () => {
    const ref = createRef()
    render(<Chip ref={ref}>Ref test</Chip>)
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current.tagName.toLowerCase()).toBe('ytz-chip')
  })

  test('handles disabled state', () => {
    render(<Chip disabled>Disabled</Chip>)
    const chip = screen.getByText('Disabled').closest('ytz-chip')
    expect(chip).toHaveAttribute('disabled')
  })

  test('passes aria attributes through', () => {
    render(<Chip aria-label="Tag: JavaScript">JS</Chip>)
    const chip = screen.getByText('JS').closest('ytz-chip')
    expect(chip).toHaveAttribute('aria-label', 'Tag: JavaScript')
  })

  test('passes data attributes through', () => {
    render(<Chip data-tag-id="123">Tag</Chip>)
    const chip = screen.getByText('Tag').closest('ytz-chip')
    expect(chip).toHaveAttribute('data-tag-id', '123')
  })
})
