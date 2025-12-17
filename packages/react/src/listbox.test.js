/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals'
import { render, screen, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { createRef } from 'react'
import { Listbox } from './listbox.js'
import { Option } from './autocomplete.js'

describe('Listbox', () => {
  test('renders children as options', () => {
    render(
      <Listbox>
        <Option value="apple">Apple</Option>
        <Option value="banana">Banana</Option>
      </Listbox>
    )
    expect(screen.getByText('Apple')).toBeInTheDocument()
    expect(screen.getByText('Banana')).toBeInTheDocument()
  })

  test('syncs controlled value to element', async () => {
    const { rerender } = render(
      <Listbox value="">
        <Option value="apple">Apple</Option>
      </Listbox>
    )

    const listbox = document.querySelector('ytz-listbox')
    expect(listbox.value).toBe('')

    rerender(
      <Listbox value="apple">
        <Option value="apple">Apple</Option>
      </Listbox>
    )

    expect(listbox.value).toBe('apple')
  })

  test('syncs array value in multiple mode', async () => {
    const { rerender } = render(
      <Listbox multiple value={[]}>
        <Option value="a">A</Option>
        <Option value="b">B</Option>
      </Listbox>
    )

    const listbox = document.querySelector('ytz-listbox')
    expect(listbox.value).toEqual([])

    rerender(
      <Listbox multiple value={['a', 'b']}>
        <Option value="a">A</Option>
        <Option value="b">B</Option>
      </Listbox>
    )

    expect(listbox.value).toEqual(['a', 'b'])
  })

  test('calls onChange when selection changes', async () => {
    const handleChange = jest.fn()
    render(
      <Listbox onChange={handleChange}>
        <Option value="apple">Apple</Option>
      </Listbox>
    )

    const listbox = document.querySelector('ytz-listbox')

    await act(async () => {
      listbox.dispatchEvent(new CustomEvent('change', {
        bubbles: true,
        detail: { value: 'apple' }
      }))
    })

    expect(handleChange).toHaveBeenCalledTimes(1)
    expect(handleChange).toHaveBeenCalledWith('apple')
  })

  test('passes multiple attribute when true', () => {
    render(
      <Listbox multiple>
        <Option value="a">A</Option>
      </Listbox>
    )
    const listbox = document.querySelector('ytz-listbox')
    expect(listbox).toHaveAttribute('multiple')
  })

  test('omits multiple attribute when false', () => {
    render(
      <Listbox multiple={false}>
        <Option value="a">A</Option>
      </Listbox>
    )
    const listbox = document.querySelector('ytz-listbox')
    expect(listbox).not.toHaveAttribute('multiple')
  })

  test('passes disabled attribute when true', () => {
    render(
      <Listbox disabled>
        <Option value="a">A</Option>
      </Listbox>
    )
    const listbox = document.querySelector('ytz-listbox')
    expect(listbox).toHaveAttribute('disabled')
  })

  test('omits disabled attribute when false', () => {
    render(
      <Listbox disabled={false}>
        <Option value="a">A</Option>
      </Listbox>
    )
    const listbox = document.querySelector('ytz-listbox')
    expect(listbox).not.toHaveAttribute('disabled')
  })

  test('passes className as class', () => {
    render(
      <Listbox className="my-listbox">
        <Option value="a">A</Option>
      </Listbox>
    )
    const listbox = document.querySelector('ytz-listbox')
    expect(listbox).toHaveAttribute('class', 'my-listbox')
  })

  test('forwards ref to element', () => {
    const ref = createRef()
    render(
      <Listbox ref={ref}>
        <Option value="a">A</Option>
      </Listbox>
    )
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current.tagName.toLowerCase()).toBe('ytz-listbox')
  })

  test('ref provides access to element methods', () => {
    const ref = createRef()
    render(
      <Listbox ref={ref}>
        <Option value="a">A</Option>
        <Option value="b">B</Option>
      </Listbox>
    )
    expect(typeof ref.current.clear).toBe('function')
    expect(typeof ref.current.selectAll).toBe('function')
  })

  test('passes aria attributes through', () => {
    render(
      <Listbox aria-label="Fruit list">
        <Option value="a">A</Option>
      </Listbox>
    )
    const listbox = document.querySelector('ytz-listbox')
    expect(listbox).toHaveAttribute('aria-label', 'Fruit list')
  })

  test('passes data attributes through', () => {
    render(
      <Listbox data-testid="my-listbox">
        <Option value="a">A</Option>
      </Listbox>
    )
    expect(screen.getByTestId('my-listbox')).toBeInTheDocument()
  })
})
