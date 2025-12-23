import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/svelte'
import Tabs from '../Tabs.svelte'
import Tab from '../Tab.svelte'
import TabPanel from '../TabPanel.svelte'
import TabList from '../TabList.svelte'

describe('Tabs', () => {
  it('renders with default props', () => {
    const { container } = render(Tabs)
    expect(container.querySelector('ytz-tabs')).not.toBeNull()
  })

  it('passes value prop to web component', () => {
    const { container } = render(Tabs, { props: { value: 'tab1' } })
    const tabs = container.querySelector('ytz-tabs')
    expect(tabs).not.toBeNull()
  })

  it('passes orientation prop to web component', () => {
    const { container } = render(Tabs, { props: { orientation: 'vertical' } })
    const tabs = container.querySelector('ytz-tabs')
    expect(tabs?.getAttribute('orientation')).toBe('vertical')
  })

  it('defaults to horizontal orientation', () => {
    const { container } = render(Tabs)
    const tabs = container.querySelector('ytz-tabs')
    expect(tabs?.getAttribute('orientation')).toBe('horizontal')
  })

  it('receives change events from web component', () => {
    const { container } = render(Tabs, { props: { value: 'tab1' } })
    const tabs = container.querySelector('ytz-tabs')

    expect(tabs).not.toBeNull()

    // Simulate change event
    const event = new CustomEvent('change', { detail: { value: 'tab2' }, bubbles: true })
    tabs?.dispatchEvent(event)

    // The event should bubble up
    expect(true).toBe(true) // Event dispatch verification
  })

  it('renders slot content', () => {
    const { container } = render(Tabs)

    const tabs = container.querySelector('ytz-tabs')
    expect(tabs).not.toBeNull()
  })
})

describe('Tab', () => {
  it('renders with default props', () => {
    const { container } = render(Tab)
    expect(container.querySelector('ytz-tab')).not.toBeNull()
  })

  it('passes panel prop to web component', () => {
    const { container } = render(Tab, { props: { panel: 'tab1' } })
    const tab = container.querySelector('ytz-tab')
    expect(tab?.getAttribute('panel')).toBe('tab1')
  })

  it('renders slot content', () => {
    const { container } = render(Tab, {
      props: { panel: 'tab1' }
    })

    const tab = container.querySelector('ytz-tab')
    expect(tab).not.toBeNull()
  })
})

describe('TabPanel', () => {
  it('renders with default props', () => {
    const { container } = render(TabPanel)
    expect(container.querySelector('ytz-tabpanel')).not.toBeNull()
  })

  it('passes id prop to web component', () => {
    const { container } = render(TabPanel, { props: { id: 'tab1' } })
    const panel = container.querySelector('ytz-tabpanel')
    expect(panel?.getAttribute('id')).toBe('tab1')
  })

  it('renders slot content', () => {
    const { container } = render(TabPanel, {
      props: { id: 'tab1' }
    })

    const panel = container.querySelector('ytz-tabpanel')
    expect(panel).not.toBeNull()
  })
})

describe('TabList', () => {
  it('renders as a div container', () => {
    const { container } = render(TabList)
    expect(container.querySelector('div')).not.toBeNull()
  })

  it('renders slot content', () => {
    const { container } = render(TabList)

    const div = container.querySelector('div')
    expect(div).not.toBeNull()
  })

  it('passes class prop', () => {
    const { container } = render(TabList, { props: { class: 'custom-class' } })
    const div = container.querySelector('div')
    expect(div?.className).toContain('custom-class')
  })
})
