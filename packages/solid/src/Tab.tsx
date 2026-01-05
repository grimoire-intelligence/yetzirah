import { Component, JSX, splitProps } from 'solid-js'

export interface TabProps extends JSX.HTMLAttributes<HTMLElement> {
  value?: string
  disabled?: boolean
  children?: JSX.Element
}

export const Tab: Component<TabProps> = (props) => {
  const [local, others] = splitProps(props, ['value', 'disabled', 'children'])

  return (
    <ytz-tab
      value={local.value}
      disabled={local.disabled || undefined}
      {...others}
    >
      {local.children}
    </ytz-tab>
  )
}
