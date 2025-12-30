import { Component, JSX, createEffect, onCleanup, splitProps } from 'solid-js'

export interface DisclosureProps extends JSX.HTMLAttributes<HTMLElement> {
  open?: boolean
  onToggle?: (open: boolean) => void
  children?: JSX.Element
}

export const Disclosure: Component<DisclosureProps> = (props) => {
  let ref: HTMLElement | undefined
  const [local, others] = splitProps(props, ['open', 'onToggle', 'children'])

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
    <ytz-disclosure ref={ref} {...others}>
      {local.children}
    </ytz-disclosure>
  )
}
