import { Component, JSX, splitProps } from 'solid-js'

export interface TabPanelProps extends JSX.HTMLAttributes<HTMLElement> {
  value?: string
  children?: JSX.Element
}

export const TabPanel: Component<TabPanelProps> = (props) => {
  const [local, others] = splitProps(props, ['value', 'children'])

  return (
    <ytz-tab-panel value={local.value} {...others}>
      {local.children}
    </ytz-tab-panel>
  )
}
