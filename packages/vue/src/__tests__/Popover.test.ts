import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Popover from '../Popover.vue'

describe('Popover', () => {
  it('renders with default props', () => {
    const wrapper = mount(Popover, {
      slots: {
        default: '<button>Trigger</button><div slot="content">Popover content</div>'
      }
    })
    expect(wrapper.find('ytz-popover').exists()).toBe(true)
  })

  it('passes open prop to web component', () => {
    const wrapper = mount(Popover, {
      props: { open: true },
      slots: {
        default: '<button>Trigger</button><div slot="content">Content</div>'
      }
    })
    const popover = wrapper.find('ytz-popover')
    expect(popover.attributes('open')).toBe('true')
  })

  it('passes placement prop to web component', () => {
    const wrapper = mount(Popover, {
      props: { placement: 'top' },
      slots: {
        default: '<button>Trigger</button><div slot="content">Content</div>'
      }
    })
    const popover = wrapper.find('ytz-popover')
    expect(popover.attributes('placement')).toBe('top')
  })

  it('passes offset prop to web component', () => {
    const wrapper = mount(Popover, {
      props: { offset: 12 },
      slots: {
        default: '<button>Trigger</button><div slot="content">Content</div>'
      }
    })
    const popover = wrapper.find('ytz-popover')
    expect(popover.attributes('offset')).toBe('12')
  })

  it('emits update:open on show event', async () => {
    const wrapper = mount(Popover, {
      props: { open: false },
      slots: {
        default: '<button>Trigger</button><div slot="content">Content</div>'
      }
    })

    const popover = wrapper.find('ytz-popover')
    await popover.trigger('show')

    expect(wrapper.emitted('update:open')).toBeTruthy()
    expect(wrapper.emitted('update:open')?.[0]).toEqual([true])
    expect(wrapper.emitted('show')).toBeTruthy()
  })

  it('emits update:open on hide event', async () => {
    const wrapper = mount(Popover, {
      props: { open: true },
      slots: {
        default: '<button>Trigger</button><div slot="content">Content</div>'
      }
    })

    const popover = wrapper.find('ytz-popover')
    await popover.trigger('hide')

    expect(wrapper.emitted('update:open')).toBeTruthy()
    expect(wrapper.emitted('update:open')?.[0]).toEqual([false])
    expect(wrapper.emitted('hide')).toBeTruthy()
  })

  it('supports v-model:open binding', async () => {
    const wrapper = mount(Popover, {
      props: {
        open: false,
        'onUpdate:open': (val: boolean) => wrapper.setProps({ open: val })
      },
      slots: {
        default: '<button>Trigger</button><div slot="content">Content</div>'
      }
    })

    expect(wrapper.props('open')).toBe(false)

    // Simulate show event from web component
    const popover = wrapper.find('ytz-popover')
    await popover.trigger('show')

    await nextTick()
    expect(wrapper.emitted('update:open')).toBeTruthy()
    expect(wrapper.emitted('update:open')?.[0]).toEqual([true])
  })

  it('renders slot content', () => {
    const wrapper = mount(Popover, {
      slots: {
        default: '<button id="trigger">Open menu</button><div slot="content" id="content">Menu items</div>'
      }
    })
    expect(wrapper.find('#trigger').exists()).toBe(true)
    expect(wrapper.find('#content').exists()).toBe(true)
    expect(wrapper.text()).toContain('Open menu')
    expect(wrapper.text()).toContain('Menu items')
  })

  it('supports all placement options', () => {
    const placements: Array<'top' | 'bottom' | 'left' | 'right'> = ['top', 'bottom', 'left', 'right']

    placements.forEach(placement => {
      const wrapper = mount(Popover, {
        props: { placement },
        slots: {
          default: '<button>Trigger</button><div slot="content">Content</div>'
        }
      })
      const popover = wrapper.find('ytz-popover')
      expect(popover.attributes('placement')).toBe(placement)
    })
  })

  it('forwards additional attributes', () => {
    const wrapper = mount(Popover, {
      attrs: {
        'data-testid': 'my-popover'
      },
      slots: {
        default: '<button>Trigger</button><div slot="content">Content</div>'
      }
    })
    const popover = wrapper.find('ytz-popover')
    expect(popover.attributes('data-testid')).toBe('my-popover')
  })

  it('applies class attribute to web component', () => {
    const wrapper = mount(Popover, {
      attrs: {
        class: 'custom-class'
      },
      slots: {
        default: '<button>Trigger</button><div slot="content">Content</div>'
      }
    })
    const popover = wrapper.find('ytz-popover')
    expect(popover.classes()).toContain('custom-class')
  })

  it('handles interactive content in popover', () => {
    const wrapper = mount(Popover, {
      slots: {
        default: `
          <button>Settings</button>
          <div slot="content">
            <label><input type="checkbox"> Enable notifications</label>
            <button>Save</button>
          </div>
        `
      }
    })
    expect(wrapper.find('input[type="checkbox"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Enable notifications')
    expect(wrapper.text()).toContain('Save')
  })
})
