# PR-142: Progress React Wrapper - Implementation Plan

## Overview

Create React wrappers for the `<ytz-progress>` Web Component, providing React-idiomatic props. The core component supports both circular (spinner) and linear (progress bar) variants, with determinate and indeterminate modes.

**Status:** Ready (PR-139 completed)
**Complexity:** 2 (haiku-level)
**Target:** < 60 lines per file

---

## Component API

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | number \| null | null | Progress 0-100. If null/undefined, indeterminate |
| `linear` | boolean | false | If true, renders as progress bar |
| `size` | "small" \| "medium" \| "large" | "medium" | Size variant |
| `label` | string | - | Accessible label |
| `className` | string | - | CSS classes |

### Derived Components

- `Spinner` - Alias for circular indeterminate
- `LinearProgress` - Alias for `<Progress linear />`
- `CircularProgress` - Explicit circular alias

---

## File Structure

| File | Action | Description |
|------|--------|-------------|
| `packages/react/src/progress.js` | create | Component implementation |
| `packages/react/src/progress.test.js` | create | Unit tests |
| `packages/react/src/index.js` | modify | Add exports |

---

## Implementation

### File: `packages/react/src/progress.js`

```javascript
import '@grimoire/yetzirah-core'
import { forwardRef, useRef, useImperativeHandle, useEffect } from 'react'

export const Progress = forwardRef(function Progress(
  { value, linear, size, label, className, ...props },
  ref
) {
  const innerRef = useRef(null)
  useImperativeHandle(ref, () => innerRef.current)

  useEffect(() => {
    const el = innerRef.current
    if (!el) return
    if (value === null || value === undefined) el.removeAttribute('value')
    else el.setAttribute('value', String(value))
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

export const Spinner = forwardRef(function Spinner(props, ref) {
  return <Progress {...props} ref={ref} linear={false} />
})

export const CircularProgress = forwardRef(function CircularProgress(props, ref) {
  return <Progress {...props} ref={ref} linear={false} />
})

export const LinearProgress = forwardRef(function LinearProgress(props, ref) {
  return <Progress {...props} ref={ref} linear />
})
```

---

## Usage Examples

```jsx
// Indeterminate spinner
<Progress />
<Spinner />

// Determinate circular
<Progress value={75} />

// Linear progress bar
<Progress linear value={50} />
<LinearProgress value={75} />

// With size and label
<Spinner size="small" />
<Progress value={50} label="Download progress" />
```

---

## Acceptance Criteria

- [ ] `Progress` renders `<ytz-progress>`
- [ ] `value` prop syncs to attribute (null removes)
- [ ] `linear` prop controls variant
- [ ] `size`, `label`, `className` pass through
- [ ] Ref forwarding works
- [ ] `Spinner`, `LinearProgress`, `CircularProgress` aliases work
- [ ] All tests passing

---

## Critical Files

- `packages/core/src/progress.js` - Core component API
- `packages/react/src/button.js` - Simple wrapper pattern
- `packages/react/src/slider.js` - Value prop sync pattern
