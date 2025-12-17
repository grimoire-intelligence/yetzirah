/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals'
import { render, screen, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { createRef } from 'react'
import { Select } from './select.js'
import { Option } from './autocomplete.js'

describe('Select', () => {
  test('renders children as options', () => {
    render(
      <Select>
        <Option value="apple">Apple</Option>
        <Option value="banana">Banana</Option>
      </Select>
    )
    expect(screen.getByText('Apple')).toBeInTheDocument()
    expect(screen.getByText('Banana')).toBeInTheDocument()
  })

  test('syncs controlled value to element', async () => {
    const { rerender } = render(
      <Select value="">
        <Option value="apple">Apple</Option>
      </Select>
    )

    const select = document.querySelector('ytz-select')
    expect(select.value).toBe('')

    rerender(
      <Select value="apple">
        <Option value="apple">Apple</Option>
      </Select>
    )

    expect(select.value).toBe('apple')
  })

  test('syncs array value in multiple mode', async () => {
    const { rerender } = render(
      <Select multiple value={[]}>
        <Option value="a">A</Option>
        <Option value="b">B</Option>
      </Select>
    )

    const select = document.querySelector('ytz-select')
    expect(select.value).toEqual([])

    rerender(
      <Select multiple value={['a', 'b']}>
        <Option value="a">A</Option>
        <Option value="b">B</Option>
      </Select>
    )

    expect(select.value).toEqual(['a', 'b'])
  })

  test('calls onChange when selection changes', async () => {
    const handleChange = jest.fn()
    render(
      <Select onChange={handleChange}>
        <Option value="apple">Apple</Option>
      </Select>
    )

    const select = document.querySelector('ytz-select')

    await act(async () => {
      select.dispatchEvent(new CustomEvent('change', {
        bubbles: true,
        detail: { value: 'apple' }
      }))
    })

    expect(handleChange).toHaveBeenCalledTimes(1)
    expect(handleChange).toHaveBeenCalledWith('apple')
  })

  test('passes multiple attribute when true', () => {
    render(
      <Select multiple>
        <Option value="a">A</Option>
      </Select>
    )
    const select = document.querySelector('ytz-select')
    expect(select).toHaveAttribute('multiple')
  })

  test('omits multiple attribute when false', () => {
    render(
      <Select multiple={false}>
        <Option value="a">A</Option>
      </Select>
    )
    const select = document.querySelector('ytz-select')
    expect(select).not.toHaveAttribute('multiple')
  })

  test('passes disabled attribute when true', () => {
    render(
      <Select disabled>
        <Option value="a">A</Option>
      </Select>
    )
    const select = document.querySelector('ytz-select')
    expect(select).toHaveAttribute('disabled')
  })

  test('omits disabled attribute when false', () => {
    render(
      <Select disabled={false}>
        <Option value="a">A</Option>
      </Select>
    )
    const select = document.querySelector('ytz-select')
    expect(select).not.toHaveAttribute('disabled')
  })

  test('passes placeholder attribute', () => {
    render(
      <Select placeholder="Choose...">
        <Option value="a">A</Option>
      </Select>
    )
    const select = document.querySelector('ytz-select')
    expect(select).toHaveAttribute('placeholder', 'Choose...')
  })

  test('passes className as class', () => {
    render(
      <Select className="my-select">
        <Option value="a">A</Option>
      </Select>
    )
    const select = document.querySelector('ytz-select')
    expect(select).toHaveAttribute('class', 'my-select')
  })

  test('forwards ref to element', () => {
    const ref = createRef()
    render(
      <Select ref={ref}>
        <Option value="a">A</Option>
      </Select>
    )
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current.tagName.toLowerCase()).toBe('ytz-select')
  })

  test('ref provides access to element methods', () => {
    const ref = createRef()
    render(
      <Select ref={ref}>
        <Option value="a">A</Option>
      </Select>
    )
    expect(typeof ref.current.show).toBe('function')
    expect(typeof ref.current.hide).toBe('function')
    expect(typeof ref.current.toggle).toBe('function')
    expect(typeof ref.current.clear).toBe('function')
  })

  test('passes aria attributes through', () => {
    render(
      <Select aria-label="Fruit selector">
        <Option value="a">A</Option>
      </Select>
    )
    const select = document.querySelector('ytz-select')
    expect(select).toHaveAttribute('aria-label', 'Fruit selector')
  })

  test('passes data attributes through', () => {
    render(
      <Select data-testid="my-select">
        <Option value="a">A</Option>
      </Select>
    )
    expect(screen.getByTestId('my-select')).toBeInTheDocument()
  })
})
