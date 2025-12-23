import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DataGrid from '../DataGrid.vue'

describe('DataGrid', () => {
  const sampleData = [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' }
  ]

  const sampleColumns = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'email', header: 'Email' }
  ]

  it('renders with default props', () => {
    const wrapper = mount(DataGrid)
    expect(wrapper.find('ytz-datagrid').exists()).toBe(true)
  })

  it('renders column components for each column definition', () => {
    const wrapper = mount(DataGrid, {
      props: {
        columns: sampleColumns
      }
    })
    const columns = wrapper.findAll('ytz-datagrid-column')
    expect(columns.length).toBe(2)
  })

  it('passes column properties correctly', () => {
    const wrapper = mount(DataGrid, {
      props: {
        columns: sampleColumns
      }
    })
    const columns = wrapper.findAll('ytz-datagrid-column')

    expect(columns[0].attributes('field')).toBe('name')
    expect(columns[0].attributes('header')).toBe('Name')
    expect(columns[0].attributes('sortable')).toBe('true')

    expect(columns[1].attributes('field')).toBe('email')
    expect(columns[1].attributes('header')).toBe('Email')
  })

  it('passes rowHeight prop to web component', () => {
    const wrapper = mount(DataGrid, {
      props: { rowHeight: 48 }
    })
    const grid = wrapper.find('ytz-datagrid')
    expect(grid.attributes('row-height')).toBe('48')
  })

  it('emits sort event when column is sorted', async () => {
    const wrapper = mount(DataGrid, {
      props: { columns: sampleColumns }
    })

    const grid = wrapper.find('ytz-datagrid')
    await grid.trigger('sort', {
      detail: { field: 'name', direction: 'asc' }
    })

    expect(wrapper.emitted('sort')).toBeTruthy()
    const sortEvent = wrapper.emitted('sort')?.[0]?.[0] as { column: string; direction: string }
    expect(sortEvent?.column).toBe('name')
    expect(sortEvent?.direction).toBe('asc')
  })

  it('emits rowclick event when row is clicked', async () => {
    const wrapper = mount(DataGrid, {
      props: { data: sampleData, columns: sampleColumns }
    })

    const grid = wrapper.find('ytz-datagrid')
    await grid.trigger('rowselect', {
      detail: { row: sampleData[0] }
    })

    expect(wrapper.emitted('rowclick')).toBeTruthy()
    const rowEvent = wrapper.emitted('rowclick')?.[0]?.[0] as { row: Record<string, any> }
    expect(rowEvent?.row).toEqual(sampleData[0])
  })

  it('handles column width property', () => {
    const columnsWithWidth = [
      { key: 'name', header: 'Name', width: '200px' }
    ]
    const wrapper = mount(DataGrid, {
      props: { columns: columnsWithWidth }
    })
    const column = wrapper.find('ytz-datagrid-column')
    expect(column.attributes('width')).toBe('200px')
  })

  it('supports virtualScroll prop', () => {
    const wrapper = mount(DataGrid, {
      props: { virtualScroll: true }
    })
    expect(wrapper.props('virtualScroll')).toBe(true)
  })
})
