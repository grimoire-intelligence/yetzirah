import { Component, JSX, createEffect, onCleanup, splitProps } from 'solid-js'

export interface SnackbarProps extends JSX.HTMLAttributes<HTMLElement> {
  open?: boolean
  duration?: number
  position?: 'top' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  onClose?: () => void
  children?: JSX.Element
}

export const Snackbar: Component<SnackbarProps> = (props) => {
  let ref: HTMLElement | undefined
  const [local, others] = splitProps(props, ['open', 'duration', 'position', 'onClose', 'children'])

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
    <ytz-snackbar
      ref={ref}
      duration={local.duration}
      position={local.position}
      {...others}
    >
      {local.children}
    </ytz-snackbar>
  )
}
