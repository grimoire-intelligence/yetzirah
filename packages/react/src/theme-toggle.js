/**
 * React wrapper for ytz-theme-toggle Web Component.
 * Provides theme switching with persistence and system preference detection.
 *
 * @module @yetzirah/react/theme-toggle
 */

import '@yetzirah/core'
import { forwardRef, useRef, useImperativeHandle, useEffect, useCallback } from 'react'

/**
 * ThemeToggle component - light/dark theme switcher with persistence.
 *
 * @param {Object} props - Component props
 * @param {string} [props.storageKey] - localStorage key for persistence (default: 'yetzirah-theme')
 * @param {boolean} [props.noPersist] - Disable localStorage persistence
 * @param {Function} [props.onThemeChange] - Theme change handler (receives event with detail.theme and detail.isDark)
 * @param {string} [props.className] - CSS classes
 * @param {React.ReactNode} [props.children] - Toggle label (default: 'Dark mode')
 * @param {React.Ref} ref - Forwarded ref
 * @returns {JSX.Element}
 *
 * @example
 * // Basic usage
 * <ThemeToggle />
 *
 * @example
 * // With custom storage key
 * <ThemeToggle storageKey="my-app-theme">Theme</ThemeToggle>
 *
 * @example
 * // Without persistence
 * <ThemeToggle noPersist onThemeChange={(e) => console.log(e.detail.theme)}>
 *   Dark mode
 * </ThemeToggle>
 */
export const ThemeToggle = forwardRef(function ThemeToggle(
  { storageKey, noPersist, onThemeChange, className, children, ...props },
  ref
) {
  const innerRef = useRef(null)

  useImperativeHandle(ref, () => innerRef.current)

  // Handle theme change events from the web component
  const handleThemeChange = useCallback((e) => {
    if (onThemeChange) {
      onThemeChange(e)
    }
  }, [onThemeChange])

  // Set up event listener for theme change events
  useEffect(() => {
    const el = innerRef.current
    if (!el) return

    el.addEventListener('themechange', handleThemeChange)
    return () => el.removeEventListener('themechange', handleThemeChange)
  }, [handleThemeChange])

  return (
    <ytz-theme-toggle
      ref={innerRef}
      class={className}
      storage-key={storageKey}
      no-persist={noPersist || undefined}
      {...props}
    >
      {children}
    </ytz-theme-toggle>
  )
})
