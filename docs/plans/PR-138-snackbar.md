# PR-138: Snackbar/Toast Core Component - Implementation Plan

## Overview

The Snackbar/Toast component provides transient notifications that appear briefly and auto-dismiss. This is a complex component due to queue management (multiple snackbars stacking), auto-dismiss timing, and position anchoring requirements.

**Complexity:** 6 | **Estimated Time:** ~90 minutes | **Dependencies:** None

---

## Component API

### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `open` | boolean | false | Controls snackbar visibility |
| `duration` | number | 5000 | Auto-dismiss time in ms (0 = no auto-dismiss) |
| `position` | string | 'bottom-center' | Position: top-left, top-center, top-right, bottom-left, bottom-center, bottom-right |
| `dismissible` | boolean | true | Shows close button when present |
| `max-visible` | number | 3 | Maximum snackbars visible at same position (oldest dismissed when exceeded) |

### Events

| Event | Detail | Description |
|-------|--------|-------------|
| `dismiss` | `{ reason: 'timeout' \| 'action' \| 'manual' }` | Fired when snackbar closes |

### Methods

| Method | Description |
|--------|-------------|
| `show(message?)` | Shows the snackbar (optionally updates content) |
| `dismiss()` | Programmatically dismisses the snackbar |

---

## Architecture

### Queue Management

Global queue map tracks active snackbars by position:
```javascript
const snackbarQueues = new Map()
// Key: position string (e.g., 'bottom-center')
// Value: array of currently visible snackbars at that position
```

Stack positioning uses CSS custom property `--ytz-snackbar-offset` calculated from heights of snackbars below/above.

### Accessibility

- `role="status"` - Implicit live region for status messages
- `aria-live="polite"` - Announcements wait for user to finish current task
- `aria-atomic="true"` - Announce entire region when content changes
- No focus stealing - snackbar doesn't trap focus like dialog

---

## File Structure

| File | Action | Description |
|------|--------|-------------|
| `packages/core/src/snackbar.js` | create | Component implementation |
| `packages/core/src/snackbar.test.js` | create | Unit tests |
| `packages/core/src/index.js` | modify | Add export |
| `packages/core/src/cdn-entry.js` | modify | Add CDN auto-registration |
| `demos/snackbar.html` | create | Demo page |

---

## Design Decisions

1. **Hover Pause** - Yes, auto-dismiss pauses on hover
2. **Max Queue** - `max-visible` attribute, default 3
3. **Swipe to Dismiss** - Out of scope for v1

---

## Test Categories

- Rendering (hidden by default, ARIA attributes)
- Open/close behavior (events, reasons)
- Auto-dismiss (default duration, custom, disabled)
- Position anchoring (6 positions, validation)
- Queue management (stacking, cleanup)
- Manual dismissal (method, close button)
- Action slot handling
