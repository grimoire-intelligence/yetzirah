import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Select from '../Select.vue'
import SelectOption from '../SelectOption.vue'

describe('Select', () => {
  it('renders with default props', () => {
    const wrapper = mount(Select, {
      slots: {
        default: '<ytz-option value="a">Option A</ytz-option>'
      }
    })
    expect(wrapper.find('ytz-select').exists()).toBe(true)
  })

  it('passes disabled prop to web component', () => {
    const wrapper = mount(Select, {
      props: { disabled: true },
      slots: {
        default: '<ytz-option value="a">Option A</ytz-option>'
      }
    })
    const select = wrapper.find('ytz-select')
    expect(select.attributes('disabled')).toBe('')
  })

  it('passes multiple prop to web component', () => {
    const wrapper = mount(Select, {
      props: { multiple: true },
      slots: {
        default: '<ytz-option value="a">Option A</ytz-option>'
      }
    })
    const select = wrapper.find('ytz-select')
    expect(select.attributes('multiple')).toBe('')
  })

  it('passes placeholder prop to web component', () => {
    const wrapper = mount(Select, {
      props: { placeholder: 'Choose an option...' },
      slots: {
        default: '<ytz-option value="a">Option A</ytz-option>'
      }
    })
    const select = wrapper.find('ytz-select')
    expect(select.attributes('placeholder')).toBe('Choose an option...')
  })

  it('passes open prop to web component', () => {
    const wrapper = mount(Select, {
      props: { open: true },
      slots: {
        default: '<ytz-option value="a">Option A</ytz-option>'
      }
    })
    const select = wrapper.find('ytz-select')
    expect(select.attributes('open')).toBe('')
  })

  it('emits update:modelValue on change event', async () => {
    const wrapper = mount(Select, {
      props: { modelValue: '' },
      slots: {
        default: '<ytz-option value="a">Option A</ytz-option>'
      }
    })

    const select = wrapper.find('ytz-select')
    const changeEvent = new CustomEvent('change', {
      detail: { value: 'a' }
    })
    await select.element.dispatchEvent(changeEvent)

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['a'])
  })

  it('emits change event', async () => {
    const wrapper = mount(Select, {
      slots: {
        default: '<ytz-option value="a">Option A</ytz-option>'
      }
    })

    const select = wrapper.find('ytz-select')
    await select.trigger('change')

    expect(wrapper.emitted('change')).toBeTruthy()
  })

  it('emits open event', async () => {
    const wrapper = mount(Select, {
      slots: {
        default: '<ytz-option value="a">Option A</ytz-option>'
      }
    })

    const select = wrapper.find('ytz-select')
    await select.trigger('open')

    expect(wrapper.emitted('open')).toBeTruthy()
  })

  it('emits close event', async () => {
    const wrapper = mount(Select, {
      slots: {
        default: '<ytz-option value="a">Option A</ytz-option>'
      }
    })

    const select = wrapper.find('ytz-select')
    await select.trigger('close')

    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('emits clear event', async () => {
    const wrapper = mount(Select, {
      slots: {
        default: '<ytz-option value="a">Option A</ytz-option>'
      }
    })

    const select = wrapper.find('ytz-select')
    await select.trigger('clear')

    expect(wrapper.emitted('clear')).toBeTruthy()
  })

  it('supports v-model for single selection', async () => {
    const wrapper = mount(Select, {
      props: {
        modelValue: 'a',
        'onUpdate:modelValue': (value: string) => wrapper.setProps({ modelValue: value })
      },
      slots: {
        default: `
          <ytz-option value="a">Option A</ytz-option>
          <ytz-option value="b">Option B</ytz-option>
        `
      }
    })

    expect(wrapper.props('modelValue')).toBe('a')

    const select = wrapper.find('ytz-select')
    const changeEvent = new CustomEvent('change', {
      detail: { value: 'b' }
    })
    await select.element.dispatchEvent(changeEvent)

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['b'])
  })

  it('supports v-model for multiple selection', async () => {
    const wrapper = mount(Select, {
      props: {
        modelValue: ['a'],
        multiple: true,
        'onUpdate:modelValue': (value: string[]) => wrapper.setProps({ modelValue: value })
      },
      slots: {
        default: `
          <ytz-option value="a">Option A</ytz-option>
          <ytz-option value="b">Option B</ytz-option>
          <ytz-option value="c">Option C</ytz-option>
        `
      }
    })

    expect(wrapper.props('modelValue')).toEqual(['a'])

    const select = wrapper.find('ytz-select')
    const changeEvent = new CustomEvent('change', {
      detail: { value: ['a', 'b'] }
    })
    await select.element.dispatchEvent(changeEvent)

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['a', 'b']])
  })

  it('renders SelectOption children', () => {
    const wrapper = mount(Select, {
      slots: {
        default: `
          <ytz-option value="a">Option A</ytz-option>
          <ytz-option value="b">Option B</ytz-option>
        `
      }
    })

    const options = wrapper.findAll('ytz-option')
    expect(options.length).toBe(2)
  })

  it('forwards additional attributes', () => {
    const wrapper = mount(Select, {
      attrs: {
        'data-testid': 'my-select'
      },
      slots: {
        default: '<ytz-option value="a">Option A</ytz-option>'
      }
    })

    const select = wrapper.find('ytz-select')
    expect(select.attributes('data-testid')).toBe('my-select')
  })
})

describe('SelectOption', () => {
  it('renders with value prop', () => {
    const wrapper = mount(SelectOption, {
      props: { value: 'test' },
      slots: {
        default: 'Test Option'
      }
    })

    expect(wrapper.find('ytz-option').exists()).toBe(true)
    expect(wrapper.find('ytz-option').attributes('value')).toBe('test')
  })

  it('passes selected prop to web component', () => {
    const wrapper = mount(SelectOption, {
      props: { value: 'test', selected: true },
      slots: {
        default: 'Test Option'
      }
    })

    const option = wrapper.find('ytz-option')
    expect(option.attributes('selected')).toBe('')
  })

  it('passes disabled prop to web component', () => {
    const wrapper = mount(SelectOption, {
      props: { value: 'test', disabled: true },
      slots: {
        default: 'Test Option'
      }
    })

    const option = wrapper.find('ytz-option')
    expect(option.attributes('disabled')).toBe('')
  })

  it('renders slot content', () => {
    const wrapper = mount(SelectOption, {
      props: { value: 'test' },
      slots: {
        default: 'Custom Content'
      }
    })

    expect(wrapper.text()).toContain('Custom Content')
  })

  it('forwards additional attributes', () => {
    const wrapper = mount(SelectOption, {
      props: { value: 'test' },
      attrs: {
        'data-testid': 'my-option'
      },
      slots: {
        default: 'Test Option'
      }
    })

    const option = wrapper.find('ytz-option')
    expect(option.attributes('data-testid')).toBe('my-option')
  })
})
