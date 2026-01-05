import { Component, JSX, createEffect, onCleanup, splitProps } from 'solid-js'

export interface SelectProps extends JSX.HTMLAttributes<HTMLElement> {
  value?: string
  placeholder?: string
  disabled?: boolean
  onChange?: (value: string) => void
  children?: JSX.Element
}

export const Select: Component<SelectProps> = (props) => {
  let ref: HTMLElement | undefined
  const [local, others] = splitProps(props, ['value', 'placeholder', 'disabled', 'onChange', 'children'])

  createEffect(() => {
    if (!ref || local.value === undefined) return
    ref.setAttribute('value', local.value)
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
    <ytz-select
      ref={ref}
      placeholder={local.placeholder}
      disabled={local.disabled || undefined}
      {...others}
    >
      {local.children}
    </ytz-select>
  )
}
