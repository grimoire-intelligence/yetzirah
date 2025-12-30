import { Component, JSX, splitProps } from 'solid-js'

export interface MenuTriggerProps extends JSX.HTMLAttributes<HTMLElement> {
  children?: JSX.Element
}

export const MenuTrigger: Component<MenuTriggerProps> = (props) => {
  const [local, others] = splitProps(props, ['children'])

  return (
    <ytz-menu-trigger {...others}>
      {local.children}
    </ytz-menu-trigger>
  )
}
