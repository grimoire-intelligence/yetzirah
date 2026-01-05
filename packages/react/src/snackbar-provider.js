/**
 * SnackbarProvider context for app-wide snackbar management.
 *
 * @module @grimoire/yetzirah-react/snackbar-provider
 */

import { createContext, useContext, useState, useCallback, useRef } from 'react'
import { Snackbar } from './snackbar.js'

const SnackbarContext = createContext(null)

/**
 * Provider component for app-wide snackbar management.
 * Wrap your app with this to use useSnackbarContext anywhere.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - App content
 * @param {number} [props.maxVisible=3] - Maximum visible snackbars
 * @param {string} [props.defaultPosition='bottom-center'] - Default position
 * @param {number} [props.defaultDuration=5000] - Default duration
 * @returns {JSX.Element}
 *
 * @example
 * <SnackbarProvider>
 *   <App />
 * </SnackbarProvider>
 */
export function SnackbarProvider({
  children,
  maxVisible = 3,
  defaultPosition = 'bottom-center',
  defaultDuration = 5000
}) {
  const [snackbars, setSnackbars] = useState([])
  const idCounter = useRef(0)

  const showSnackbar = useCallback((message, options = {}) => {
    const id = ++idCounter.current
    setSnackbars((prev) => [
      ...prev,
      {
        id,
        message,
        duration: options.duration ?? defaultDuration,
        position: options.position ?? defaultPosition,
        dismissible: options.dismissible ?? false,
        className: options.className
      }
    ])
    return id
  }, [defaultDuration, defaultPosition])

  const dismissSnackbar = useCallback((id) => {
    setSnackbars((prev) => prev.filter((s) => s.id !== id))
  }, [])

  const dismissAll = useCallback(() => {
    setSnackbars([])
  }, [])

  const handleDismiss = useCallback((id) => () => {
    dismissSnackbar(id)
  }, [dismissSnackbar])

  return (
    <SnackbarContext.Provider value={{ showSnackbar, dismissSnackbar, dismissAll, snackbars }}>
      {children}
      {snackbars.map((s) => (
        <Snackbar
          key={s.id}
          open
          duration={s.duration}
          position={s.position}
          dismissible={s.dismissible}
          className={s.className}
          maxVisible={maxVisible}
          onDismiss={handleDismiss(s.id)}
        >
          {s.message}
        </Snackbar>
      ))}
    </SnackbarContext.Provider>
  )
}

/**
 * Hook to access snackbar context.
 * Must be used within a SnackbarProvider.
 *
 * @returns {Object} Snackbar context with showSnackbar, dismissSnackbar, dismissAll
 * @throws {Error} If used outside of SnackbarProvider
 *
 * @example
 * function MyComponent() {
 *   const { showSnackbar } = useSnackbarContext()
 *
 *   return (
 *     <Button onClick={() => showSnackbar('Saved!')}>
 *       Save
 *     </Button>
 *   )
 * }
 */
export function useSnackbarContext() {
  const context = useContext(SnackbarContext)
  if (!context) {
    throw new Error('useSnackbarContext must be used within a SnackbarProvider')
  }
  return context
}
