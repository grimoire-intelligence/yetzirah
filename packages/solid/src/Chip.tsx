import { Component, JSX, createEffect, onCleanup, splitProps } from 'solid-js'

export interface ChipProps extends JSX.HTMLAttributes<HTMLElement> {
  removable?: boolean
  disabled?: boolean
  onRemove?: () => void
  children?: JSX.Element
}

export const Chip: Component<ChipProps> = (props) => {
  let ref: HTMLElement | undefined
  const [local, others] = splitProps(props, ['removable', 'disabled', 'onRemove', 'children'])

  createEffect(() => {
    if (!ref || !local.onRemove) return
    const handler = () => local.onRemove?.()
    ref.addEventListener('remove', handler)
    onCleanup(() => ref?.removeEventListener('remove', handler))
  })

  return (
    <ytz-chip
      ref={ref}
      removable={local.removable || undefined}
      disabled={local.disabled || undefined}
      {...others}
    >
      {local.children}
    </ytz-chip>
  )
}
