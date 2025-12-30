import { Component, JSX, createEffect, onCleanup, splitProps } from 'solid-js'

export interface DialogProps extends JSX.HTMLAttributes<HTMLElement> {
  open?: boolean
  modal?: boolean
  closeOnOverlay?: boolean
  onClose?: () => void
  children?: JSX.Element
}

export const Dialog: Component<DialogProps> = (props) => {
  let ref: HTMLElement | undefined
  const [local, others] = splitProps(props, ['open', 'modal', 'closeOnOverlay', 'onClose', 'children'])

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
    <ytz-dialog
      ref={ref}
      modal={local.modal || undefined}
      close-on-overlay={local.closeOnOverlay || undefined}
      {...others}
    >
      {local.children}
    </ytz-dialog>
  )
}
