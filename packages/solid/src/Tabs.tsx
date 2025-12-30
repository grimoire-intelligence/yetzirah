import { Component, JSX, createEffect, onCleanup, splitProps } from 'solid-js'

export interface TabsProps extends JSX.HTMLAttributes<HTMLElement> {
  defaultTab?: string
  onChange?: (value: string) => void
  children?: JSX.Element
}

export const Tabs: Component<TabsProps> = (props) => {
  let ref: HTMLElement | undefined
  const [local, others] = splitProps(props, ['defaultTab', 'onChange', 'children'])

  createEffect(() => {
    if (!ref || !local.defaultTab) return
    ref.setAttribute('default-tab', local.defaultTab)
  })

  createEffect(() => {
    if (!ref || !local.onChange) return
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail
      local.onChange?.(detail?.value ?? '')
    }
    ref.addEventListener('change', handler)
    onCleanup(() => ref?.removeEventListener('change', handler))
  })

  return (
    <ytz-tabs ref={ref} {...others}>
      {local.children}
    </ytz-tabs>
  )
}

export interface TabListProps extends JSX.HTMLAttributes<HTMLElement> {
  'aria-label'?: string
  children?: JSX.Element
}

export const TabList: Component<TabListProps> = (props) => {
  const [local, others] = splitProps(props, ['children'])
  return (
    <ytz-tab-list {...others}>
      {local.children}
    </ytz-tab-list>
  )
}
