import { Component, JSX, splitProps } from 'solid-js'

export interface IconButtonProps extends JSX.HTMLAttributes<HTMLElement> {
  'aria-label': string
  disabled?: boolean
  children?: JSX.Element
}

export const IconButton: Component<IconButtonProps> = (props) => {
  const [local, others] = splitProps(props, ['disabled', 'children'])

  return (
    <ytz-icon-button
      disabled={local.disabled || undefined}
      {...others}
    >
      {local.children}
    </ytz-icon-button>
  )
}
