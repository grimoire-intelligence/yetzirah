import { Component, JSX, splitProps } from 'solid-js'

export interface BadgeProps extends JSX.HTMLAttributes<HTMLElement> {
  count?: number
  max?: number
  dot?: boolean
  children?: JSX.Element
}

export const Badge: Component<BadgeProps> = (props) => {
  const [local, others] = splitProps(props, ['count', 'max', 'dot', 'children'])

  return (
    <ytz-badge
      count={local.count}
      max={local.max}
      dot={local.dot || undefined}
      {...others}
    >
      {local.children}
    </ytz-badge>
  )
}
