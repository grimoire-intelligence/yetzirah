import { render } from '@solidjs/testing-library'
import { createSignal } from 'solid-js'
import { describe, test, expect, vi } from 'vitest'
import { Toggle } from '../Toggle'

describe('Toggle', () => {
  test('renders children', () => {
    const { container } = render(() => <Toggle>Label</Toggle>)
    const toggle = container.querySelector('ytz-toggle')
    expect(toggle).toBeTruthy()
    expect(toggle?.textContent).toBe('Label')
  })

  test('syncs checked prop reactively', async () => {
    const [checked, setChecked] = createSignal(false)
    const { container } = render(() => <Toggle checked={checked()}>Toggle</Toggle>)

    const toggle = container.querySelector('ytz-toggle')
    expect(toggle).not.toHaveAttribute('checked')

    setChecked(true)
    await Promise.resolve()
    expect(toggle).toHaveAttribute('checked')

    setChecked(false)
    await Promise.resolve()
    expect(toggle).not.toHaveAttribute('checked')
  })

  test('calls onChange callback with checked state', async () => {
    const handleChange = vi.fn()
    const { container } = render(() => (
      <Toggle checked onChange={handleChange}>Toggle</Toggle>
    ))

    const toggle = container.querySelector('ytz-toggle')!
    toggle.dispatchEvent(new CustomEvent('change', {
      bubbles: true,
      detail: { checked: false }
    }))

    expect(handleChange).toHaveBeenCalledWith(false)
  })

  test('handles change event with empty detail', async () => {
    const handleChange = vi.fn()
    const { container } = render(() => (
      <Toggle onChange={handleChange}>Toggle</Toggle>
    ))

    const toggle = container.querySelector('ytz-toggle')!
    toggle.dispatchEvent(new CustomEvent('change', {
      bubbles: true,
      detail: {}
    }))

    expect(handleChange).toHaveBeenCalledWith(false)
  })
})
