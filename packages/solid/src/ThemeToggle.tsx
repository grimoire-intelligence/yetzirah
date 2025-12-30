import { Component, JSX, createEffect, onCleanup, splitProps } from 'solid-js'

export interface ThemeToggleProps extends JSX.HTMLAttributes<HTMLElement> {
  theme?: 'light' | 'dark' | 'system'
  onChange?: (theme: 'light' | 'dark') => void
  children?: JSX.Element
}

export const ThemeToggle: Component<ThemeToggleProps> = (props) => {
  let ref: HTMLElement | undefined
  const [local, others] = splitProps(props, ['theme', 'onChange', 'children'])

  createEffect(() => {
    if (!ref || !local.theme) return
    ref.setAttribute('theme', local.theme)
  })

  createEffect(() => {
    if (!ref || !local.onChange) return
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail
      local.onChange?.(detail?.theme ?? 'light')
    }
    ref.addEventListener('change', handler)
    onCleanup(() => ref?.removeEventListener('change', handler))
  })

  return (
    <ytz-theme-toggle ref={ref} {...others}>
      {local.children}
    </ytz-theme-toggle>
  )
}
