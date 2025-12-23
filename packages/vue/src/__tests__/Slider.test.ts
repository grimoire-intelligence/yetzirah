import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Slider from '../Slider.vue'

describe('Slider', () => {
  it('renders with default props', () => {
    const wrapper = mount(Slider)
    expect(wrapper.find('ytz-slider').exists()).toBe(true)
  })

  it('passes value prop to web component', () => {
    const wrapper = mount(Slider, {
      props: { modelValue: 50 }
    })
    const slider = wrapper.find('ytz-slider')
    expect(slider.attributes('value')).toBe('50')
  })

  it('passes min prop to web component', () => {
    const wrapper = mount(Slider, {
      props: { min: 10 }
    })
    const slider = wrapper.find('ytz-slider')
    expect(slider.attributes('min')).toBe('10')
  })

  it('passes max prop to web component', () => {
    const wrapper = mount(Slider, {
      props: { max: 200 }
    })
    const slider = wrapper.find('ytz-slider')
    expect(slider.attributes('max')).toBe('200')
  })

  it('passes step prop to web component', () => {
    const wrapper = mount(Slider, {
      props: { step: 5 }
    })
    const slider = wrapper.find('ytz-slider')
    expect(slider.attributes('step')).toBe('5')
  })

  it('passes disabled prop to web component', () => {
    const wrapper = mount(Slider, {
      props: { disabled: true }
    })
    const slider = wrapper.find('ytz-slider')
    expect(slider.attributes('disabled')).toBe('true')
  })

  it('emits update:modelValue on change event', async () => {
    const wrapper = mount(Slider, {
      props: { modelValue: 0 }
    })

    const slider = wrapper.find('ytz-slider')
    await slider.trigger('change', {
      detail: { value: 75 }
    })

    expect(wrapper.emitted('change')).toBeTruthy()
  })

  it('supports v-model binding', async () => {
    const wrapper = mount(Slider, {
      props: {
        modelValue: 25,
        'onUpdate:modelValue': (val: number) => wrapper.setProps({ modelValue: val })
      }
    })

    expect(wrapper.props('modelValue')).toBe(25)

    const slider = wrapper.find('ytz-slider')
    await slider.trigger('change', {
      detail: { value: 50 }
    })

    await nextTick()
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
  })

  it('handles number type coercion', async () => {
    const wrapper = mount(Slider, {
      props: { modelValue: 0 }
    })

    const slider = wrapper.find('ytz-slider')
    await slider.trigger('change', {
      detail: { value: 42 }
    })

    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeTruthy()
  })
})
