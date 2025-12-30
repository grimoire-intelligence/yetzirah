import { Component, JSX, createEffect, onCleanup, splitProps } from 'solid-js'

export interface DrawerProps extends JSX.HTMLAttributes<HTMLElement> {
  open?: boolean
  position?: 'left' | 'right' | 'top' | 'bottom'
  onClose?: () => void
  children?: JSX.Element
}

export const Drawer: Component<DrawerProps> = (props) => {
  let ref: HTMLElement | undefined
  const [local, others] = splitProps(props, ['open', 'position', 'onClose', 'children'])

  createEffect(() => {
    if (!ref) return
    if (local.open) {
      ref.setAttribute('open', '')
    } else {
      ref.removeAttribute('open')
    }
  })

  createEffect(() => {
    if (!ref || !local.onClose) return
    const handler = () => local.onClose?.()
    ref.addEventListener('close', handler)
    onCleanup(() => ref?.removeEventListener('close', handler))
  })

  return (
    <ytz-drawer
      ref={ref}
      position={local.position}
      {...others}
    >
      {local.children}
    </ytz-drawer>
  )
}
