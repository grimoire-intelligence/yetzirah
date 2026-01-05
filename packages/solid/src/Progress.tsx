import { Component, JSX, createEffect, splitProps } from 'solid-js'

export interface ProgressProps extends JSX.HTMLAttributes<HTMLElement> {
  value?: number
  max?: number
  indeterminate?: boolean
  variant?: 'linear' | 'circular'
  children?: JSX.Element
}

export const Progress: Component<ProgressProps> = (props) => {
  let ref: HTMLElement | undefined
  const [local, others] = splitProps(props, ['value', 'max', 'indeterminate', 'variant', 'children'])

  createEffect(() => {
    if (!ref || local.value === undefined) return
    ref.setAttribute('value', String(local.value))
  })

  return (
    <ytz-progress
      ref={ref}
      max={local.max}
      indeterminate={local.indeterminate || undefined}
      variant={local.variant}
      {...others}
    >
      {local.children}
    </ytz-progress>
  )
}
