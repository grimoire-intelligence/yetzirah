/**
 * React wrapper for ytz-progress Web Component.
 * Provides circular spinner and linear progress bar variants.
 *
 * @module @grimoire/yetzirah-react/progress
 */

import '@grimoire/yetzirah-core'
import { forwardRef, useRef, useImperativeHandle, useEffect } from 'react'

/**
 * Progress component - spinner or progress bar.
 *
 * @param {Object} props - Component props
 * @param {number|null} [props.value] - Progress 0-100. Null/undefined for indeterminate
 * @param {boolean} [props.linear] - If true, renders as progress bar
 * @param {string} [props.size='medium'] - Size: 'small', 'medium', 'large'
 * @param {string} [props.label] - Accessible label
 * @param {string} [props.className] - CSS classes
 * @param {React.Ref} ref - Forwarded ref
 * @returns {JSX.Element}
 *
 * @example
 * // Indeterminate spinner
 * <Progress />
 *
 * @example
 * // Determinate progress bar
 * <Progress linear value={75} />
 */
export const Progress = forwardRef(function Progress(
  { value, linear, size, label, className, ...props },
  ref
) {
  const innerRef = useRef(null)

  useImperativeHandle(ref, () => innerRef.current)

  // Sync value prop - null/undefined = indeterminate
  useEffect(() => {
    const el = innerRef.current
    if (!el) return

    if (value === null || value === undefined) {
      el.removeAttribute('value')
    } else {
      el.setAttribute('value', String(value))
    }
  }, [value])

  return (
    <ytz-progress
      ref={innerRef}
      class={className}
      value={value ?? undefined}
      linear={linear || undefined}
      size={size}
      label={label}
      {...props}
    />
  )
})

/**
 * Spinner component - alias for indeterminate circular progress.
 *
 * @param {Object} props - Same props as Progress (except linear)
 * @param {React.Ref} ref - Forwarded ref
 * @returns {JSX.Element}
 *
 * @example
 * <Spinner size="small" />
 */
export const Spinner = forwardRef(function Spinner(props, ref) {
  return <Progress {...props} ref={ref} linear={false} />
})

/**
 * CircularProgress component - explicit circular variant.
 *
 * @param {Object} props - Same props as Progress (except linear)
 * @param {React.Ref} ref - Forwarded ref
 * @returns {JSX.Element}
 *
 * @example
 * <CircularProgress value={75} />
 */
export const CircularProgress = forwardRef(function CircularProgress(props, ref) {
  return <Progress {...props} ref={ref} linear={false} />
})

/**
 * LinearProgress component - progress bar variant.
 *
 * @param {Object} props - Same props as Progress (linear is forced true)
 * @param {React.Ref} ref - Forwarded ref
 * @returns {JSX.Element}
 *
 * @example
 * <LinearProgress value={50} />
 */
export const LinearProgress = forwardRef(function LinearProgress(props, ref) {
  return <Progress {...props} ref={ref} linear />
})
