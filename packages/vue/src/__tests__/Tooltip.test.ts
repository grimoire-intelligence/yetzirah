import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Tooltip from '../Tooltip.vue'

describe('Tooltip', () => {
  it('renders with default props', () => {
    const wrapper = mount(Tooltip, {
      slots: {
        default: '<button>Trigger</button>',
        content: 'Tooltip text'
      }
    })
    expect(wrapper.find('ytz-tooltip').exists()).toBe(true)
  })

  it('passes placement prop to web component', () => {
    const wrapper = mount(Tooltip, {
      props: { placement: 'bottom' },
      slots: {
        default: '<button>Trigger</button>',
        content: 'Tooltip text'
      }
    })
    const tooltip = wrapper.find('ytz-tooltip')
    expect(tooltip.attributes('placement')).toBe('bottom')
  })

  it('passes delay prop to web component', () => {
    const wrapper = mount(Tooltip, {
      props: { delay: 200 },
      slots: {
        default: '<button>Trigger</button>',
        content: 'Tooltip text'
      }
    })
    const tooltip = wrapper.find('ytz-tooltip')
    expect(tooltip.attributes('delay')).toBe('200')
  })

  it('passes offset prop to web component', () => {
    const wrapper = mount(Tooltip, {
      props: { offset: 12 },
      slots: {
        default: '<button>Trigger</button>',
        content: 'Tooltip text'
      }
    })
    const tooltip = wrapper.find('ytz-tooltip')
    expect(tooltip.attributes('offset')).toBe('12')
  })

  it('renders content prop as tooltip text', () => {
    const wrapper = mount(Tooltip, {
      props: { content: 'Simple tooltip' },
      slots: {
        default: '<button>Trigger</button>'
      }
    })
    expect(wrapper.text()).toContain('Simple tooltip')
    expect(wrapper.find('[slot="content"]').exists()).toBe(true)
  })

  it('renders content slot for rich content', () => {
    const wrapper = mount(Tooltip, {
      slots: {
        default: '<button>Trigger</button>',
        content: '<strong>Rich</strong> content'
      }
    })
    // Content slot is rendered as part of the template
    expect(wrapper.html()).toContain('<strong>Rich</strong>')
    expect(wrapper.html()).toContain('content')
  })

  it('applies contentClass to content span when using content prop', () => {
    const wrapper = mount(Tooltip, {
      props: {
        content: 'Styled tooltip',
        contentClass: 'custom-class'
      },
      slots: {
        default: '<button>Trigger</button>'
      }
    })
    const contentSpan = wrapper.find('[slot="content"]')
    expect(contentSpan.classes()).toContain('custom-class')
  })

  it('emits show event when tooltip shows', async () => {
    const wrapper = mount(Tooltip, {
      props: { content: 'Tooltip' },
      slots: {
        default: '<button>Trigger</button>'
      }
    })

    const tooltip = wrapper.find('ytz-tooltip')
    await tooltip.trigger('show')

    expect(wrapper.emitted('show')).toBeTruthy()
    expect(wrapper.emitted('show')?.length).toBe(1)
  })

  it('emits hide event when tooltip hides', async () => {
    const wrapper = mount(Tooltip, {
      props: { content: 'Tooltip' },
      slots: {
        default: '<button>Trigger</button>'
      }
    })

    const tooltip = wrapper.find('ytz-tooltip')
    await tooltip.trigger('hide')

    expect(wrapper.emitted('hide')).toBeTruthy()
    expect(wrapper.emitted('hide')?.length).toBe(1)
  })

  it('renders trigger element in default slot', () => {
    const wrapper = mount(Tooltip, {
      props: { content: 'Tooltip' },
      slots: {
        default: '<button id="trigger">Hover me</button>'
      }
    })
    expect(wrapper.find('#trigger').exists()).toBe(true)
    expect(wrapper.text()).toContain('Hover me')
  })

  it('forwards additional attributes', () => {
    const wrapper = mount(Tooltip, {
      props: { content: 'Tooltip' },
      attrs: {
        'data-testid': 'my-tooltip'
      },
      slots: {
        default: '<button>Trigger</button>'
      }
    })
    const tooltip = wrapper.find('ytz-tooltip')
    expect(tooltip.attributes('data-testid')).toBe('my-tooltip')
  })

  it('supports all placement options', () => {
    const placements: Array<'top' | 'bottom' | 'left' | 'right'> = ['top', 'bottom', 'left', 'right']

    placements.forEach(placement => {
      const wrapper = mount(Tooltip, {
        props: { placement, content: 'Tooltip' },
        slots: {
          default: '<button>Trigger</button>'
        }
      })
      const tooltip = wrapper.find('ytz-tooltip')
      expect(tooltip.attributes('placement')).toBe(placement)
    })
  })
})
