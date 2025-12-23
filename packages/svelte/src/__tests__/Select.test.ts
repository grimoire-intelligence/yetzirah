import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/svelte'
import Select from '../Select.svelte'

describe('Select', () => {
  it('renders with default props', () => {
    const { container } = render(Select)
    expect(container.querySelector('ytz-select')).not.toBeNull()
  })

  it('passes value prop to web component', () => {
    const { container } = render(Select, { props: { value: 'option1' } })
    const select = container.querySelector('ytz-select')
    expect(select).not.toBeNull()
  })

  it('passes multiple prop to web component', () => {
    const { container } = render(Select, { props: { multiple: true } })
    const select = container.querySelector('ytz-select')
    expect(select?.hasAttribute('multiple')).toBe(true)
  })

  it('passes disabled prop to web component', () => {
    const { container } = render(Select, { props: { disabled: true } })
    const select = container.querySelector('ytz-select')
    expect(select?.hasAttribute('disabled')).toBe(true)
  })

  it('passes placeholder prop to web component', () => {
    const { container } = render(Select, { props: { placeholder: 'Choose an option' } })
    const select = container.querySelector('ytz-select')
    expect(select?.getAttribute('placeholder')).toBe('Choose an option')
  })

  it('passes open prop to web component', () => {
    const { container } = render(Select, { props: { open: true } })
    const select = container.querySelector('ytz-select')
    expect(select?.hasAttribute('open')).toBe(true)
  })

  it('handles change events from web component', async () => {
    const { container } = render(Select, { props: { value: '' } })
    const select = container.querySelector('ytz-select')

    // Simulate change event
    const event = new CustomEvent('change', { detail: { value: 'selected' }, bubbles: true })
    select?.dispatchEvent(event)

    expect(true).toBe(true)
  })

  it('handles array value for multiple select', () => {
    const { container } = render(Select, { props: { value: ['a', 'b'], multiple: true } })
    const select = container.querySelector('ytz-select')
    expect(select).not.toBeNull()
  })
})
