/**
 * React wrapper for ytz-datagrid Web Component.
 * Provides data grid with virtual scrolling, sorting, and filtering.
 *
 * @module @grimoire/yetzirah-react/datagrid
 */

import '@grimoire/yetzirah-core'
import { forwardRef, useRef, useImperativeHandle, useEffect, useCallback, Children } from 'react'

/**
 * DataGridColumn component - defines a column for the DataGrid.
 *
 * @param {Object} props - Component props
 * @param {string} props.field - Data field name
 * @param {string} [props.header] - Column header (defaults to field)
 * @param {boolean} [props.sortable] - Enable sorting
 * @param {boolean} [props.filterable] - Enable filtering
 * @param {string} [props.width] - Column width (CSS value)
 * @returns {JSX.Element}
 */
export const DataGridColumn = forwardRef(function DataGridColumn(
  { field, header, sortable, filterable, width, ...props },
  ref
) {
  const innerRef = useRef(null)
  useImperativeHandle(ref, () => innerRef.current)

  return (
    <ytz-datagrid-column
      ref={innerRef}
      field={field}
      header={header}
      sortable={sortable || undefined}
      filterable={filterable || undefined}
      width={width}
      {...props}
    />
  )
})

/**
 * DataGrid component - virtualized data grid with sorting/filtering.
 *
 * @param {Object} props - Component props
 * @param {Array<Object>} [props.data] - Row data array
 * @param {Array<Object>} [props.columns] - Column definitions (alternative to children)
 * @param {number} [props.rowHeight=40] - Row height in pixels
 * @param {Function} [props.onSort] - Sort event handler
 * @param {Function} [props.onRowSelect] - Row selection handler
 * @param {Function} [props.onRowActivate] - Row activation (Enter key) handler
 * @param {string} [props.className] - CSS classes
 * @param {React.ReactNode} [props.children] - DataGridColumn children
 * @param {React.Ref} ref - Forwarded ref
 * @returns {JSX.Element}
 *
 * @example
 * // With column children
 * <DataGrid data={users} onRowSelect={(e) => console.log(e.detail.row)}>
 *   <DataGridColumn field="name" header="Name" sortable />
 *   <DataGridColumn field="email" header="Email" filterable />
 * </DataGrid>
 *
 * @example
 * // With columns prop
 * <DataGrid
 *   data={users}
 *   columns={[
 *     { field: 'name', header: 'Name', sortable: true },
 *     { field: 'email', header: 'Email', filterable: true }
 *   ]}
 * />
 */
export const DataGrid = forwardRef(function DataGrid(
  { data, columns, rowHeight, onSort, onRowSelect, onRowActivate, className, children, ...props },
  ref
) {
  const innerRef = useRef(null)

  useImperativeHandle(ref, () => innerRef.current)

  // Handle sort events
  const handleSort = useCallback((e) => {
    if (onSort) {
      onSort(e)
    }
  }, [onSort])

  // Handle row select events
  const handleRowSelect = useCallback((e) => {
    if (onRowSelect) {
      onRowSelect(e)
    }
  }, [onRowSelect])

  // Handle row activate events
  const handleRowActivate = useCallback((e) => {
    if (onRowActivate) {
      onRowActivate(e)
    }
  }, [onRowActivate])

  // Set up event listeners
  useEffect(() => {
    const el = innerRef.current
    if (!el) return

    el.addEventListener('sort', handleSort)
    el.addEventListener('rowselect', handleRowSelect)
    el.addEventListener('rowactivate', handleRowActivate)

    return () => {
      el.removeEventListener('sort', handleSort)
      el.removeEventListener('rowselect', handleRowSelect)
      el.removeEventListener('rowactivate', handleRowActivate)
    }
  }, [handleSort, handleRowSelect, handleRowActivate])

  // Sync data property
  useEffect(() => {
    const el = innerRef.current
    if (!el || data === undefined) return

    // Set data via property (not attribute)
    el.data = data
  }, [data])

  // Generate column elements from columns prop if provided
  const columnElements = columns
    ? columns.map((col, index) => (
        <ytz-datagrid-column
          key={col.field || index}
          field={col.field}
          header={col.header}
          sortable={col.sortable || undefined}
          filterable={col.filterable || undefined}
          width={col.width}
        />
      ))
    : children

  return (
    <ytz-datagrid
      ref={innerRef}
      class={className}
      row-height={rowHeight}
      {...props}
    >
      {columnElements}
    </ytz-datagrid>
  )
})
