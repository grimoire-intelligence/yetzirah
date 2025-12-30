import { render } from '@solidjs/testing-library'
import { createSignal } from 'solid-js'
import { describe, test, expect, vi } from 'vitest'
import { Tabs, TabList } from '../Tabs'

describe('Tabs', () => {
  test('renders children', () => {
    const { container } = render(() => (
      <Tabs>
        <TabList>Tab Content</TabList>
      </Tabs>
    ))
    const tabs = container.querySelector('ytz-tabs')
    expect(tabs).toBeTruthy()
  })

  test('syncs defaultTab prop reactively', async () => {
    const [tab, setTab] = createSignal('tab1')
    const { container } = render(() => <Tabs defaultTab={tab()}>Content</Tabs>)

    const tabs = container.querySelector('ytz-tabs')
    expect(tabs).toHaveAttribute('default-tab', 'tab1')

    setTab('tab2')
    await Promise.resolve()
    expect(tabs).toHaveAttribute('default-tab', 'tab2')
  })

  test('calls onChange callback with value', async () => {
    const handleChange = vi.fn()
    const { container } = render(() => (
      <Tabs defaultTab="tab1" onChange={handleChange}>Content</Tabs>
    ))

    const tabs = container.querySelector('ytz-tabs')!
    tabs.dispatchEvent(new CustomEvent('change', {
      bubbles: true,
      detail: { value: 'tab2' }
    }))

    expect(handleChange).toHaveBeenCalledWith('tab2')
  })

  test('handles change event with empty detail', async () => {
    const handleChange = vi.fn()
    const { container } = render(() => (
      <Tabs onChange={handleChange}>Content</Tabs>
    ))

    const tabs = container.querySelector('ytz-tabs')!
    tabs.dispatchEvent(new CustomEvent('change', {
      bubbles: true,
      detail: {}
    }))

    expect(handleChange).toHaveBeenCalledWith('')
  })
})

describe('TabList', () => {
  test('renders children', () => {
    const { container } = render(() => <TabList>Tab Items</TabList>)
    const tabList = container.querySelector('ytz-tab-list')
    expect(tabList).toBeTruthy()
    expect(tabList?.textContent).toBe('Tab Items')
  })
})
