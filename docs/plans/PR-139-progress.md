# PR-139: Progress/Spinner Core Component - Implementation Plan

## Overview

Implement `<ytz-progress>` - a progress indicator supporting both indeterminate (spinner) and determinate (progress bar) modes, with circular and linear visual variants. CSS-driven animations with no JavaScript animation loops.

**Complexity:** 3 | **Estimated Time:** ~45 minutes | **Dependencies:** None

---

## Design Decision: Single Polymorphic Component

Single `<ytz-progress>` with boolean `linear` attribute (like `ytz-button` with `href`).

Rationale:
- Developers think of these as one component
- Minimal weight added by polymorphism
- ~80% code reuse between variants

---

## Component API

### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `value` | number | null | Progress 0-100. If not set, component is indeterminate |
| `linear` | boolean | false | If present, renders as progress bar instead of spinner |
| `size` | string | "medium" | "small", "medium", or "large" |
| `label` | string | null | Optional accessible label (becomes aria-label) |

### Usage

```html
<!-- Circular spinner (default) -->
<ytz-progress></ytz-progress>
<ytz-progress value="50"></ytz-progress>

<!-- Linear progress bar -->
<ytz-progress linear></ytz-progress>
<ytz-progress linear value="75"></ytz-progress>
```

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `value` | number \| null | Get/set progress value (null = indeterminate) |
| `linear` | boolean | Get/set linear mode |
| `indeterminate` | boolean (readonly) | True if no value set |

### ARIA (Auto-managed)

| Attribute | When Applied | Value |
|-----------|--------------|-------|
| `role` | Always | "progressbar" |
| `aria-valuenow` | Determinate only | Current value (0-100) |
| `aria-valuemin` | Determinate only | "0" |
| `aria-valuemax` | Determinate only | "100" |

In indeterminate mode, `aria-valuenow/min/max` are **removed** per WAI-ARIA spec.

---

## CSS Animation Approach

### Indeterminate (CSS-only)

**Circular:**
```css
@keyframes ytz-spin {
  to { transform: rotate(360deg); }
}
```

**Linear:**
```css
@keyframes ytz-indeterminate {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(200%); }
}
```

### Determinate

Uses CSS custom property `--progress-percent` set by JavaScript:
- Circular: `stroke-dashoffset` on SVG circle
- Linear: `width` on progress bar div

---

## File Structure

| File | Action | Description |
|------|--------|-------------|
| `packages/core/src/progress.js` | create | Component implementation |
| `packages/core/src/progress.test.js` | create | Unit tests |
| `packages/core/src/index.js` | modify | Add export |
| `demos/progress.html` | create | Demo page |

---

## Design Decisions

1. **Boolean `linear` attribute** - Not `variant` prop, matches Yetzirah idiom
2. **SVG for circular** - Better browser support, smoother animation
3. **0-100 percentage only** - No custom `max` for v1
4. **No buffer indicator** - Can be added later

---

## Test Categories

- Rendering (role, SVG vs div structure)
- Indeterminate mode (no ARIA values, data attribute)
- Determinate mode (ARIA values, CSS property, clamping)
- Accessibility (aria-label handling)
- Property getters/setters
- Attribute change reactions
