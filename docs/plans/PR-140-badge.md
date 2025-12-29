# PR-140: Badge Core Component - Implementation Plan

## Overview

Implement `<ytz-badge>` - a notification badge that overlays a count or dot indicator on slotted content. Positions relative to child content with configurable anchor positions.

**Complexity:** 2 | **Estimated Time:** ~30 minutes | **Dependencies:** None

---

## Component API

### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `value` | string/number | undefined | Badge content. If absent = dot mode. If "0" = hidden |
| `max` | number | undefined | Maximum displayed value, shows "max+" when exceeded |
| `position` | string | "top-right" | "top-right", "top-left", "bottom-right", "bottom-left" |
| `hidden` | boolean | false | Explicitly hides the badge |

### Computed States

| State | Condition | Visual Result |
|-------|-----------|---------------|
| **Dot mode** | No `value` attribute | Small circular indicator |
| **Count mode** | `value` > 0 | Shows number or "max+" |
| **Hidden** | `value="0"` OR `hidden` | Badge not visible |

---

## Implementation

### DOM Structure

Badge appends indicator as child element (light DOM):
```html
<ytz-badge value="5">
  <button>Messages</button>
  <span class="ytz-badge-indicator" aria-hidden="true" data-position="top-right" data-mode="count">5</span>
</ytz-badge>
```

### CSS Hooks

```css
/* Position variants */
.ytz-badge-indicator[data-position="top-right"] { ... }

/* Mode variants */
.ytz-badge-indicator[data-mode="dot"] { ... }
.ytz-badge-indicator[data-mode="count"] { ... }
```

### Accessibility

- Badge indicator has `aria-hidden="true"` (supplementary visual)
- Screen reader context should come from parent's `aria-label`

---

## File Structure

| File | Action | Description |
|------|--------|-------------|
| `packages/core/src/badge.js` | create | Component implementation (<80 lines) |
| `packages/core/src/badge.test.js` | create | Unit tests |
| `packages/core/src/index.js` | modify | Add export |
| `demos/badge.html` | create | Demo page |

---

## MUI Migration

| MUI | Yetzirah |
|-----|----------|
| `<Badge badgeContent={5}>` | `<ytz-badge value="5">` |
| `<Badge variant="dot">` | `<ytz-badge>` (no value) |
| `<Badge max={99}>` | `<ytz-badge max="99">` |
| `<Badge invisible>` | `<ytz-badge hidden>` |
| `anchorOrigin={{vertical: 'bottom'}}` | `position="bottom-right"` |

---

## Design Decisions

1. **Text only** - Just `value` attribute, no slot for custom content in v1
2. **CSS-only colors** - Use CSS classes, no `color` attribute
3. **CSS transitions** - No special animation API needed

---

## Test Categories

- Rendering (dot mode, count mode, data attributes)
- Value handling (display, max cap, "99+")
- Hidden states (value="0", hidden attribute)
- Position (default, all 4 positions)
- Property getters/setters
- Dynamic updates
