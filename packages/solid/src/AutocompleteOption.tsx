import { Component, JSX, splitProps } from 'solid-js'

export interface AutocompleteOptionProps extends JSX.HTMLAttributes<HTMLElement> {
  value?: string
  disabled?: boolean
  children?: JSX.Element
}

export const AutocompleteOption: Component<AutocompleteOptionProps> = (props) => {
  const [local, others] = splitProps(props, ['value', 'disabled', 'children'])

  return (
    <ytz-autocomplete-option
      value={local.value}
      disabled={local.disabled || undefined}
      {...others}
    >
      {local.children}
    </ytz-autocomplete-option>
  )
}
