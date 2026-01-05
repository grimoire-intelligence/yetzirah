import { Component, JSX, createEffect, onCleanup, splitProps } from 'solid-js'

export interface DataGridProps extends JSX.HTMLAttributes<HTMLElement> {
  columns?: string
  rows?: string
  sortable?: boolean
  selectable?: boolean
  onSort?: (column: string, direction: 'asc' | 'desc') => void
  onSelect?: (rows: string[]) => void
  children?: JSX.Element
}

export const DataGrid: Component<DataGridProps> = (props) => {
  let ref: HTMLElement | undefined
  const [local, others] = splitProps(props, ['columns', 'rows', 'sortable', 'selectable', 'onSort', 'onSelect', 'children'])

  createEffect(() => {
    if (!ref) return
    if (local.columns) ref.setAttribute('columns', local.columns)
    if (local.rows) ref.setAttribute('rows', local.rows)
  })

  createEffect(() => {
    if (!ref || !local.onSort) return
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail
      local.onSort?.(detail?.column ?? '', detail?.direction ?? 'asc')
    }
    ref.addEventListener('sort', handler)
    onCleanup(() => ref?.removeEventListener('sort', handler))
  })

  createEffect(() => {
    if (!ref || !local.onSelect) return
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail
      local.onSelect?.(detail?.rows ?? [])
    }
    ref.addEventListener('select', handler)
    onCleanup(() => ref?.removeEventListener('select', handler))
  })

  return (
    <ytz-data-grid
      ref={ref}
      sortable={local.sortable || undefined}
      selectable={local.selectable || undefined}
      {...others}
    >
      {local.children}
    </ytz-data-grid>
  )
}
