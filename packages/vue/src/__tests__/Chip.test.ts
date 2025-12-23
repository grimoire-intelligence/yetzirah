import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Chip from '../Chip.vue'

describe('Chip', () => {
  it('renders with default props', () => {
    const wrapper = mount(Chip)
    expect(wrapper.find('ytz-chip').exists()).toBe(true)
  })

  it('passes deletable prop to web component', () => {
    const wrapper = mount(Chip, {
      props: { deletable: true }
    })
    const chip = wrapper.find('ytz-chip')
    expect(chip.attributes('deletable')).toBeDefined()
  })

  it('passes disabled prop to web component', () => {
    const wrapper = mount(Chip, {
      props: { disabled: true }
    })
    const chip = wrapper.find('ytz-chip')
    expect(chip.attributes('disabled')).toBeDefined()
  })

  it('emits delete event when chip is deleted', async () => {
    const wrapper = mount(Chip, {
      props: { deletable: true }
    })

    const chip = wrapper.find('ytz-chip')
    await chip.trigger('delete')

    expect(wrapper.emitted('delete')).toBeTruthy()
    expect(wrapper.emitted('delete')?.length).toBe(1)
  })

  it('renders slot content', () => {
    const wrapper = mount(Chip, {
      slots: {
        default: 'JavaScript'
      }
    })
    expect(wrapper.text()).toContain('JavaScript')
  })

  it('does not show delete button when deletable is false', () => {
    const wrapper = mount(Chip, {
      props: { deletable: false }
    })
    const chip = wrapper.find('ytz-chip')
    expect(chip.attributes('deletable')).toBeUndefined()
  })

  it('forwards additional attributes', () => {
    const wrapper = mount(Chip, {
      attrs: {
        'data-testid': 'my-chip'
      }
    })
    const chip = wrapper.find('ytz-chip')
    expect(chip.attributes('data-testid')).toBe('my-chip')
  })
})
