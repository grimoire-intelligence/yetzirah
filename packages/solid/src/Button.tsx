import { Component, JSX, splitProps } from 'solid-js'

export interface ButtonProps extends JSX.HTMLAttributes<HTMLElement> {
  href?: string
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  children?: JSX.Element
}

export const Button: Component<ButtonProps> = (props) => {
  const [local, others] = splitProps(props, ['href', 'disabled', 'type', 'children'])

  return (
    <ytz-button
      href={local.href}
      disabled={local.disabled || undefined}
      type={local.type}
      {...others}
    >
      {local.children}
    </ytz-button>
  )
}
