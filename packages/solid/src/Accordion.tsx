import { Component, JSX, splitProps } from 'solid-js'

export interface AccordionProps extends JSX.HTMLAttributes<HTMLElement> {
  multiple?: boolean
  children?: JSX.Element
}

export const Accordion: Component<AccordionProps> = (props) => {
  const [local, others] = splitProps(props, ['multiple', 'children'])

  return (
    <ytz-accordion multiple={local.multiple || undefined} {...others}>
      {local.children}
    </ytz-accordion>
  )
}
