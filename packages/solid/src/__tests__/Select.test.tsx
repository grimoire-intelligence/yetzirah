import { render } from '@solidjs/testing-library'
import { createSignal } from 'solid-js'
import { describe, test, expect, vi } from 'vitest'
import { Select } from '../Select'

describe('Select', () => {
  test('renders children', () => {
    const { container } = render(() => (
      <Select>
        <option value="a">Option A</option>
      </Select>
    ))
    const select = container.querySelector('ytz-select')
    expect(select).toBeTruthy()
  })

  test('syncs value prop reactively', async () => {
    const [value, setValue] = createSignal('a')
    const { container } = render(() => <Select value={value()}>Content</Select>)

    const select = container.querySelector('ytz-select')
    expect(select).toHaveAttribute('value', 'a')

    setValue('b')
    await Promise.resolve()
    expect(select).toHaveAttribute('value', 'b')
  })

  test('calls onChange callback with value', async () => {
    const handleChange = vi.fn()
    const { container } = render(() => (
      <Select value="a" onChange={handleChange}>Content</Select>
    ))

    const select = container.querySelector('ytz-select')!
    select.dispatchEvent(new CustomEvent('change', {
      bubbles: true,
      detail: { value: 'b' }
    }))

    expect(handleChange).toHaveBeenCalledWith('b')
  })

  test('handles change event with empty detail', async () => {
    const handleChange = vi.fn()
    const { container } = render(() => (
      <Select onChange={handleChange}>Content</Select>
    ))

    const select = container.querySelector('ytz-select')!
    select.dispatchEvent(new CustomEvent('change', {
      bubbles: true,
      detail: {}
    }))

    expect(handleChange).toHaveBeenCalledWith('')
  })
})
