import { Component, JSX, splitProps } from 'solid-js'

export interface SelectOptionProps extends JSX.HTMLAttributes<HTMLElement> {
  value?: string
  disabled?: boolean
  children?: JSX.Element
}

export const SelectOption: Component<SelectOptionProps> = (props) => {
  const [local, others] = splitProps(props, ['value', 'disabled', 'children'])

  return (
    <ytz-select-option
      value={local.value}
      disabled={local.disabled || undefined}
      {...others}
    >
      {local.children}
    </ytz-select-option>
  )
}
