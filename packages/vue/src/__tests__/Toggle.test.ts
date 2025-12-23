import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Toggle from '../Toggle.vue'

describe('Toggle', () => {
  it('renders with default props', () => {
    const wrapper = mount(Toggle)
    expect(wrapper.find('ytz-toggle').exists()).toBe(true)
  })

  it('passes checked prop to web component', async () => {
    const wrapper = mount(Toggle, {
      props: { checked: true }
    })
    const toggle = wrapper.find('ytz-toggle')
    expect(toggle.attributes('checked')).toBe('true')
  })

  it('passes disabled prop to web component', () => {
    const wrapper = mount(Toggle, {
      props: { disabled: true }
    })
    const toggle = wrapper.find('ytz-toggle')
    expect(toggle.attributes('disabled')).toBe('true')
  })

  it('emits update:checked on change event', async () => {
    const wrapper = mount(Toggle, {
      props: { checked: false }
    })

    const toggle = wrapper.find('ytz-toggle')
    await toggle.trigger('change', {
      detail: { checked: true }
    })

    expect(wrapper.emitted('change')).toBeTruthy()
  })

  it('renders slot content', () => {
    const wrapper = mount(Toggle, {
      slots: {
        default: 'Enable notifications'
      }
    })
    expect(wrapper.text()).toContain('Enable notifications')
  })

  it('supports v-model:checked binding', async () => {
    const wrapper = mount(Toggle, {
      props: {
        checked: false,
        'onUpdate:checked': (val: boolean) => wrapper.setProps({ checked: val })
      }
    })

    expect(wrapper.props('checked')).toBe(false)

    // Simulate change event from web component
    const toggle = wrapper.find('ytz-toggle')
    await toggle.trigger('change', {
      detail: { checked: true }
    })

    await nextTick()
    expect(wrapper.emitted('update:checked')).toBeTruthy()
  })
})
