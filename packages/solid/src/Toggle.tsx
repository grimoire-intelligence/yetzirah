import { Component, JSX, createEffect, onCleanup, splitProps } from 'solid-js'

export interface ToggleProps extends JSX.HTMLAttributes<HTMLElement> {
  checked?: boolean
  disabled?: boolean
  onChange?: (checked: boolean) => void
  children?: JSX.Element
}

export const Toggle: Component<ToggleProps> = (props) => {
  let ref: HTMLElement | undefined
  const [local, others] = splitProps(props, ['checked', 'disabled', 'onChange', 'children'])

  createEffect(() => {
    if (!ref) return
    if (local.checked) {
      ref.setAttribute('checked', '')
    } else {
      ref.removeAttribute('checked')
    }
  })

  createEffect(() => {
    if (!ref || !local.onChange) return
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail
      local.onChange?.(detail?.checked ?? false)
    }
    ref.addEventListener('change', handler)
    onCleanup(() => ref?.removeEventListener('change', handler))
  })

  return (
    <ytz-toggle
      ref={ref}
      disabled={local.disabled || undefined}
      {...others}
    >
      {local.children}
    </ytz-toggle>
  )
}
