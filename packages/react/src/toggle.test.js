/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { createRef, useState } from 'react'
import { Toggle } from './toggle.js'

describe('Toggle', () => {
  test('renders children', () => {
    render(<Toggle>Dark mode</Toggle>)
    expect(screen.getByText('Dark mode')).toBeInTheDocument()
  })

  test('renders as ytz-toggle element', () => {
    render(<Toggle>Label</Toggle>)
    const toggle = screen.getByText('Label').closest('ytz-toggle')
    expect(toggle).toBeInTheDocument()
  })

  test('passes checked attribute when true', () => {
    render(<Toggle checked>Checked</Toggle>)
    const toggle = screen.getByText('Checked').closest('ytz-toggle')
    expect(toggle).toHaveAttribute('checked')
  })

  test('does not pass checked attribute when false', () => {
    render(<Toggle checked={false}>Unchecked</Toggle>)
    const toggle = screen.getByText('Unchecked').closest('ytz-toggle')
    expect(toggle).not.toHaveAttribute('checked')
  })

  test('passes defaultChecked as initial checked state', () => {
    render(<Toggle defaultChecked>Default</Toggle>)
    const toggle = screen.getByText('Default').closest('ytz-toggle')
    expect(toggle).toHaveAttribute('checked')
  })

  test('calls onChange handler on change event', () => {
    const handleChange = jest.fn()
    render(<Toggle onChange={handleChange}>Toggle me</Toggle>)
    const toggle = screen.getByText('Toggle me').closest('ytz-toggle')

    const event = new CustomEvent('change', {
      bubbles: true,
      detail: { checked: true }
    })
    toggle.dispatchEvent(event)

    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  test('passes className as class attribute', () => {
    render(<Toggle className="custom-toggle">Styled</Toggle>)
    const toggle = screen.getByText('Styled').closest('ytz-toggle')
    expect(toggle).toHaveAttribute('class', 'custom-toggle')
  })

  test('forwards ref to ytz-toggle element', () => {
    const ref = createRef()
    render(<Toggle ref={ref}>Ref test</Toggle>)
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current.tagName.toLowerCase()).toBe('ytz-toggle')
  })

  test('handles disabled state', () => {
    render(<Toggle disabled>Disabled</Toggle>)
    const toggle = screen.getByText('Disabled').closest('ytz-toggle')
    expect(toggle).toHaveAttribute('disabled')
  })

  test('passes aria attributes through', () => {
    render(<Toggle aria-describedby="help-text">Accessible</Toggle>)
    const toggle = screen.getByText('Accessible').closest('ytz-toggle')
    expect(toggle).toHaveAttribute('aria-describedby', 'help-text')
  })

  test('works as controlled component', () => {
    function ControlledToggle() {
      const [checked, setChecked] = useState(false)
      return (
        <Toggle
          checked={checked}
          onChange={(e) => setChecked(e.detail.checked)}
        >
          {checked ? 'On' : 'Off'}
        </Toggle>
      )
    }

    render(<ControlledToggle />)
    expect(screen.getByText('Off')).toBeInTheDocument()
  })
})
