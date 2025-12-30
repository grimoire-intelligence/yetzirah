import { Component, JSX, createEffect, onCleanup, splitProps } from 'solid-js'

export interface AutocompleteProps extends JSX.HTMLAttributes<HTMLElement> {
  value?: string
  placeholder?: string
  disabled?: boolean
  onInput?: (value: string) => void
  onSelect?: (value: string) => void
  children?: JSX.Element
}

export const Autocomplete: Component<AutocompleteProps> = (props) => {
  let ref: HTMLElement | undefined
  const [local, others] = splitProps(props, ['value', 'placeholder', 'disabled', 'onInput', 'onSelect', 'children'])

  createEffect(() => {
    if (!ref || local.value === undefined) return
    ref.setAttribute('value', local.value)
  })

  createEffect(() => {
    if (!ref || !local.onInput) return
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail
      local.onInput?.(detail?.value ?? '')
    }
    ref.addEventListener('input', handler)
    onCleanup(() => ref?.removeEventListener('input', handler))
  })

  createEffect(() => {
    if (!ref || !local.onSelect) return
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail
      local.onSelect?.(detail?.value ?? '')
    }
    ref.addEventListener('select', handler)
    onCleanup(() => ref?.removeEventListener('select', handler))
  })

  return (
    <ytz-autocomplete
      ref={ref}
      placeholder={local.placeholder}
      disabled={local.disabled || undefined}
      {...others}
    >
      {local.children}
    </ytz-autocomplete>
  )
}
