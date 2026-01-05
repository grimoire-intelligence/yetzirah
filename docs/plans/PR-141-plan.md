# PR-141: Snackbar React Wrapper - Implementation Plan

## Overview

Create a React wrapper for the `<ytz-snackbar>` Web Component implemented in PR-138. The wrapper provides React-idiomatic props, event handling, and imperative methods via ref. Additionally, implement a `useSnackbar` hook and `SnackbarProvider` context for app-wide snackbar management.

**Status:** Ready (PR-138 completed)
**Complexity:** 3 (haiku-level)
**Target:** ~100 lines for core wrapper, ~150 lines for hook/context

---

## Component API

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | boolean | false | Controls snackbar visibility |
| `onDismiss` | (event: CustomEvent) => void | - | Callback when snackbar closes |
| `duration` | number | 5000 | Auto-dismiss time in ms (0 = no auto-dismiss) |
| `position` | SnackbarPosition | 'bottom-center' | Position anchor |
| `dismissible` | boolean | false | Shows close button |
| `maxVisible` | number | 3 | Maximum snackbars at same position |
| `className` | string | - | CSS classes |
| `children` | ReactNode | - | Snackbar message content |

### Ref Methods

```typescript
interface SnackbarRef {
  show: (message?: string) => void
  dismiss: () => void
}
```

---

## File Structure

| File | Action | Description |
|------|--------|-------------|
| `packages/react/src/snackbar.js` | create | React wrapper component |
| `packages/react/src/snackbar.test.js` | create | Unit tests |
| `packages/react/src/use-snackbar.js` | create | useSnackbar hook |
| `packages/react/src/snackbar-provider.js` | create | SnackbarProvider context |
| `packages/react/src/index.js` | modify | Add exports |

---

## Implementation Details

### File: `packages/react/src/snackbar.js`

```javascript
import '@grimoire/yetzirah-core'
import { forwardRef, useRef, useEffect, useImperativeHandle } from 'react'

export const Snackbar = forwardRef(function Snackbar(
  { open, onDismiss, duration, position, dismissible, maxVisible, className, children, ...props },
  ref
) {
  const innerRef = useRef(null)

  useImperativeHandle(ref, () => ({
    show: (message) => innerRef.current?.show(message),
    dismiss: () => innerRef.current?.dismiss(),
    get element() { return innerRef.current }
  }))

  useEffect(() => {
    const el = innerRef.current
    if (!el || open === undefined) return
    if (open) el.setAttribute('open', '')
    else el.removeAttribute('open')
  }, [open])

  useEffect(() => {
    const el = innerRef.current
    if (!el || !onDismiss) return
    el.addEventListener('dismiss', onDismiss)
    return () => el.removeEventListener('dismiss', onDismiss)
  }, [onDismiss])

  return (
    <ytz-snackbar
      ref={innerRef}
      class={className}
      duration={duration}
      position={position}
      dismissible={dismissible || undefined}
      max-visible={maxVisible}
      {...props}
    >
      {children}
    </ytz-snackbar>
  )
})
```

### File: `packages/react/src/use-snackbar.js`

```javascript
import { useState, useCallback, useRef } from 'react'

export function useSnackbar(options = {}) {
  const { duration: defaultDuration = 5000, position: defaultPosition = 'bottom-center', dismissible: defaultDismissible = false } = options

  const [state, setState] = useState({
    open: false, message: '', duration: defaultDuration, position: defaultPosition, dismissible: defaultDismissible
  })

  const show = useCallback((message, overrides = {}) => {
    setState({
      open: true, message,
      duration: overrides.duration ?? defaultDuration,
      position: overrides.position ?? defaultPosition,
      dismissible: overrides.dismissible ?? defaultDismissible
    })
  }, [defaultDuration, defaultPosition, defaultDismissible])

  const dismiss = useCallback(() => setState((prev) => ({ ...prev, open: false })), [])
  const handleDismiss = useCallback(() => setState((prev) => ({ ...prev, open: false })), [])

  const snackbarProps = { open: state.open, duration: state.duration, position: state.position, dismissible: state.dismissible, onDismiss: handleDismiss }

  return { open: state.open, message: state.message, show, dismiss, snackbarProps }
}
```

### File: `packages/react/src/snackbar-provider.js`

```javascript
import { createContext, useContext, useState, useCallback, useRef } from 'react'
import { Snackbar } from './snackbar.js'

const SnackbarContext = createContext(null)

export function SnackbarProvider({ children, maxVisible = 3, defaultPosition = 'bottom-center', defaultDuration = 5000 }) {
  const [snackbars, setSnackbars] = useState([])
  const idCounter = useRef(0)

  const showSnackbar = useCallback((message, options = {}) => {
    const id = ++idCounter.current
    setSnackbars((prev) => [...prev, { id, message, duration: options.duration ?? defaultDuration, position: options.position ?? defaultPosition, dismissible: options.dismissible ?? false, className: options.className }])
    return id
  }, [defaultDuration, defaultPosition])

  const dismissSnackbar = useCallback((id) => setSnackbars((prev) => prev.filter((s) => s.id !== id)), [])
  const dismissAll = useCallback(() => setSnackbars([]), [])
  const handleDismiss = useCallback((id) => () => dismissSnackbar(id), [dismissSnackbar])

  return (
    <SnackbarContext.Provider value={{ showSnackbar, dismissSnackbar, dismissAll, snackbars }}>
      {children}
      {snackbars.map((s) => (
        <Snackbar key={s.id} open duration={s.duration} position={s.position} dismissible={s.dismissible} className={s.className} maxVisible={maxVisible} onDismiss={handleDismiss(s.id)}>{s.message}</Snackbar>
      ))}
    </SnackbarContext.Provider>
  )
}

export function useSnackbarContext() {
  const context = useContext(SnackbarContext)
  if (!context) throw new Error('useSnackbarContext must be used within a SnackbarProvider')
  return context
}
```

---

## Acceptance Criteria

- [ ] `<Snackbar>` component exported
- [ ] `onDismiss` bridges to dismiss event
- [ ] `open` prop controls visibility
- [ ] `duration`, `position`, `dismissible`, `maxVisible` props work
- [ ] Ref exposes `show()` and `dismiss()` methods
- [ ] `useSnackbar` hook for local state management
- [ ] `SnackbarProvider` for app-wide management
- [ ] All tests passing

---

## Critical Files

- `packages/core/src/snackbar.js` - Core component API
- `packages/react/src/dialog.js` - Pattern for open/onClose
- `packages/react/src/tooltip.js` - Pattern for event bridging
