# PR-143: Badge React Wrapper - Implementation Plan

## Overview

Create a thin React wrapper for `<ytz-badge>` Web Component, providing React-idiomatic props and ref forwarding. This is the simplest wrapper - pure prop passthrough with no event bridging.

**Status:** Ready (PR-140 completed)
**Complexity:** 2 (haiku-level)
**Target:** < 50 lines

---

## Component API

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `badgeContent` | string \| number | undefined | Badge value. Omit for dot mode |
| `max` | number | undefined | Cap displayed value, shows "max+" |
| `invisible` | boolean | false | Hides the badge |
| `position` | 'top-right' \| 'top-left' \| 'bottom-right' \| 'bottom-left' | 'top-right' | Badge position |
| `className` | string | - | CSS classes |
| `children` | ReactNode | - | Anchored content |

### MUI Compatibility Mapping

| React Wrapper Prop | Web Component Attribute |
|-------------------|-------------------------|
| `badgeContent={5}` | `value="5"` |
| (no badgeContent) | (no value) = dot mode |
| `invisible` | `hidden` |

---

## File Structure

| File | Action | Description |
|------|--------|-------------|
| `packages/react/src/badge.js` | create | ~40 lines |
| `packages/react/src/badge.test.js` | create | Unit tests |
| `packages/react/src/index.js` | modify | Add export |

---

## Implementation

### File: `packages/react/src/badge.js`

```javascript
import '@grimoire/yetzirah-core'
import { forwardRef, useRef, useImperativeHandle } from 'react'

export const Badge = forwardRef(function Badge(
  { badgeContent, max, invisible, position, className, children, ...props },
  ref
) {
  const innerRef = useRef(null)
  useImperativeHandle(ref, () => innerRef.current)

  return (
    <ytz-badge
      ref={innerRef}
      value={badgeContent}
      max={max}
      position={position}
      hidden={invisible || undefined}
      class={className}
      {...props}
    >
      {children}
    </ytz-badge>
  )
})
```

---

## Usage Examples

```jsx
// Count badge
<Badge badgeContent={5} max={99}>
  <button>Notifications</button>
</Badge>

// Dot badge (no content)
<Badge>
  <span>New</span>
</Badge>

// Position variants
<Badge badgeContent={5} position="top-left">
  <button>Messages</button>
</Badge>

// Conditional visibility
<Badge badgeContent={count} invisible={count === 0}>
  <button>Inbox</button>
</Badge>
```

---

## Acceptance Criteria

- [ ] `<Badge>` component exported
- [ ] `badgeContent` sets value attribute
- [ ] `max` caps displayed value
- [ ] `invisible` sets hidden attribute
- [ ] `position` controls placement
- [ ] `children` rendered as anchored content
- [ ] Ref forwarding works
- [ ] `className`, ARIA, data attributes pass through
- [ ] All tests passing

---

## Critical Files

- `packages/core/src/badge.js` - Core component API
- `packages/react/src/chip.js` - Similar simple wrapper pattern
