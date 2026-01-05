/**
 * useSnackbar hook for local snackbar state management.
 *
 * @module @grimoire/yetzirah-react/use-snackbar
 */

import { useState, useCallback } from 'react'

/**
 * Hook for managing snackbar state.
 * Returns state and handlers for use with the Snackbar component.
 *
 * @param {Object} [options] - Default options
 * @param {number} [options.duration=5000] - Default duration in ms
 * @param {string} [options.position='bottom-center'] - Default position
 * @param {boolean} [options.dismissible=false] - Default dismissible state
 * @returns {Object} Snackbar state and controls
 *
 * @example
 * function MyComponent() {
 *   const { open, message, show, snackbarProps } = useSnackbar()
 *
 *   return (
 *     <>
 *       <Button onClick={() => show('Saved!')}>Save</Button>
 *       <Snackbar {...snackbarProps}>{message}</Snackbar>
 *     </>
 *   )
 * }
 */
export function useSnackbar(options = {}) {
  const {
    duration: defaultDuration = 5000,
    position: defaultPosition = 'bottom-center',
    dismissible: defaultDismissible = false
  } = options

  const [state, setState] = useState({
    open: false,
    message: '',
    duration: defaultDuration,
    position: defaultPosition,
    dismissible: defaultDismissible
  })

  const show = useCallback((message, overrides = {}) => {
    setState({
      open: true,
      message,
      duration: overrides.duration ?? defaultDuration,
      position: overrides.position ?? defaultPosition,
      dismissible: overrides.dismissible ?? defaultDismissible
    })
  }, [defaultDuration, defaultPosition, defaultDismissible])

  const dismiss = useCallback(() => {
    setState((prev) => ({ ...prev, open: false }))
  }, [])

  const handleDismiss = useCallback(() => {
    setState((prev) => ({ ...prev, open: false }))
  }, [])

  const snackbarProps = {
    open: state.open,
    duration: state.duration,
    position: state.position,
    dismissible: state.dismissible,
    onDismiss: handleDismiss
  }

  return {
    open: state.open,
    message: state.message,
    show,
    dismiss,
    snackbarProps
  }
}
