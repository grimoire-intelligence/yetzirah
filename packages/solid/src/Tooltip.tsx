import { Component, JSX, splitProps } from 'solid-js'

export interface TooltipProps extends JSX.HTMLAttributes<HTMLElement> {
  content?: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
  children?: JSX.Element
}

export const Tooltip: Component<TooltipProps> = (props) => {
  const [local, others] = splitProps(props, ['content', 'position', 'delay', 'children'])

  return (
    <ytz-tooltip
      content={local.content}
      position={local.position}
      delay={local.delay}
      {...others}
    >
      {local.children}
    </ytz-tooltip>
  )
}
