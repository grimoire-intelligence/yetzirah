import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ThemeToggle from '../ThemeToggle.vue'

describe('ThemeToggle', () => {
  it('renders with default props', () => {
    const wrapper = mount(ThemeToggle)
    expect(wrapper.find('ytz-theme-toggle').exists()).toBe(true)
  })

  it('passes storageKey prop to web component', () => {
    const wrapper = mount(ThemeToggle, {
      props: { storageKey: 'my-app-theme' }
    })
    const toggle = wrapper.find('ytz-theme-toggle')
    expect(toggle.attributes('storage-key')).toBe('my-app-theme')
  })

  it('passes noPersist prop to web component', () => {
    const wrapper = mount(ThemeToggle, {
      props: { noPersist: true }
    })
    const toggle = wrapper.find('ytz-theme-toggle')
    expect(toggle.attributes('no-persist')).toBeDefined()
  })

  it('emits themechange event', async () => {
    const wrapper = mount(ThemeToggle)

    const toggle = wrapper.find('ytz-theme-toggle')
    await toggle.trigger('themechange', {
      detail: { theme: 'dark', isDark: true }
    })

    expect(wrapper.emitted('themechange')).toBeTruthy()
    expect(wrapper.emitted('themechange')?.length).toBe(1)
  })

  it('renders slot content', () => {
    const wrapper = mount(ThemeToggle, {
      slots: {
        default: 'Toggle theme'
      }
    })
    expect(wrapper.text()).toContain('Toggle theme')
  })

  it('does not persist when noPersist is true', () => {
    const wrapper = mount(ThemeToggle, {
      props: { noPersist: true }
    })
    const toggle = wrapper.find('ytz-theme-toggle')
    expect(toggle.attributes('no-persist')).toBeDefined()
  })

  it('uses custom storage key', () => {
    const wrapper = mount(ThemeToggle, {
      props: { storageKey: 'custom-key' }
    })
    const toggle = wrapper.find('ytz-theme-toggle')
    expect(toggle.attributes('storage-key')).toBe('custom-key')
  })

  it('forwards additional attributes', () => {
    const wrapper = mount(ThemeToggle, {
      attrs: {
        'data-testid': 'theme-toggle'
      }
    })
    const toggle = wrapper.find('ytz-theme-toggle')
    expect(toggle.attributes('data-testid')).toBe('theme-toggle')
  })
})
