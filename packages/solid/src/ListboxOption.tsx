import { Component, JSX, splitProps } from 'solid-js'

export interface ListboxOptionProps extends JSX.HTMLAttributes<HTMLElement> {
  value?: string
  disabled?: boolean
  children?: JSX.Element
}

export const ListboxOption: Component<ListboxOptionProps> = (props) => {
  const [local, others] = splitProps(props, ['value', 'disabled', 'children'])

  return (
    <ytz-listbox-option
      value={local.value}
      disabled={local.disabled || undefined}
      {...others}
    >
      {local.children}
    </ytz-listbox-option>
  )
}
