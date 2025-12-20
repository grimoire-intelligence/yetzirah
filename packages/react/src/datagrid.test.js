/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { createRef } from 'react'
import { DataGrid, DataGridColumn } from './datagrid.js'

describe('DataGrid', () => {
  const sampleData = [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' },
  ]

  test('renders as ytz-datagrid element', () => {
    const { container } = render(<DataGrid />)
    const grid = container.querySelector('ytz-datagrid')
    expect(grid).toBeInTheDocument()
  })

  test('renders column children', () => {
    const { container } = render(
      <DataGrid>
        <DataGridColumn field="name" header="Name" />
        <DataGridColumn field="email" header="Email" />
      </DataGrid>
    )
    const columns = container.querySelectorAll('ytz-datagrid-column')
    expect(columns).toHaveLength(2)
  })

  test('renders columns from columns prop', () => {
    const columns = [
      { field: 'name', header: 'Name' },
      { field: 'email', header: 'Email' },
    ]
    const { container } = render(<DataGrid columns={columns} />)
    const columnEls = container.querySelectorAll('ytz-datagrid-column')
    expect(columnEls).toHaveLength(2)
    expect(columnEls[0]).toHaveAttribute('field', 'name')
    expect(columnEls[1]).toHaveAttribute('field', 'email')
  })

  test('sets data property on element', () => {
    const { container } = render(<DataGrid data={sampleData} />)
    const grid = container.querySelector('ytz-datagrid')
    expect(grid.data).toEqual(sampleData)
  })

  test('passes rowHeight as row-height attribute', () => {
    const { container } = render(<DataGrid rowHeight={50} />)
    const grid = container.querySelector('ytz-datagrid')
    expect(grid).toHaveAttribute('row-height', '50')
  })

  test('passes className as class attribute', () => {
    const { container } = render(<DataGrid className="custom-grid" />)
    const grid = container.querySelector('ytz-datagrid')
    expect(grid).toHaveAttribute('class', 'custom-grid')
  })

  test('forwards ref to ytz-datagrid element', () => {
    const ref = createRef()
    render(<DataGrid ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current.tagName.toLowerCase()).toBe('ytz-datagrid')
  })

  test('calls onSort handler on sort event', () => {
    const handleSort = jest.fn()
    const { container } = render(<DataGrid onSort={handleSort} />)
    const grid = container.querySelector('ytz-datagrid')

    const event = new CustomEvent('sort', {
      bubbles: true,
      detail: { field: 'name', direction: 'asc' }
    })
    grid.dispatchEvent(event)

    expect(handleSort).toHaveBeenCalledTimes(1)
  })

  test('calls onRowSelect handler on rowselect event', () => {
    const handleRowSelect = jest.fn()
    const { container } = render(<DataGrid onRowSelect={handleRowSelect} />)
    const grid = container.querySelector('ytz-datagrid')

    const event = new CustomEvent('rowselect', {
      bubbles: true,
      detail: { row: sampleData[0], index: 0 }
    })
    grid.dispatchEvent(event)

    expect(handleRowSelect).toHaveBeenCalledTimes(1)
  })

  test('calls onRowActivate handler on rowactivate event', () => {
    const handleRowActivate = jest.fn()
    const { container } = render(<DataGrid onRowActivate={handleRowActivate} />)
    const grid = container.querySelector('ytz-datagrid')

    const event = new CustomEvent('rowactivate', {
      bubbles: true,
      detail: { row: sampleData[0], index: 0 }
    })
    grid.dispatchEvent(event)

    expect(handleRowActivate).toHaveBeenCalledTimes(1)
  })

  test('passes aria attributes through', () => {
    const { container } = render(<DataGrid aria-label="Users table" />)
    const grid = container.querySelector('ytz-datagrid')
    expect(grid).toHaveAttribute('aria-label', 'Users table')
  })
})

describe('DataGridColumn', () => {
  test('renders as ytz-datagrid-column element', () => {
    const { container } = render(<DataGridColumn field="name" />)
    const column = container.querySelector('ytz-datagrid-column')
    expect(column).toBeInTheDocument()
  })

  test('passes field attribute', () => {
    const { container } = render(<DataGridColumn field="email" />)
    const column = container.querySelector('ytz-datagrid-column')
    expect(column).toHaveAttribute('field', 'email')
  })

  test('passes header attribute', () => {
    const { container } = render(<DataGridColumn field="name" header="Full Name" />)
    const column = container.querySelector('ytz-datagrid-column')
    expect(column).toHaveAttribute('header', 'Full Name')
  })

  test('passes sortable attribute when true', () => {
    const { container } = render(<DataGridColumn field="name" sortable />)
    const column = container.querySelector('ytz-datagrid-column')
    expect(column).toHaveAttribute('sortable')
  })

  test('passes filterable attribute when true', () => {
    const { container } = render(<DataGridColumn field="name" filterable />)
    const column = container.querySelector('ytz-datagrid-column')
    expect(column).toHaveAttribute('filterable')
  })

  test('passes width attribute', () => {
    const { container } = render(<DataGridColumn field="name" width="200px" />)
    const column = container.querySelector('ytz-datagrid-column')
    expect(column).toHaveAttribute('width', '200px')
  })

  test('forwards ref to ytz-datagrid-column element', () => {
    const ref = createRef()
    render(<DataGridColumn ref={ref} field="name" />)
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current.tagName.toLowerCase()).toBe('ytz-datagrid-column')
  })
})
