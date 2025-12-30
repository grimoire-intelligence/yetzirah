import { Component, JSX, splitProps } from 'solid-js'

export interface MenuItemProps extends JSX.HTMLAttributes<HTMLElement> {
  value?: string
  disabled?: boolean
  children?: JSX.Element
}

export const MenuItem: Component<MenuItemProps> = (props) => {
  const [local, others] = splitProps(props, ['value', 'disabled', 'children'])

  return (
    <ytz-menu-item
      value={local.value}
      disabled={local.disabled || undefined}
      {...others}
    >
      {local.children}
    </ytz-menu-item>
  )
}
