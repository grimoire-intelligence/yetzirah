import { render } from '@solidjs/testing-library'
import { createSignal } from 'solid-js'
import { describe, test, expect, vi } from 'vitest'
import { Slider } from '../Slider'

describe('Slider', () => {
  test('renders', () => {
    const { container } = render(() => <Slider />)
    const slider = container.querySelector('ytz-slider')
    expect(slider).toBeTruthy()
  })

  test('syncs value prop reactively', async () => {
    const [value, setValue] = createSignal(50)
    const { container } = render(() => <Slider value={value()} />)

    const slider = container.querySelector('ytz-slider')
    expect(slider).toHaveAttribute('value', '50')

    setValue(75)
    await Promise.resolve()
    expect(slider).toHaveAttribute('value', '75')
  })

  test('calls onChange callback with value', async () => {
    const handleChange = vi.fn()
    const { container } = render(() => (
      <Slider value={50} onChange={handleChange} />
    ))

    const slider = container.querySelector('ytz-slider')!
    slider.dispatchEvent(new CustomEvent('change', {
      bubbles: true,
      detail: { value: 75 }
    }))

    expect(handleChange).toHaveBeenCalledWith(75)
  })

  test('handles change event with empty detail', async () => {
    const handleChange = vi.fn()
    const { container } = render(() => (
      <Slider onChange={handleChange} />
    ))

    const slider = container.querySelector('ytz-slider')!
    slider.dispatchEvent(new CustomEvent('change', {
      bubbles: true,
      detail: {}
    }))

    expect(handleChange).toHaveBeenCalledWith(0)
  })
})
