import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Dialog from '../Dialog.vue'

describe('Dialog', () => {
  it('renders with default props', () => {
    const wrapper = mount(Dialog)
    expect(wrapper.find('ytz-dialog').exists()).toBe(true)
  })

  it('passes open prop to web component', async () => {
    const wrapper = mount(Dialog, {
      props: { open: true }
    })
    const dialog = wrapper.find('ytz-dialog')
    expect(dialog.attributes('open')).toBe('true')
  })

  it('passes static prop to web component', () => {
    const wrapper = mount(Dialog, {
      props: { static: true }
    })
    const dialog = wrapper.find('ytz-dialog')
    expect(dialog.attributes('static')).toBe('true')
  })

  it('emits update:open on close event', async () => {
    const wrapper = mount(Dialog, {
      props: { open: true }
    })

    const dialog = wrapper.find('ytz-dialog')
    await dialog.trigger('close')

    expect(wrapper.emitted('close')).toBeTruthy()
    expect(wrapper.emitted('update:open')).toBeTruthy()
  })

  it('renders slot content', () => {
    const wrapper = mount(Dialog, {
      slots: {
        default: '<h2>Dialog Title</h2><p>Dialog Content</p>'
      }
    })
    expect(wrapper.html()).toContain('Dialog Title')
    expect(wrapper.html()).toContain('Dialog Content')
  })

  it('supports v-model:open binding', async () => {
    const wrapper = mount(Dialog, {
      props: {
        open: true,
        'onUpdate:open': (val: boolean) => wrapper.setProps({ open: val })
      }
    })

    expect(wrapper.props('open')).toBe(true)

    // Simulate close event from web component
    const dialog = wrapper.find('ytz-dialog')
    await dialog.trigger('close')

    await nextTick()
    expect(wrapper.emitted('update:open')).toBeTruthy()
    const emitted = wrapper.emitted('update:open')
    if (emitted) {
      expect(emitted[0]).toEqual([false])
    }
  })

  it('opens when v-model:open is set to true', async () => {
    const wrapper = mount(Dialog, {
      props: { open: false }
    })

    expect(wrapper.find('ytz-dialog').attributes('open')).toBeUndefined()

    await wrapper.setProps({ open: true })

    expect(wrapper.find('ytz-dialog').attributes('open')).toBe('true')
  })

  it('closes when v-model:open is set to false', async () => {
    const wrapper = mount(Dialog, {
      props: { open: true }
    })

    expect(wrapper.find('ytz-dialog').attributes('open')).toBe('true')

    await wrapper.setProps({ open: false })

    expect(wrapper.find('ytz-dialog').attributes('open')).toBeUndefined()
  })
})
