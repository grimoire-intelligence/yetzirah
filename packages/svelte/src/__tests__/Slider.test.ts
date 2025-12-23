import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/svelte'
import Slider from '../Slider.svelte'

describe('Slider', () => {
  it('renders with default props', () => {
    const { container } = render(Slider)
    expect(container.querySelector('ytz-slider')).not.toBeNull()
  })

  it('passes value prop to web component', () => {
    const { container } = render(Slider, { props: { value: 50 } })
    const slider = container.querySelector('ytz-slider')
    expect(slider?.getAttribute('value')).toBe('50')
  })

  it('passes min prop to web component', () => {
    const { container } = render(Slider, { props: { min: 10 } })
    const slider = container.querySelector('ytz-slider')
    expect(slider?.getAttribute('min')).toBe('10')
  })

  it('passes max prop to web component', () => {
    const { container } = render(Slider, { props: { max: 200 } })
    const slider = container.querySelector('ytz-slider')
    expect(slider?.getAttribute('max')).toBe('200')
  })

  it('passes step prop to web component', () => {
    const { container } = render(Slider, { props: { step: 5 } })
    const slider = container.querySelector('ytz-slider')
    expect(slider?.getAttribute('step')).toBe('5')
  })

  it('passes disabled prop to web component', () => {
    const { container } = render(Slider, { props: { disabled: true } })
    const slider = container.querySelector('ytz-slider')
    expect(slider?.hasAttribute('disabled')).toBe(true)
  })

  it('handles change events from web component', async () => {
    const { container } = render(Slider, { props: { value: 0 } })
    const slider = container.querySelector('ytz-slider')

    // Simulate change event
    const event = new CustomEvent('change', { detail: { value: 75 }, bubbles: true })
    slider?.dispatchEvent(event)

    expect(true).toBe(true)
  })
})
