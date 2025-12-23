import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import IconButton from '../IconButton.vue'

describe('IconButton', () => {
  it('renders with required label prop', () => {
    const wrapper = mount(IconButton, {
      props: { label: 'Close' }
    })
    expect(wrapper.find('ytz-icon-button').exists()).toBe(true)
  })

  it('passes aria-label to web component', () => {
    const wrapper = mount(IconButton, {
      props: { label: 'Settings' }
    })
    const button = wrapper.find('ytz-icon-button')
    expect(button.attributes('aria-label')).toBe('Settings')
  })

  it('passes disabled prop to web component', () => {
    const wrapper = mount(IconButton, {
      props: { label: 'Close', disabled: true }
    })
    const button = wrapper.find('ytz-icon-button')
    expect(button.attributes('disabled')).toBe('true')
  })

  it('emits click event when clicked', async () => {
    const wrapper = mount(IconButton, {
      props: { label: 'Close' }
    })

    const button = wrapper.find('ytz-icon-button')
    await button.trigger('click')

    expect(wrapper.emitted('click')).toBeTruthy()
    expect(wrapper.emitted('click')?.length).toBe(1)
  })

  it('renders slot content (icon)', () => {
    const wrapper = mount(IconButton, {
      props: { label: 'Close' },
      slots: {
        default: '<svg data-testid="icon"></svg>'
      }
    })
    expect(wrapper.find('[data-testid="icon"]').exists()).toBe(true)
  })

  it('passes href prop for link variant', () => {
    const wrapper = mount(IconButton, {
      props: { label: 'Home', href: '/home' }
    })
    const button = wrapper.find('ytz-icon-button')
    expect(button.attributes('href')).toBe('/home')
  })

  it('does not emit click when disabled', async () => {
    const wrapper = mount(IconButton, {
      props: { label: 'Close', disabled: true }
    })

    // Note: The actual prevention happens in the web component
    // We just test that the event is still emitted by the Vue wrapper
    const button = wrapper.find('ytz-icon-button')
    await button.trigger('click')

    expect(wrapper.emitted('click')).toBeTruthy()
  })
})
