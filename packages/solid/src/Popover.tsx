import { Component, JSX, createEffect, onCleanup, splitProps } from 'solid-js'

export interface PopoverProps extends JSX.HTMLAttributes<HTMLElement> {
  open?: boolean
  position?: 'top' | 'bottom' | 'left' | 'right'
  trigger?: 'click' | 'hover'
  onToggle?: (open: boolean) => void
  children?: JSX.Element
}

export const Popover: Component<PopoverProps> = (props) => {
  let ref: HTMLElement | undefined
  const [local, others] = splitProps(props, ['open', 'position', 'trigger', 'onToggle', 'children'])

  createEffect(() => {
    if (!ref) return
    if (local.open) {
      ref.setAttribute('open', '')
    } else {
      ref.removeAttribute('open')
    }
  })

  createEffect(() => {
    if (!ref || !local.onToggle) return
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail
      local.onToggle?.(detail?.open ?? false)
    }
    ref.addEventListener('toggle', handler)
    onCleanup(() => ref?.removeEventListener('toggle', handler))
  })

  return (
    <ytz-popover
      ref={ref}
      position={local.position}
      trigger={local.trigger}
      {...others}
    >
      {local.children}
    </ytz-popover>
  )
}
