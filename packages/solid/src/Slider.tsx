import { Component, JSX, createEffect, onCleanup, splitProps } from 'solid-js'

export interface SliderProps extends JSX.HTMLAttributes<HTMLElement> {
  value?: number
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  onChange?: (value: number) => void
  children?: JSX.Element
}

export const Slider: Component<SliderProps> = (props) => {
  let ref: HTMLElement | undefined
  const [local, others] = splitProps(props, ['value', 'min', 'max', 'step', 'disabled', 'onChange', 'children'])

  createEffect(() => {
    if (!ref || local.value === undefined) return
    ref.setAttribute('value', String(local.value))
  })

  createEffect(() => {
    if (!ref || !local.onChange) return
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail
      local.onChange?.(detail?.value ?? 0)
    }
    ref.addEventListener('change', handler)
    onCleanup(() => ref?.removeEventListener('change', handler))
  })

  return (
    <ytz-slider
      ref={ref}
      min={local.min}
      max={local.max}
      step={local.step}
      disabled={local.disabled || undefined}
      {...others}
    >
      {local.children}
    </ytz-slider>
  )
}
