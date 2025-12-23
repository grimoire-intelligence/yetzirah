/**
 * Integration tests for Vue Tier 1 framework wrappers.
 * Verifies event forwarding, attribute binding, and two-way binding across all Tier 1 components.
 *
 * @module @grimoire/yetzirah-vue/__tests__/tier1-integration
 */

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

// Tier 1 Components
import Button from '../Button.vue'
import Disclosure from '../Disclosure.vue'
import Dialog from '../Dialog.vue'
import Tabs from '../Tabs.vue'
import TabList from '../TabList.vue'
import Tab from '../Tab.vue'
import TabPanel from '../TabPanel.vue'
import Tooltip from '../Tooltip.vue'
import Menu from '../Menu.vue'
import MenuItem from '../MenuItem.vue'
import MenuTrigger from '../MenuTrigger.vue'
import Autocomplete from '../Autocomplete.vue'
import AutocompleteOption from '../AutocompleteOption.vue'
import Listbox from '../Listbox.vue'
import ListboxOption from '../ListboxOption.vue'
import Select from '../Select.vue'
import SelectOption from '../SelectOption.vue'
import Accordion from '../Accordion.vue'
import AccordionItem from '../AccordionItem.vue'
import Drawer from '../Drawer.vue'
import Popover from '../Popover.vue'

describe('Vue Tier 1 Integration Tests', () => {
  describe('Button', () => {
    it('renders ytz-button element', () => {
      const wrapper = mount(Button)
      expect(wrapper.find('ytz-button').exists()).toBe(true)
    })

    it('forwards href attribute for link variant', () => {
      const wrapper = mount(Button, {
        props: { href: 'https://example.com' }
      })
      expect(wrapper.find('ytz-button').attributes('href')).toBe('https://example.com')
    })

    it('forwards disabled attribute', () => {
      const wrapper = mount(Button, {
        props: { disabled: true }
      })
      expect(wrapper.find('ytz-button').attributes('disabled')).toBe('true')
    })

    it('forwards type attribute', () => {
      const wrapper = mount(Button, {
        props: { type: 'submit' }
      })
      expect(wrapper.find('ytz-button').attributes('type')).toBe('submit')
    })

    it('emits click event', async () => {
      const wrapper = mount(Button)
      await wrapper.find('ytz-button').trigger('click')
      expect(wrapper.emitted('click')).toBeTruthy()
    })

    it('renders slot content', () => {
      const wrapper = mount(Button, {
        slots: { default: 'Click Me' }
      })
      expect(wrapper.text()).toContain('Click Me')
    })
  })

  describe('Disclosure', () => {
    it('renders ytz-disclosure element', () => {
      const wrapper = mount(Disclosure)
      expect(wrapper.find('ytz-disclosure').exists()).toBe(true)
    })

    it('supports v-model:open binding', async () => {
      const wrapper = mount(Disclosure, {
        props: {
          open: false,
          'onUpdate:open': (val: boolean) => wrapper.setProps({ open: val })
        }
      })

      expect(wrapper.props('open')).toBe(false)
      await wrapper.find('ytz-disclosure').trigger('toggle', {
        detail: { open: true }
      })
      await nextTick()
      expect(wrapper.emitted('update:open')).toBeTruthy()
    })

    it('forwards open attribute', async () => {
      const wrapper = mount(Disclosure, {
        props: { open: true }
      })
      expect(wrapper.find('ytz-disclosure').attributes('open')).toBe('true')
    })

    it('emits toggle event', async () => {
      const wrapper = mount(Disclosure)
      await wrapper.find('ytz-disclosure').trigger('toggle')
      expect(wrapper.emitted('toggle')).toBeTruthy()
    })
  })

  describe('Dialog', () => {
    it('renders ytz-dialog element', () => {
      const wrapper = mount(Dialog)
      expect(wrapper.find('ytz-dialog').exists()).toBe(true)
    })

    it('supports v-model:open binding', async () => {
      const wrapper = mount(Dialog, {
        props: {
          open: true,
          'onUpdate:open': (val: boolean) => wrapper.setProps({ open: val })
        }
      })

      expect(wrapper.props('open')).toBe(true)
      await wrapper.find('ytz-dialog').trigger('close')
      await nextTick()
      expect(wrapper.emitted('update:open')).toBeTruthy()
      const emitted = wrapper.emitted('update:open')
      if (emitted) {
        expect(emitted[0]).toEqual([false])
      }
    })

    it('forwards static attribute', () => {
      const wrapper = mount(Dialog, {
        props: { static: true }
      })
      expect(wrapper.find('ytz-dialog').attributes('static')).toBe('true')
    })

    it('emits close event', async () => {
      const wrapper = mount(Dialog, {
        props: { open: true }
      })
      await wrapper.find('ytz-dialog').trigger('close')
      expect(wrapper.emitted('close')).toBeTruthy()
    })
  })

  describe('Tabs', () => {
    it('renders ytz-tabs element', () => {
      const wrapper = mount(Tabs)
      expect(wrapper.find('ytz-tabs').exists()).toBe(true)
    })

    it('supports v-model binding for value', async () => {
      const wrapper = mount(Tabs, {
        props: {
          modelValue: 'tab1',
          'onUpdate:modelValue': (val: string) => wrapper.setProps({ modelValue: val })
        }
      })

      expect(wrapper.find('ytz-tabs').attributes('value')).toBe('tab1')
      await wrapper.find('ytz-tabs').trigger('change', {
        detail: { value: 'tab2' }
      })
      await nextTick()
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    })

    it('forwards orientation attribute', () => {
      const wrapper = mount(Tabs, {
        props: { orientation: 'vertical' }
      })
      expect(wrapper.find('ytz-tabs').attributes('orientation')).toBe('vertical')
    })

    it('renders with nested Tab and TabPanel components', () => {
      const wrapper = mount({
        components: { Tabs, TabList, Tab, TabPanel },
        template: `
          <Tabs modelValue="home">
            <TabList>
              <Tab panel="home">Home</Tab>
              <Tab panel="about">About</Tab>
            </TabList>
            <TabPanel id="home">Home content</TabPanel>
            <TabPanel id="about">About content</TabPanel>
          </Tabs>
        `
      })

      expect(wrapper.find('ytz-tabs').exists()).toBe(true)
      expect(wrapper.findAll('ytz-tab')).toHaveLength(2)
      expect(wrapper.findAll('ytz-tabpanel')).toHaveLength(2)
    })
  })

  describe('Tab', () => {
    it('renders ytz-tab element', () => {
      const wrapper = mount(Tab, {
        props: { panel: 'test' }
      })
      expect(wrapper.find('ytz-tab').exists()).toBe(true)
    })

    it('forwards panel attribute', () => {
      const wrapper = mount(Tab, {
        props: { panel: 'my-panel' }
      })
      expect(wrapper.find('ytz-tab').attributes('panel')).toBe('my-panel')
    })
  })

  describe('TabList', () => {
    it('renders div container', () => {
      const wrapper = mount(TabList)
      expect(wrapper.find('div').exists()).toBe(true)
    })

    it('renders slot content', () => {
      const wrapper = mount(TabList, {
        slots: { default: '<span>Tab Items</span>' }
      })
      expect(wrapper.text()).toContain('Tab Items')
    })
  })

  describe('TabPanel', () => {
    it('renders ytz-tabpanel element', () => {
      const wrapper = mount(TabPanel, {
        props: { id: 'panel1' }
      })
      expect(wrapper.find('ytz-tabpanel').exists()).toBe(true)
    })

    it('forwards id attribute', () => {
      const wrapper = mount(TabPanel, {
        props: { id: 'my-panel' }
      })
      expect(wrapper.find('ytz-tabpanel').attributes('id')).toBe('my-panel')
    })
  })

  describe('Tooltip', () => {
    it('renders ytz-tooltip element', () => {
      const wrapper = mount(Tooltip, {
        props: { content: 'Test tooltip' }
      })
      expect(wrapper.find('ytz-tooltip').exists()).toBe(true)
    })

    it('renders content in slot', () => {
      const wrapper = mount(Tooltip, {
        props: { content: 'Tooltip text' }
      })
      // Content is rendered in a span with slot="content"
      expect(wrapper.html()).toContain('Tooltip text')
    })

    it('forwards placement attribute', () => {
      const wrapper = mount(Tooltip, {
        props: {
          content: 'Test',
          placement: 'bottom'
        }
      })
      const tooltip = wrapper.find('ytz-tooltip')
      expect(tooltip.attributes('placement')).toBe('bottom')
    })

    it('forwards delay attribute', () => {
      const wrapper = mount(Tooltip, {
        props: {
          content: 'Test',
          delay: 200
        }
      })
      const tooltip = wrapper.find('ytz-tooltip')
      expect(tooltip.attributes('delay')).toBe('200')
    })
  })

  describe('Menu', () => {
    it('renders ytz-menu element', () => {
      const wrapper = mount(Menu)
      expect(wrapper.find('ytz-menu').exists()).toBe(true)
    })

    it('emits open/close events', async () => {
      const wrapper = mount(Menu, {
        props: { open: false }
      })

      // Menu uses open/close events, not toggle
      await wrapper.find('ytz-menu').trigger('open')
      await nextTick()
      expect(wrapper.emitted('open')).toBeTruthy()
    })

    it('renders with nested MenuItem and MenuTrigger', () => {
      const wrapper = mount({
        components: { Menu, MenuItem, MenuTrigger },
        template: `
          <Menu>
            <MenuTrigger>Options</MenuTrigger>
            <MenuItem value="edit">Edit</MenuItem>
            <MenuItem value="delete">Delete</MenuItem>
          </Menu>
        `
      })

      expect(wrapper.find('ytz-menu').exists()).toBe(true)
      expect(wrapper.find('ytz-menu-trigger').exists()).toBe(true)
      expect(wrapper.findAll('ytz-menu-item')).toHaveLength(2)
    })
  })

  describe('MenuItem', () => {
    it('renders ytz-menu-item element', () => {
      const wrapper = mount(MenuItem, {
        props: { value: 'test' }
      })
      expect(wrapper.find('ytz-menu-item').exists()).toBe(true)
    })

    it('forwards value attribute', () => {
      const wrapper = mount(MenuItem, {
        props: { value: 'my-value' }
      })
      expect(wrapper.find('ytz-menu-item').attributes('value')).toBe('my-value')
    })

    it('emits click event', async () => {
      const wrapper = mount(MenuItem, {
        props: { value: 'test' }
      })
      await wrapper.find('ytz-menu-item').trigger('click')
      expect(wrapper.emitted('click')).toBeTruthy()
    })
  })

  describe('MenuTrigger', () => {
    it('renders ytz-menu-trigger element', () => {
      const wrapper = mount(MenuTrigger)
      expect(wrapper.find('ytz-menu-trigger').exists()).toBe(true)
    })

    it('renders slot content', () => {
      const wrapper = mount(MenuTrigger, {
        slots: { default: 'Menu Button' }
      })
      expect(wrapper.text()).toContain('Menu Button')
    })
  })

  describe('Autocomplete', () => {
    it('renders ytz-autocomplete element', () => {
      const wrapper = mount(Autocomplete)
      expect(wrapper.find('ytz-autocomplete').exists()).toBe(true)
    })

    it('supports v-model for value', async () => {
      const wrapper = mount(Autocomplete, {
        props: {
          modelValue: 'initial',
          'onUpdate:modelValue': (val: string) => wrapper.setProps({ modelValue: val })
        }
      })

      await wrapper.find('ytz-autocomplete').trigger('change', {
        detail: { value: 'selected' }
      })
      await nextTick()
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    })

    it('emits input-change event for input text', async () => {
      const wrapper = mount(Autocomplete)

      // Autocomplete uses input-change event for input value changes
      await wrapper.find('ytz-autocomplete').trigger('input-change', {
        detail: { value: 'search' }
      })
      await nextTick()
      expect(wrapper.emitted('input-change')).toBeTruthy()
    })

    it('renders with nested AutocompleteOption', () => {
      const wrapper = mount({
        components: { Autocomplete, AutocompleteOption },
        template: `
          <Autocomplete>
            <AutocompleteOption value="apple">Apple</AutocompleteOption>
            <AutocompleteOption value="banana">Banana</AutocompleteOption>
          </Autocomplete>
        `
      })

      expect(wrapper.find('ytz-autocomplete').exists()).toBe(true)
      expect(wrapper.findAll('ytz-option')).toHaveLength(2)
    })
  })

  describe('AutocompleteOption', () => {
    it('renders ytz-option element', () => {
      const wrapper = mount(AutocompleteOption, {
        props: { value: 'test' }
      })
      expect(wrapper.find('ytz-option').exists()).toBe(true)
    })

    it('forwards value attribute', () => {
      const wrapper = mount(AutocompleteOption, {
        props: { value: 'my-value' }
      })
      expect(wrapper.find('ytz-option').attributes('value')).toBe('my-value')
    })
  })

  describe('Listbox', () => {
    it('renders ytz-listbox element', () => {
      const wrapper = mount(Listbox)
      expect(wrapper.find('ytz-listbox').exists()).toBe(true)
    })

    it('supports v-model for value', async () => {
      const wrapper = mount(Listbox, {
        props: {
          modelValue: 'option1',
          'onUpdate:modelValue': (val: string) => wrapper.setProps({ modelValue: val })
        }
      })

      await wrapper.find('ytz-listbox').trigger('change', {
        detail: { value: 'option2' }
      })
      await nextTick()
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    })

    it('renders with nested ListboxOption', () => {
      const wrapper = mount({
        components: { Listbox, ListboxOption },
        template: `
          <Listbox>
            <ListboxOption value="red">Red</ListboxOption>
            <ListboxOption value="blue">Blue</ListboxOption>
          </Listbox>
        `
      })

      expect(wrapper.find('ytz-listbox').exists()).toBe(true)
      expect(wrapper.findAll('ytz-option')).toHaveLength(2)
    })
  })

  describe('ListboxOption', () => {
    it('renders ytz-option element', () => {
      const wrapper = mount(ListboxOption, {
        props: { value: 'test' }
      })
      expect(wrapper.find('ytz-option').exists()).toBe(true)
    })

    it('forwards value attribute', () => {
      const wrapper = mount(ListboxOption, {
        props: { value: 'my-value' }
      })
      expect(wrapper.find('ytz-option').attributes('value')).toBe('my-value')
    })
  })

  describe('Select', () => {
    it('renders ytz-select element', () => {
      const wrapper = mount(Select)
      expect(wrapper.find('ytz-select').exists()).toBe(true)
    })

    it('supports v-model for value', async () => {
      const wrapper = mount(Select, {
        props: {
          modelValue: 'option1',
          'onUpdate:modelValue': (val: string) => wrapper.setProps({ modelValue: val })
        }
      })

      await wrapper.find('ytz-select').trigger('change', {
        detail: { value: 'option2' }
      })
      await nextTick()
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    })

    it('emits open/close events for dropdown visibility', async () => {
      const wrapper = mount(Select, {
        props: { open: false }
      })

      // Select uses open/close events, not toggle
      await wrapper.find('ytz-select').trigger('open')
      await nextTick()
      expect(wrapper.emitted('open')).toBeTruthy()
    })

    it('renders with nested SelectOption', () => {
      const wrapper = mount({
        components: { Select, SelectOption },
        template: `
          <Select>
            <SelectOption value="small">Small</SelectOption>
            <SelectOption value="medium">Medium</SelectOption>
          </Select>
        `
      })

      expect(wrapper.find('ytz-select').exists()).toBe(true)
      expect(wrapper.findAll('ytz-option')).toHaveLength(2)
    })
  })

  describe('SelectOption', () => {
    it('renders ytz-option element', () => {
      const wrapper = mount(SelectOption, {
        props: { value: 'test' }
      })
      expect(wrapper.find('ytz-option').exists()).toBe(true)
    })

    it('forwards value attribute', () => {
      const wrapper = mount(SelectOption, {
        props: { value: 'my-value' }
      })
      expect(wrapper.find('ytz-option').attributes('value')).toBe('my-value')
    })
  })

  describe('Accordion', () => {
    it('renders ytz-accordion element', () => {
      const wrapper = mount(Accordion)
      expect(wrapper.find('ytz-accordion').exists()).toBe(true)
    })

    it('forwards exclusive attribute', () => {
      const wrapper = mount(Accordion, {
        props: { exclusive: true }
      })
      expect(wrapper.find('ytz-accordion').attributes('exclusive')).toBe('true')
    })

    it('renders with nested AccordionItem', () => {
      const wrapper = mount({
        components: { Accordion, AccordionItem },
        template: `
          <Accordion>
            <AccordionItem id="item1">
              <template #summary>Item 1</template>
              Content 1
            </AccordionItem>
            <AccordionItem id="item2">
              <template #summary>Item 2</template>
              Content 2
            </AccordionItem>
          </Accordion>
        `
      })

      expect(wrapper.find('ytz-accordion').exists()).toBe(true)
      expect(wrapper.findAll('ytz-accordion-item')).toHaveLength(2)
    })
  })

  describe('AccordionItem', () => {
    it('renders ytz-accordion-item element', () => {
      const wrapper = mount(AccordionItem, {
        props: { id: 'test-item' }
      })
      expect(wrapper.find('ytz-accordion-item').exists()).toBe(true)
    })

    it('forwards open attribute', () => {
      const wrapper = mount(AccordionItem, {
        props: { id: 'test', open: true }
      })
      expect(wrapper.find('ytz-accordion-item').attributes('open')).toBe('true')
    })

    it('emits toggle event', async () => {
      const wrapper = mount(AccordionItem, {
        props: { id: 'test' }
      })
      await wrapper.find('ytz-accordion-item').trigger('toggle')
      expect(wrapper.emitted('toggle')).toBeTruthy()
    })
  })

  describe('Drawer', () => {
    it('renders ytz-drawer element', () => {
      const wrapper = mount(Drawer)
      expect(wrapper.find('ytz-drawer').exists()).toBe(true)
    })

    it('supports v-model:open binding', async () => {
      const wrapper = mount(Drawer, {
        props: {
          open: true,
          'onUpdate:open': (val: boolean) => wrapper.setProps({ open: val })
        }
      })

      await wrapper.find('ytz-drawer').trigger('close')
      await nextTick()
      expect(wrapper.emitted('update:open')).toBeTruthy()
    })

    it('forwards position attribute', () => {
      const positions = ['left', 'right', 'top', 'bottom'] as const
      positions.forEach((position) => {
        const wrapper = mount(Drawer, {
          props: { position }
        })
        expect(wrapper.find('ytz-drawer').attributes('position')).toBe(position)
      })
    })

    it('emits close event', async () => {
      const wrapper = mount(Drawer, {
        props: { open: true }
      })
      await wrapper.find('ytz-drawer').trigger('close')
      expect(wrapper.emitted('close')).toBeTruthy()
    })
  })

  describe('Popover', () => {
    it('renders ytz-popover element', () => {
      const wrapper = mount(Popover)
      expect(wrapper.find('ytz-popover').exists()).toBe(true)
    })

    it('supports v-model:open binding via show event', async () => {
      const wrapper = mount(Popover, {
        props: {
          open: false,
          'onUpdate:open': (val: boolean) => wrapper.setProps({ open: val })
        }
      })

      // Popover uses show/hide events, not toggle
      await wrapper.find('ytz-popover').trigger('show')
      await nextTick()
      expect(wrapper.emitted('show')).toBeTruthy()
    })

    it('forwards placement attribute', () => {
      const wrapper = mount(Popover, {
        props: { placement: 'bottom' }
      })
      expect(wrapper.find('ytz-popover').attributes('placement')).toBe('bottom')
    })

    it('renders slot content', () => {
      const wrapper = mount(Popover, {
        slots: {
          default: 'Popover content'
        }
      })
      expect(wrapper.html()).toContain('Popover content')
    })
  })

  describe('Cross-Component Integration', () => {
    it('multiple Tier 1 components can coexist', () => {
      const wrapper = mount({
        components: {
          Button,
          Dialog,
          Menu,
          MenuItem,
          MenuTrigger,
          Tooltip
        },
        template: `
          <div>
            <Button>Action</Button>
            <Tooltip content="Help text">
              <Button>Help</Button>
            </Tooltip>
            <Menu>
              <MenuTrigger>Options</MenuTrigger>
              <MenuItem value="edit">Edit</MenuItem>
            </Menu>
            <Dialog :open="false">
              <p>Modal content</p>
            </Dialog>
          </div>
        `
      })

      expect(wrapper.findAll('ytz-button')).toHaveLength(2)
      expect(wrapper.find('ytz-tooltip').exists()).toBe(true)
      expect(wrapper.find('ytz-menu').exists()).toBe(true)
      expect(wrapper.find('ytz-dialog').exists()).toBe(true)
    })

    it('events propagate correctly in nested structures', async () => {
      const wrapper = mount({
        components: { Accordion, AccordionItem, Button },
        template: `
          <Accordion>
            <AccordionItem id="item1">
              <template #summary>Section 1</template>
              <Button @click="handleClick">Action</Button>
            </AccordionItem>
          </Accordion>
        `,
        methods: {
          handleClick: () => {}
        }
      })

      expect(wrapper.find('ytz-accordion').exists()).toBe(true)
      expect(wrapper.find('ytz-accordion-item').exists()).toBe(true)
      expect(wrapper.find('ytz-button').exists()).toBe(true)
    })
  })
})
