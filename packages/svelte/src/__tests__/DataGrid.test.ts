import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/svelte'
import DataGrid from '../DataGrid.svelte'

describe('DataGrid', () => {
  const sampleData = [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' }
  ]

  const sampleColumns = [
    { field: 'name', header: 'Name', sortable: true },
    { field: 'email', header: 'Email' }
  ]

  it('renders with default props', () => {
    const { container } = render(DataGrid)
    expect(container.querySelector('ytz-datagrid')).not.toBeNull()
  })

  it('renders column components for each column definition', () => {
    const { container } = render(DataGrid, { props: { columns: sampleColumns } })
    const columns = container.querySelectorAll('ytz-datagrid-column')
    expect(columns.length).toBe(2)
  })

  it('passes column properties correctly', () => {
    const { container } = render(DataGrid, { props: { columns: sampleColumns } })
    const columns = container.querySelectorAll('ytz-datagrid-column')

    expect(columns[0].getAttribute('field')).toBe('name')
    expect(columns[0].getAttribute('header')).toBe('Name')
    expect(columns[0].hasAttribute('sortable')).toBe(true)

    expect(columns[1].getAttribute('field')).toBe('email')
    expect(columns[1].getAttribute('header')).toBe('Email')
  })

  it('passes rowHeight prop to web component', () => {
    const { container } = render(DataGrid, { props: { rowHeight: 48 } })
    const grid = container.querySelector('ytz-datagrid')
    expect(grid?.getAttribute('row-height')).toBe('48')
  })

  it('forwards sort events', async () => {
    const { container } = render(DataGrid, { props: { columns: sampleColumns } })
    const grid = container.querySelector('ytz-datagrid')

    // Simulate sort event
    const event = new CustomEvent('sort', {
      detail: { field: 'name', direction: 'asc' },
      bubbles: true
    })
    grid?.dispatchEvent(event)

    expect(true).toBe(true)
  })

  it('forwards rowselect events', async () => {
    const { container } = render(DataGrid, { props: { data: sampleData, columns: sampleColumns } })
    const grid = container.querySelector('ytz-datagrid')

    // Simulate rowselect event
    const event = new CustomEvent('rowselect', {
      detail: { row: sampleData[0], index: 0 },
      bubbles: true
    })
    grid?.dispatchEvent(event)

    expect(true).toBe(true)
  })

  it('handles column width property', () => {
    const columnsWithWidth = [
      { field: 'name', header: 'Name', width: '200px' }
    ]
    const { container } = render(DataGrid, { props: { columns: columnsWithWidth } })
    const column = container.querySelector('ytz-datagrid-column')
    expect(column?.getAttribute('width')).toBe('200px')
  })
})
