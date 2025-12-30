import { Component, JSX, createEffect, onCleanup, splitProps } from 'solid-js'

export interface MenuProps extends JSX.HTMLAttributes<HTMLElement> {
  onSelect?: (value: string) => void
  children?: JSX.Element
}

export const Menu: Component<MenuProps> = (props) => {
  let ref: HTMLElement | undefined
  const [local, others] = splitProps(props, ['onSelect', 'children'])

  createEffect(() => {
    if (!ref || !local.onSelect) return
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail
      local.onSelect?.(detail?.value ?? '')
    }
    ref.addEventListener('select', handler)
    onCleanup(() => ref?.removeEventListener('select', handler))
  })

  return (
    <ytz-menu ref={ref} {...others}>
      {local.children}
    </ytz-menu>
  )
}
