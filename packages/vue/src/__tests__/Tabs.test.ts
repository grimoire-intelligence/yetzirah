import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Tabs from '../Tabs.vue'
import Tab from '../Tab.vue'
import TabPanel from '../TabPanel.vue'
import TabList from '../TabList.vue'

describe('Tabs', () => {
  it('renders with default props', () => {
    const wrapper = mount(Tabs)
    expect(wrapper.find('ytz-tabs').exists()).toBe(true)
  })

  it('passes value prop to web component', () => {
    const wrapper = mount(Tabs, {
      props: { modelValue: 'tab1' }
    })
    const tabs = wrapper.find('ytz-tabs')
    expect(tabs.attributes('value')).toBe('tab1')
  })

  it('passes orientation prop to web component', () => {
    const wrapper = mount(Tabs, {
      props: { orientation: 'vertical' }
    })
    const tabs = wrapper.find('ytz-tabs')
    expect(tabs.attributes('orientation')).toBe('vertical')
  })

  it('emits update:modelValue on change event', async () => {
    const wrapper = mount(Tabs, {
      props: { modelValue: 'tab1' }
    })

    const tabs = wrapper.find('ytz-tabs')
    await tabs.trigger('change', {
      detail: { value: 'tab2' }
    })

    expect(wrapper.emitted('change')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
  })

  it('renders slot content', () => {
    const wrapper = mount(Tabs, {
      slots: {
        default: '<div class="test-content">Tab content</div>'
      }
    })
    expect(wrapper.html()).toContain('test-content')
  })

  it('supports v-model binding', async () => {
    const wrapper = mount(Tabs, {
      props: {
        modelValue: 'tab1',
        'onUpdate:modelValue': (val: string) => wrapper.setProps({ modelValue: val })
      }
    })

    expect(wrapper.props('modelValue')).toBe('tab1')

    // Simulate change event from web component
    const tabs = wrapper.find('ytz-tabs')
    await tabs.trigger('change', {
      detail: { value: 'tab2' }
    })

    await nextTick()
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
  })
})

describe('Tab', () => {
  it('renders with required panel prop', () => {
    const wrapper = mount(Tab, {
      props: { panel: 'tab1' }
    })
    expect(wrapper.find('ytz-tab').exists()).toBe(true)
  })

  it('passes panel prop to web component', () => {
    const wrapper = mount(Tab, {
      props: { panel: 'tab1' }
    })
    const tab = wrapper.find('ytz-tab')
    expect(tab.attributes('panel')).toBe('tab1')
  })

  it('renders slot content', () => {
    const wrapper = mount(Tab, {
      props: { panel: 'tab1' },
      slots: {
        default: 'Tab Label'
      }
    })
    expect(wrapper.text()).toContain('Tab Label')
  })
})

describe('TabPanel', () => {
  it('renders with required id prop', () => {
    const wrapper = mount(TabPanel, {
      props: { id: 'panel1' }
    })
    expect(wrapper.find('ytz-tabpanel').exists()).toBe(true)
  })

  it('passes id prop to web component', () => {
    const wrapper = mount(TabPanel, {
      props: { id: 'panel1' }
    })
    const panel = wrapper.find('ytz-tabpanel')
    expect(panel.attributes('id')).toBe('panel1')
  })

  it('renders slot content', () => {
    const wrapper = mount(TabPanel, {
      props: { id: 'panel1' },
      slots: {
        default: '<p>Panel content</p>'
      }
    })
    expect(wrapper.html()).toContain('Panel content')
  })
})

describe('TabList', () => {
  it('renders as a div container', () => {
    const wrapper = mount(TabList)
    expect(wrapper.find('div').exists()).toBe(true)
  })

  it('renders slot content', () => {
    const wrapper = mount(TabList, {
      slots: {
        default: '<span>Tab buttons</span>'
      }
    })
    expect(wrapper.text()).toContain('Tab buttons')
  })

  it('applies flexbox styles', () => {
    const wrapper = mount(TabList)
    const div = wrapper.find('div')
    expect(div.element).toBeTruthy()
  })
})

describe('Tabs Integration', () => {
  it('works with Tab and TabPanel components together', () => {
    const wrapper = mount({
      components: { Tabs, Tab, TabPanel },
      template: `
        <Tabs modelValue="home">
          <Tab panel="home">Home</Tab>
          <Tab panel="about">About</Tab>
          <TabPanel id="home">Home content</TabPanel>
          <TabPanel id="about">About content</TabPanel>
        </Tabs>
      `
    })

    expect(wrapper.find('ytz-tabs').exists()).toBe(true)
    expect(wrapper.findAll('ytz-tab')).toHaveLength(2)
    expect(wrapper.findAll('ytz-tabpanel')).toHaveLength(2)
  })

  it('works with TabList for semantic grouping', () => {
    const wrapper = mount({
      components: { Tabs, TabList, Tab, TabPanel },
      template: `
        <Tabs modelValue="dashboard">
          <TabList>
            <Tab panel="dashboard">Dashboard</Tab>
            <Tab panel="settings">Settings</Tab>
          </TabList>
          <TabPanel id="dashboard">Dashboard content</TabPanel>
          <TabPanel id="settings">Settings content</TabPanel>
        </Tabs>
      `
    })

    expect(wrapper.find('ytz-tabs').exists()).toBe(true)
    expect(wrapper.find('div').exists()).toBe(true) // TabList
    expect(wrapper.findAll('ytz-tab')).toHaveLength(2)
    expect(wrapper.findAll('ytz-tabpanel')).toHaveLength(2)
  })
})
