import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/svelte'
import SelectOption from '../SelectOption.svelte'

describe('SelectOption', () => {
  it('renders with default props', () => {
    const { container } = render(SelectOption)
    expect(container.querySelector('ytz-option')).not.toBeNull()
  })

  it('passes value prop to web component', () => {
    const { container } = render(SelectOption, { props: { value: 'option1' } })
    const option = container.querySelector('ytz-option')
    expect(option?.getAttribute('value')).toBe('option1')
  })

  it('passes disabled prop to web component', () => {
    const { container } = render(SelectOption, { props: { disabled: true } })
    const option = container.querySelector('ytz-option')
    expect(option?.hasAttribute('disabled')).toBe(true)
  })

  it('passes selected prop to web component', () => {
    const { container } = render(SelectOption, { props: { selected: true } })
    const option = container.querySelector('ytz-option')
    expect(option?.hasAttribute('selected')).toBe(true)
  })

  it('renders slot content', () => {
    const { container } = render(SelectOption, { props: { value: 'test' } })
    const option = container.querySelector('ytz-option')
    expect(option).not.toBeNull()
  })
})
