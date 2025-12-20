/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { createRef, useState } from 'react'
import { Slider } from './slider.js'

describe('Slider', () => {
  test('renders as ytz-slider element', () => {
    const { container } = render(<Slider />)
    const slider = container.querySelector('ytz-slider')
    expect(slider).toBeInTheDocument()
  })

  test('passes value attribute', () => {
    const { container } = render(<Slider value={50} />)
    const slider = container.querySelector('ytz-slider')
    expect(slider).toHaveAttribute('value', '50')
  })

  test('passes defaultValue as initial value', () => {
    const { container } = render(<Slider defaultValue={25} />)
    const slider = container.querySelector('ytz-slider')
    expect(slider).toHaveAttribute('value', '25')
  })

  test('passes min attribute', () => {
    const { container } = render(<Slider min={10} />)
    const slider = container.querySelector('ytz-slider')
    expect(slider).toHaveAttribute('min', '10')
  })

  test('passes max attribute', () => {
    const { container } = render(<Slider max={200} />)
    const slider = container.querySelector('ytz-slider')
    expect(slider).toHaveAttribute('max', '200')
  })

  test('passes step attribute', () => {
    const { container } = render(<Slider step={5} />)
    const slider = container.querySelector('ytz-slider')
    expect(slider).toHaveAttribute('step', '5')
  })

  test('calls onChange handler on change event', () => {
    const handleChange = jest.fn()
    const { container } = render(<Slider onChange={handleChange} />)
    const slider = container.querySelector('ytz-slider')

    const event = new CustomEvent('change', {
      bubbles: true,
      detail: { value: 75 }
    })
    slider.dispatchEvent(event)

    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  test('passes className as class attribute', () => {
    const { container } = render(<Slider className="custom-slider" />)
    const slider = container.querySelector('ytz-slider')
    expect(slider).toHaveAttribute('class', 'custom-slider')
  })

  test('forwards ref to ytz-slider element', () => {
    const ref = createRef()
    render(<Slider ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current.tagName.toLowerCase()).toBe('ytz-slider')
  })

  test('handles disabled state', () => {
    const { container } = render(<Slider disabled />)
    const slider = container.querySelector('ytz-slider')
    expect(slider).toHaveAttribute('disabled')
  })

  test('passes aria attributes through', () => {
    const { container } = render(<Slider aria-label="Volume" />)
    const slider = container.querySelector('ytz-slider')
    expect(slider).toHaveAttribute('aria-label', 'Volume')
  })

  test('works with all range props together', () => {
    const { container } = render(
      <Slider value={50} min={0} max={100} step={10} />
    )
    const slider = container.querySelector('ytz-slider')
    expect(slider).toHaveAttribute('value', '50')
    expect(slider).toHaveAttribute('min', '0')
    expect(slider).toHaveAttribute('max', '100')
    expect(slider).toHaveAttribute('step', '10')
  })

  test('works as controlled component', () => {
    function ControlledSlider() {
      const [value, setValue] = useState(50)
      return (
        <div>
          <Slider
            value={value}
            onChange={(e) => setValue(e.detail.value)}
          />
          <span data-testid="value">{value}</span>
        </div>
      )
    }

    render(<ControlledSlider />)
    expect(screen.getByTestId('value')).toHaveTextContent('50')
  })
})
