/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals'
import { render, screen, fireEvent, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { createRef } from 'react'
import { Tabs, Tab, TabPanel } from './tabs.js'

describe('Tabs', () => {
  test('renders tabs and panels', () => {
    render(
      <Tabs defaultValue="one">
        <Tab panel="one">Tab 1</Tab>
        <Tab panel="two">Tab 2</Tab>
        <TabPanel id="one">Content 1</TabPanel>
        <TabPanel id="two">Content 2</TabPanel>
      </Tabs>
    )
    expect(screen.getByText('Tab 1')).toBeInTheDocument()
    expect(screen.getByText('Tab 2')).toBeInTheDocument()
    expect(screen.getByText('Content 1')).toBeInTheDocument()
  })

  test('controlled mode - value prop controls selection', async () => {
    const { rerender } = render(
      <Tabs value="one">
        <Tab panel="one">Tab 1</Tab>
        <Tab panel="two">Tab 2</Tab>
        <TabPanel id="one">Content 1</TabPanel>
        <TabPanel id="two">Content 2</TabPanel>
      </Tabs>
    )

    const tabs = screen.getByText('Tab 1').closest('ytz-tabs')
    expect(tabs).toHaveAttribute('value', 'one')

    rerender(
      <Tabs value="two">
        <Tab panel="one">Tab 1</Tab>
        <Tab panel="two">Tab 2</Tab>
        <TabPanel id="one">Content 1</TabPanel>
        <TabPanel id="two">Content 2</TabPanel>
      </Tabs>
    )

    expect(tabs).toHaveAttribute('value', 'two')
  })

  test('defaultValue sets initial selection', () => {
    render(
      <Tabs defaultValue="two">
        <Tab panel="one">Tab 1</Tab>
        <Tab panel="two">Tab 2</Tab>
        <TabPanel id="one">Content 1</TabPanel>
        <TabPanel id="two">Content 2</TabPanel>
      </Tabs>
    )
    const tabs = screen.getByText('Tab 1').closest('ytz-tabs')
    expect(tabs).toHaveAttribute('value', 'two')
  })

  test('calls onChange when tab clicked', async () => {
    const handleChange = jest.fn()
    render(
      <Tabs defaultValue="one" onChange={handleChange}>
        <Tab panel="one">Tab 1</Tab>
        <Tab panel="two">Tab 2</Tab>
        <TabPanel id="one">Content 1</TabPanel>
        <TabPanel id="two">Content 2</TabPanel>
      </Tabs>
    )

    await act(async () => {
      fireEvent.click(screen.getByText('Tab 2'))
    })

    expect(handleChange).toHaveBeenCalledWith('two')
  })

  test('orientation prop passed through', () => {
    render(
      <Tabs defaultValue="one" orientation="vertical">
        <Tab panel="one">Tab 1</Tab>
        <TabPanel id="one">Content 1</TabPanel>
      </Tabs>
    )
    const tabs = screen.getByText('Tab 1').closest('ytz-tabs')
    expect(tabs).toHaveAttribute('orientation', 'vertical')
  })

  test('forwards ref to ytz-tabs element', () => {
    const ref = createRef()
    render(
      <Tabs ref={ref} defaultValue="one">
        <Tab panel="one">Tab 1</Tab>
        <TabPanel id="one">Content 1</TabPanel>
      </Tabs>
    )
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current.tagName.toLowerCase()).toBe('ytz-tabs')
  })

  test('passes className as class attribute', () => {
    render(
      <Tabs defaultValue="one" className="test-class">
        <Tab panel="one">Tab 1</Tab>
        <TabPanel id="one">Content 1</TabPanel>
      </Tabs>
    )
    const tabs = screen.getByText('Tab 1').closest('ytz-tabs')
    expect(tabs).toHaveAttribute('class', 'test-class')
  })
})

describe('Tab', () => {
  test('renders with panel attribute', () => {
    render(
      <Tabs defaultValue="one">
        <Tab panel="one">Tab 1</Tab>
        <TabPanel id="one">Content 1</TabPanel>
      </Tabs>
    )
    const tab = screen.getByText('Tab 1')
    expect(tab).toHaveAttribute('panel', 'one')
  })

  test('forwards ref to ytz-tab element', () => {
    const ref = createRef()
    render(
      <Tabs defaultValue="one">
        <Tab ref={ref} panel="one">Tab 1</Tab>
        <TabPanel id="one">Content 1</TabPanel>
      </Tabs>
    )
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current.tagName.toLowerCase()).toBe('ytz-tab')
  })

  test('passes className as class attribute', () => {
    render(
      <Tabs defaultValue="one">
        <Tab panel="one" className="tab-class">Tab 1</Tab>
        <TabPanel id="one">Content 1</TabPanel>
      </Tabs>
    )
    expect(screen.getByText('Tab 1')).toHaveAttribute('class', 'tab-class')
  })
})

describe('TabPanel', () => {
  test('renders with id attribute', () => {
    render(
      <Tabs defaultValue="one">
        <Tab panel="one">Tab 1</Tab>
        <TabPanel id="one">Content 1</TabPanel>
      </Tabs>
    )
    const panel = screen.getByText('Content 1')
    expect(panel).toHaveAttribute('id', 'one')
  })

  test('forwards ref to ytz-tabpanel element', () => {
    const ref = createRef()
    render(
      <Tabs defaultValue="one">
        <Tab panel="one">Tab 1</Tab>
        <TabPanel ref={ref} id="one">Content 1</TabPanel>
      </Tabs>
    )
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current.tagName.toLowerCase()).toBe('ytz-tabpanel')
  })

  test('passes className as class attribute', () => {
    render(
      <Tabs defaultValue="one">
        <Tab panel="one">Tab 1</Tab>
        <TabPanel id="one" className="panel-class">Content 1</TabPanel>
      </Tabs>
    )
    expect(screen.getByText('Content 1')).toHaveAttribute('class', 'panel-class')
  })

  test('passes data attributes through', () => {
    render(
      <Tabs defaultValue="one">
        <Tab panel="one">Tab 1</Tab>
        <TabPanel id="one" data-testid="my-panel">Content 1</TabPanel>
      </Tabs>
    )
    expect(screen.getByTestId('my-panel')).toBeInTheDocument()
  })
})
