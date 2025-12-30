import { Component, JSX, createEffect, onCleanup, splitProps } from 'solid-js'

export interface AccordionItemProps extends JSX.HTMLAttributes<HTMLElement> {
  open?: boolean
  disabled?: boolean
  onToggle?: (open: boolean) => void
  children?: JSX.Element
}

export const AccordionItem: Component<AccordionItemProps> = (props) => {
  let ref: HTMLElement | undefined
  const [local, others] = splitProps(props, ['open', 'disabled', 'onToggle', 'children'])

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
    <ytz-accordion-item
      ref={ref}
      disabled={local.disabled || undefined}
      {...others}
    >
      {local.children}
    </ytz-accordion-item>
  )
}
