import { Component, JSX, createEffect, onCleanup, splitProps } from 'solid-js'

export interface ListboxProps extends JSX.HTMLAttributes<HTMLElement> {
  value?: string
  multiple?: boolean
  onChange?: (value: string) => void
  children?: JSX.Element
}

export const Listbox: Component<ListboxProps> = (props) => {
  let ref: HTMLElement | undefined
  const [local, others] = splitProps(props, ['value', 'multiple', 'onChange', 'children'])

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
    <ytz-listbox
      ref={ref}
      multiple={local.multiple || undefined}
      {...others}
    >
      {local.children}
    </ytz-listbox>
  )
}
