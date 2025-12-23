import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Autocomplete from '../Autocomplete.vue'
import AutocompleteOption from '../AutocompleteOption.vue'

describe('Autocomplete', () => {
  it('renders with default props', () => {
    const wrapper = mount(Autocomplete)
    expect(wrapper.find('ytz-autocomplete').exists()).toBe(true)
  })

  it('passes open prop to web component', () => {
    const wrapper = mount(Autocomplete, {
      props: { open: true }
    })
    const autocomplete = wrapper.find('ytz-autocomplete')
    expect(autocomplete.attributes('open')).toBe('true')
  })

  it('passes multiple prop to web component', () => {
    const wrapper = mount(Autocomplete, {
      props: { multiple: true }
    })
    const autocomplete = wrapper.find('ytz-autocomplete')
    expect(autocomplete.attributes('multiple')).toBe('true')
  })

  it('passes loading prop to web component', () => {
    const wrapper = mount(Autocomplete, {
      props: { loading: true }
    })
    const autocomplete = wrapper.find('ytz-autocomplete')
    expect(autocomplete.attributes('loading')).toBe('true')
  })

  it('passes filter prop to web component', () => {
    const wrapper = mount(Autocomplete, {
      props: { filter: false }
    })
    const autocomplete = wrapper.find('ytz-autocomplete')
    expect(autocomplete.attributes('filter')).toBe('false')
  })

  it('emits update:modelValue on change event with string value', async () => {
    const wrapper = mount(Autocomplete, {
      props: { modelValue: '' }
    })

    const autocomplete = wrapper.find('ytz-autocomplete')
    await autocomplete.trigger('change', {
      detail: { value: 'apple' }
    })

    expect(wrapper.emitted('change')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
  })

  it('emits update:modelValue on change event with array value', async () => {
    const wrapper = mount(Autocomplete, {
      props: { modelValue: [], multiple: true }
    })

    const autocomplete = wrapper.find('ytz-autocomplete')
    await autocomplete.trigger('change', {
      detail: { value: ['apple', 'banana'] }
    })

    expect(wrapper.emitted('change')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
  })

  it('supports v-model binding for single-select', async () => {
    const wrapper = mount(Autocomplete, {
      props: {
        modelValue: '',
        'onUpdate:modelValue': (val: string | string[]) => wrapper.setProps({ modelValue: val })
      }
    })

    expect(wrapper.props('modelValue')).toBe('')

    const autocomplete = wrapper.find('ytz-autocomplete')
    await autocomplete.trigger('change', {
      detail: { value: 'orange' }
    })

    await nextTick()
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
  })

  it('supports v-model binding for multi-select', async () => {
    const wrapper = mount(Autocomplete, {
      props: {
        modelValue: [],
        multiple: true,
        'onUpdate:modelValue': (val: string | string[]) => wrapper.setProps({ modelValue: val })
      }
    })

    expect(wrapper.props('modelValue')).toEqual([])

    const autocomplete = wrapper.find('ytz-autocomplete')
    await autocomplete.trigger('change', {
      detail: { value: ['apple', 'banana'] }
    })

    await nextTick()
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
  })

  it('emits input-change event', async () => {
    const wrapper = mount(Autocomplete)

    const autocomplete = wrapper.find('ytz-autocomplete')
    await autocomplete.trigger('input-change', {
      detail: { value: 'ap' }
    })

    expect(wrapper.emitted('input-change')).toBeTruthy()
  })

  it('emits open event', async () => {
    const wrapper = mount(Autocomplete)

    const autocomplete = wrapper.find('ytz-autocomplete')
    await autocomplete.trigger('open')

    expect(wrapper.emitted('open')).toBeTruthy()
  })

  it('emits close event', async () => {
    const wrapper = mount(Autocomplete)

    const autocomplete = wrapper.find('ytz-autocomplete')
    await autocomplete.trigger('close')

    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('emits clear event and resets modelValue', async () => {
    const wrapper = mount(Autocomplete, {
      props: {
        modelValue: 'apple',
        'onUpdate:modelValue': (val: string | string[]) => wrapper.setProps({ modelValue: val })
      }
    })

    const autocomplete = wrapper.find('ytz-autocomplete')
    await autocomplete.trigger('clear')

    await nextTick()
    expect(wrapper.emitted('clear')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
  })

  it('renders slotted content', () => {
    const wrapper = mount(Autocomplete, {
      slots: {
        default: '<input slot="input" placeholder="Search..." />'
      }
    })

    const autocomplete = wrapper.find('ytz-autocomplete')
    expect(autocomplete.html()).toContain('Search...')
  })

  it('passes through custom attributes', () => {
    const wrapper = mount(Autocomplete, {
      attrs: {
        'data-testid': 'custom-autocomplete',
        'aria-label': 'Search items'
      }
    })

    const autocomplete = wrapper.find('ytz-autocomplete')
    expect(autocomplete.attributes('data-testid')).toBe('custom-autocomplete')
    expect(autocomplete.attributes('aria-label')).toBe('Search items')
  })

  it('passes through custom class', () => {
    const wrapper = mount(Autocomplete, {
      attrs: {
        class: 'custom-class'
      }
    })

    const autocomplete = wrapper.find('ytz-autocomplete')
    expect(autocomplete.classes()).toContain('custom-class')
  })

  it('handles filter prop explicitly set to true', () => {
    const wrapper = mount(Autocomplete, {
      props: { filter: true }
    })
    const autocomplete = wrapper.find('ytz-autocomplete')
    expect(autocomplete.attributes('filter')).toBe('true')
  })
})

describe('AutocompleteOption', () => {
  it('renders with default props', () => {
    const wrapper = mount(AutocompleteOption)
    expect(wrapper.find('ytz-option').exists()).toBe(true)
  })

  it('passes value prop to web component', () => {
    const wrapper = mount(AutocompleteOption, {
      props: { value: 'apple' }
    })
    const option = wrapper.find('ytz-option')
    expect(option.attributes('value')).toBe('apple')
  })

  it('passes disabled prop to web component', () => {
    const wrapper = mount(AutocompleteOption, {
      props: { disabled: true }
    })
    const option = wrapper.find('ytz-option')
    expect(option.attributes('disabled')).toBe('true')
  })

  it('passes selected prop to web component', () => {
    const wrapper = mount(AutocompleteOption, {
      props: { selected: true }
    })
    const option = wrapper.find('ytz-option')
    expect(option.attributes('selected')).toBe('true')
  })

  it('renders slotted content', () => {
    const wrapper = mount(AutocompleteOption, {
      props: { value: 'test' },
      slots: {
        default: 'Test Option'
      }
    })

    const option = wrapper.find('ytz-option')
    expect(option.text()).toBe('Test Option')
  })

  it('passes through custom attributes', () => {
    const wrapper = mount(AutocompleteOption, {
      attrs: {
        'data-testid': 'custom-option',
        'aria-label': 'Select this option'
      }
    })

    const option = wrapper.find('ytz-option')
    expect(option.attributes('data-testid')).toBe('custom-option')
    expect(option.attributes('aria-label')).toBe('Select this option')
  })

  it('passes through custom class', () => {
    const wrapper = mount(AutocompleteOption, {
      attrs: {
        class: 'custom-option-class'
      }
    })

    const option = wrapper.find('ytz-option')
    expect(option.classes()).toContain('custom-option-class')
  })

  it('can be used within Autocomplete component', () => {
    const wrapper = mount(Autocomplete, {
      slots: {
        default: `
          <input slot="input" placeholder="Search..." />
          <ytz-option value="apple">Apple</ytz-option>
          <ytz-option value="banana">Banana</ytz-option>
        `
      }
    })

    const autocomplete = wrapper.find('ytz-autocomplete')
    expect(autocomplete.html()).toContain('Apple')
    expect(autocomplete.html()).toContain('Banana')
  })
})
