/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals'
import { render, screen, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { createRef } from 'react'
import { Autocomplete, Option } from './autocomplete.js'

describe('Autocomplete', () => {
  test('renders input with placeholder', () => {
    render(
      <Autocomplete placeholder="Search...">
        <Option value="a">A</Option>
      </Autocomplete>
    )
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument()
  })

  test('renders children as options', () => {
    render(
      <Autocomplete>
        <Option value="apple">Apple</Option>
        <Option value="banana">Banana</Option>
      </Autocomplete>
    )
    expect(screen.getByText('Apple')).toBeInTheDocument()
    expect(screen.getByText('Banana')).toBeInTheDocument()
  })

  test('syncs controlled value to element', async () => {
    const { rerender } = render(
      <Autocomplete value="">
        <Option value="apple">Apple</Option>
      </Autocomplete>
    )

    const autocomplete = document.querySelector('ytz-autocomplete')
    expect(autocomplete.value).toBe('')

    rerender(
      <Autocomplete value="apple">
        <Option value="apple">Apple</Option>
      </Autocomplete>
    )

    expect(autocomplete.value).toBe('apple')
  })

  test('syncs array value in multiple mode', async () => {
    const { rerender } = render(
      <Autocomplete multiple value={[]}>
        <Option value="a">A</Option>
        <Option value="b">B</Option>
      </Autocomplete>
    )

    const autocomplete = document.querySelector('ytz-autocomplete')
    expect(autocomplete.value).toEqual([])

    rerender(
      <Autocomplete multiple value={['a', 'b']}>
        <Option value="a">A</Option>
        <Option value="b">B</Option>
      </Autocomplete>
    )

    expect(autocomplete.value).toEqual(['a', 'b'])
  })

  test('calls onChange when selection changes', async () => {
    const handleChange = jest.fn()
    render(
      <Autocomplete onChange={handleChange}>
        <Option value="apple">Apple</Option>
      </Autocomplete>
    )

    const autocomplete = document.querySelector('ytz-autocomplete')

    await act(async () => {
      autocomplete.dispatchEvent(new CustomEvent('change', {
        bubbles: true,
        detail: { value: 'apple' }
      }))
    })

    expect(handleChange).toHaveBeenCalledTimes(1)
    expect(handleChange).toHaveBeenCalledWith('apple')
  })

  test('calls onInputChange when input text changes', async () => {
    const handleInputChange = jest.fn()
    render(
      <Autocomplete onInputChange={handleInputChange}>
        <Option value="a">A</Option>
      </Autocomplete>
    )

    const autocomplete = document.querySelector('ytz-autocomplete')

    await act(async () => {
      autocomplete.dispatchEvent(new CustomEvent('input-change', {
        bubbles: true,
        detail: { value: 'test' }
      }))
    })

    expect(handleInputChange).toHaveBeenCalledTimes(1)
    expect(handleInputChange).toHaveBeenCalledWith('test')
  })

  test('passes multiple attribute when true', () => {
    render(
      <Autocomplete multiple>
        <Option value="a">A</Option>
      </Autocomplete>
    )
    const autocomplete = document.querySelector('ytz-autocomplete')
    expect(autocomplete).toHaveAttribute('multiple')
  })

  test('omits multiple attribute when false', () => {
    render(
      <Autocomplete multiple={false}>
        <Option value="a">A</Option>
      </Autocomplete>
    )
    const autocomplete = document.querySelector('ytz-autocomplete')
    expect(autocomplete).not.toHaveAttribute('multiple')
  })

  test('passes loading attribute when true', () => {
    render(
      <Autocomplete loading>
        <Option value="a">A</Option>
      </Autocomplete>
    )
    const autocomplete = document.querySelector('ytz-autocomplete')
    expect(autocomplete).toHaveAttribute('loading')
  })

  test('omits loading attribute when false', () => {
    render(
      <Autocomplete loading={false}>
        <Option value="a">A</Option>
      </Autocomplete>
    )
    const autocomplete = document.querySelector('ytz-autocomplete')
    expect(autocomplete).not.toHaveAttribute('loading')
  })

  test('passes filter="false" when filter is false', () => {
    render(
      <Autocomplete filter={false}>
        <Option value="a">A</Option>
      </Autocomplete>
    )
    const autocomplete = document.querySelector('ytz-autocomplete')
    expect(autocomplete).toHaveAttribute('filter', 'false')
  })

  test('omits filter attribute when true (default)', () => {
    render(
      <Autocomplete>
        <Option value="a">A</Option>
      </Autocomplete>
    )
    const autocomplete = document.querySelector('ytz-autocomplete')
    expect(autocomplete).not.toHaveAttribute('filter')
  })

  test('options prop is supported', () => {
    // Note: options prop calls setOptions on the web component
    // This tests that the prop is accepted without error
    render(
      <Autocomplete
        options={[
          { value: 'new1', label: 'New 1' },
          { value: 'new2', label: 'New 2' }
        ]}
      />
    )
    // Component renders without error
    const autocomplete = document.querySelector('ytz-autocomplete')
    expect(autocomplete).toBeInTheDocument()
  })

  test('renders loading content', () => {
    render(
      <Autocomplete loadingContent="Searching...">
        <Option value="a">A</Option>
      </Autocomplete>
    )
    expect(screen.getByText('Searching...')).toBeInTheDocument()
  })

  test('passes className as class', () => {
    render(
      <Autocomplete className="my-autocomplete">
        <Option value="a">A</Option>
      </Autocomplete>
    )
    const autocomplete = document.querySelector('ytz-autocomplete')
    expect(autocomplete).toHaveAttribute('class', 'my-autocomplete')
  })

  test('forwards ref', () => {
    const ref = createRef()
    render(
      <Autocomplete ref={ref}>
        <Option value="a">A</Option>
      </Autocomplete>
    )
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current.tagName.toLowerCase()).toBe('ytz-autocomplete')
  })

  test('passes aria attributes through', () => {
    render(
      <Autocomplete aria-label="Fruit selector">
        <Option value="a">A</Option>
      </Autocomplete>
    )
    const autocomplete = document.querySelector('ytz-autocomplete')
    expect(autocomplete).toHaveAttribute('aria-label', 'Fruit selector')
  })

  test('passes data attributes through', () => {
    render(
      <Autocomplete data-testid="my-autocomplete">
        <Option value="a">A</Option>
      </Autocomplete>
    )
    expect(screen.getByTestId('my-autocomplete')).toBeInTheDocument()
  })
})

describe('Option', () => {
  test('renders children', () => {
    render(
      <Autocomplete>
        <Option value="apple">Apple Fruit</Option>
      </Autocomplete>
    )
    expect(screen.getByText('Apple Fruit')).toBeInTheDocument()
  })

  test('passes value attribute', () => {
    render(
      <Autocomplete>
        <Option value="apple">Apple</Option>
      </Autocomplete>
    )
    const option = screen.getByText('Apple')
    expect(option).toHaveAttribute('value', 'apple')
  })

  test('passes disabled attribute when true', () => {
    render(
      <Autocomplete>
        <Option value="a" disabled>A</Option>
      </Autocomplete>
    )
    const option = screen.getByText('A')
    expect(option).toHaveAttribute('disabled')
  })

  test('omits disabled attribute when false', () => {
    render(
      <Autocomplete>
        <Option value="a" disabled={false}>A</Option>
      </Autocomplete>
    )
    const option = screen.getByText('A')
    expect(option).not.toHaveAttribute('disabled')
  })

  test('passes className as class', () => {
    render(
      <Autocomplete>
        <Option value="a" className="my-option">A</Option>
      </Autocomplete>
    )
    const option = screen.getByText('A')
    expect(option).toHaveAttribute('class', 'my-option')
  })

  test('forwards ref', () => {
    const ref = createRef()
    render(
      <Autocomplete>
        <Option ref={ref} value="a">A</Option>
      </Autocomplete>
    )
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current.tagName.toLowerCase()).toBe('ytz-option')
  })

  test('passes aria attributes through', () => {
    render(
      <Autocomplete>
        <Option value="a" aria-label="Option A">A</Option>
      </Autocomplete>
    )
    const option = screen.getByText('A')
    expect(option).toHaveAttribute('aria-label', 'Option A')
  })

  test('passes data attributes through', () => {
    render(
      <Autocomplete>
        <Option value="a" data-testid="option-a">A</Option>
      </Autocomplete>
    )
    expect(screen.getByTestId('option-a')).toBeInTheDocument()
  })
})
