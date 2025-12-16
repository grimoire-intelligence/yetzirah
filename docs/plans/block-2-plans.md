# Block 2 Implementation Plans

Block 2 contains the Button React Wrapper and Documentation PRs.

**Dependency:** PR-002 (Button Component Core) - **COMPLETED**

---

## PR-003: Button React Wrapper

### Overview
Create a thin React wrapper for the `<ytz-button>` Web Component, providing React-idiomatic APIs for event handling, ref forwarding, and prop passing.

### Target: < 50 lines

### Prerequisites
- Install `@testing-library/react` for tests: `pnpm add -D @testing-library/react -w`

### Files to Create/Modify

1. **`packages/react/src/button.js`** (create)
2. **`packages/react/src/button.test.js`** (create)  
3. **`packages/react/src/index.js`** (modify - add export)

### Implementation Details

#### `packages/react/src/button.js`

```javascript
/**
 * React wrapper for ytz-button Web Component.
 * Provides polymorphic button/anchor based on props.
 * 
 * @module @yetzirah/react/button
 */

import '@yetzirah/core/button.js'
import { forwardRef, useRef, useImperativeHandle } from 'react'

/**
 * Button component - renders as <a> when href provided, <button> otherwise.
 * 
 * @param {Object} props - Component props
 * @param {string} [props.href] - If provided, renders as anchor
 * @param {Function} [props.onClick] - Click handler
 * @param {string} [props.className] - CSS classes (appended to defaults)
 * @param {boolean} [props.disabled] - Disable button (button only)
 * @param {string} [props.type] - Button type (button only): 'button' | 'submit' | 'reset'
 * @param {React.ReactNode} props.children - Button content
 * @param {React.Ref} ref - Forwarded ref
 * @returns {JSX.Element}
 * 
 * @example
 * // Link button
 * <Button href="/dashboard" className="ph3 pv2 br2 white bg-blue">
 *   Dashboard
 * </Button>
 * 
 * @example
 * // Action button
 * <Button onClick={handleSubmit} className="ph3 pv2 br2 white bg-blue">
 *   Submit
 * </Button>
 */
export const Button = forwardRef(function Button(
  { href, onClick, className, disabled, type, children, ...props },
  ref
) {
  const innerRef = useRef(null)
  
  useImperativeHandle(ref, () => innerRef.current)
  
  return (
    <ytz-button
      ref={innerRef}
      href={href}
      class={className}
      disabled={disabled || undefined}
      type={type}
      onClick={onClick}
      {...props}
    >
      {children}
    </ytz-button>
  )
})
```

**Key Design Decisions:**
- Use `forwardRef` for ref forwarding to the underlying element
- Pass `className` as `class` (Web Component attribute)
- Pass `onClick` directly (works with custom elements in React 18+)
- Convert `disabled={false}` to `undefined` to remove the attribute
- Spread remaining props for flexibility (aria-*, data-*, etc.)

#### `packages/react/src/button.test.js`

**NOTE:** Must import `jest` from `@jest/globals` for ESM compatibility.

```javascript
/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from './button.js'
import { createRef } from 'react'

// Import core component for custom element registration
import '@yetzirah/core'

describe('Button', () => {
  test('renders children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  test('passes href to ytz-button', () => {
    render(<Button href="/test">Link</Button>)
    const button = screen.getByText('Link').closest('ytz-button')
    expect(button).toHaveAttribute('href', '/test')
  })

  test('calls onClick handler', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click</Button>)
    fireEvent.click(screen.getByText('Click'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  test('passes className as class attribute', () => {
    render(<Button className="test-class">Styled</Button>)
    const button = screen.getByText('Styled').closest('ytz-button')
    expect(button).toHaveAttribute('class', 'test-class')
  })

  test('forwards ref to ytz-button element', () => {
    const ref = createRef()
    render(<Button ref={ref}>Ref test</Button>)
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current.tagName.toLowerCase()).toBe('ytz-button')
  })

  test('handles disabled state', () => {
    render(<Button disabled>Disabled</Button>)
    const button = screen.getByText('Disabled').closest('ytz-button')
    expect(button).toHaveAttribute('disabled')
  })

  test('passes type attribute for form buttons', () => {
    render(<Button type="submit">Submit</Button>)
    const button = screen.getByText('Submit').closest('ytz-button')
    expect(button).toHaveAttribute('type', 'submit')
  })

  test('passes aria attributes through', () => {
    render(<Button aria-label="Close dialog">X</Button>)
    const button = screen.getByText('X').closest('ytz-button')
    expect(button).toHaveAttribute('aria-label', 'Close dialog')
  })
})
```

#### `packages/react/src/index.js` modification

Add export:
```javascript
export { Button } from './button.js'
```

### Acceptance Criteria Checklist
- [ ] `onClick` prop bridged to element
- [ ] `href` prop handled correctly  
- [ ] `className` passed through as `class`
- [ ] Ref forwarding works
- [ ] < 50 lines implementation
- [ ] All tests pass

---

## PR-004: Button Documentation & Demo

### Overview
Create a static HTML demo page showing all button variants and complete JSDoc documentation with examples.

### Files to Create/Modify

1. **`demos/button.html`** (create)
2. **`demos/index.html`** (modify - update link)

### Implementation Details

#### `demos/button.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Button - Yetzirah Demo</title>
  <link rel="stylesheet" href="https://unpkg.com/tachyons@4/css/tachyons.min.css">
  <script type="module" src="../packages/core/dist/index.js"></script>
  <style>
    .demo-row {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      align-items: center;
    }
  </style>
</head>
<body class="sans-serif pa4 mw8 center">
  <header class="mb4">
    <nav class="mb3">
      <a href="index.html" class="link blue">&larr; All Components</a>
    </nav>
    <h1 class="f2 fw6 mb2">Button</h1>
    <p class="f5 lh-copy gray mt0">
      Polymorphic button/anchor component. Renders <code>&lt;a&gt;</code> when 
      <code>href</code> is provided, <code>&lt;button&gt;</code> otherwise.
    </p>
  </header>

  <main>
    <!-- Link Buttons -->
    <section class="mb5">
      <h2 class="f4 fw6 mb3">Link Buttons (with href)</h2>
      <p class="lh-copy mb3">
        When <code>href</code> is provided, renders as an anchor element with 
        default classes: <code>pointer font-inherit no-underline dib</code>
      </p>
      
      <div class="demo-row mb3">
        <ytz-button href="#contained" class="ph3 pv2 br2 white bg-blue">
          Contained
        </ytz-button>
        <ytz-button href="#outlined" class="ph3 pv2 br2 ba b--blue blue bg-transparent">
          Outlined
        </ytz-button>
        <ytz-button href="#text" class="ph3 pv2 blue">
          Text
        </ytz-button>
      </div>

      <pre class="f6 bg-near-white pa3 br2 overflow-auto"><code>&lt;ytz-button href="/dashboard" class="ph3 pv2 br2 white bg-blue"&gt;
  Dashboard
&lt;/ytz-button&gt;</code></pre>
    </section>

    <!-- Action Buttons -->
    <section class="mb5">
      <h2 class="f4 fw6 mb3">Action Buttons (with onclick)</h2>
      <p class="lh-copy mb3">
        Without <code>href</code>, renders as a button element with 
        default classes: <code>pointer font-inherit bn bg-transparent</code>
      </p>
      
      <div class="demo-row mb3">
        <ytz-button onclick="alert('Clicked!')" class="ph3 pv2 br2 white bg-blue">
          Contained
        </ytz-button>
        <ytz-button onclick="alert('Clicked!')" class="ph3 pv2 br2 ba b--blue blue bg-white">
          Outlined
        </ytz-button>
        <ytz-button onclick="alert('Clicked!')" class="ph3 pv2 blue">
          Text
        </ytz-button>
      </div>

      <pre class="f6 bg-near-white pa3 br2 overflow-auto"><code>&lt;ytz-button onclick="handleSubmit()" class="ph3 pv2 br2 white bg-blue"&gt;
  Submit
&lt;/ytz-button&gt;</code></pre>
    </section>

    <!-- Sizes -->
    <section class="mb5">
      <h2 class="f4 fw6 mb3">Sizes</h2>
      <p class="lh-copy mb3">
        Size is controlled via Tachyons classes, not props.
      </p>
      
      <div class="demo-row mb3">
        <ytz-button onclick="void(0)" class="f6 ph2 pv1 br2 white bg-blue">
          Small
        </ytz-button>
        <ytz-button onclick="void(0)" class="f5 ph3 pv2 br2 white bg-blue">
          Medium
        </ytz-button>
        <ytz-button onclick="void(0)" class="f4 ph4 pv3 br2 white bg-blue">
          Large
        </ytz-button>
      </div>

      <table class="f6 w-100 collapse ba b--light-gray">
        <thead>
          <tr class="bg-near-white">
            <th class="pa2 tl">Size</th>
            <th class="pa2 tl">Tachyons Classes</th>
          </tr>
        </thead>
        <tbody>
          <tr class="bt b--light-gray"><td class="pa2">Small</td><td class="pa2 code">f6 ph2 pv1</td></tr>
          <tr class="bt b--light-gray"><td class="pa2">Medium</td><td class="pa2 code">f5 ph3 pv2</td></tr>
          <tr class="bt b--light-gray"><td class="pa2">Large</td><td class="pa2 code">f4 ph4 pv3</td></tr>
        </tbody>
      </table>
    </section>

    <!-- Colors -->
    <section class="mb5">
      <h2 class="f4 fw6 mb3">Colors</h2>
      
      <div class="demo-row mb3">
        <ytz-button onclick="void(0)" class="ph3 pv2 br2 white bg-blue">Primary</ytz-button>
        <ytz-button onclick="void(0)" class="ph3 pv2 br2 white bg-purple">Secondary</ytz-button>
        <ytz-button onclick="void(0)" class="ph3 pv2 br2 white bg-red">Error</ytz-button>
        <ytz-button onclick="void(0)" class="ph3 pv2 br2 white bg-green">Success</ytz-button>
        <ytz-button onclick="void(0)" class="ph3 pv2 br2 white bg-orange">Warning</ytz-button>
      </div>

      <table class="f6 w-100 collapse ba b--light-gray">
        <thead>
          <tr class="bg-near-white">
            <th class="pa2 tl">Color</th>
            <th class="pa2 tl">Contained</th>
            <th class="pa2 tl">Outlined</th>
          </tr>
        </thead>
        <tbody>
          <tr class="bt b--light-gray"><td class="pa2">Primary</td><td class="pa2 code">bg-blue white</td><td class="pa2 code">blue b--blue</td></tr>
          <tr class="bt b--light-gray"><td class="pa2">Secondary</td><td class="pa2 code">bg-purple white</td><td class="pa2 code">purple b--purple</td></tr>
          <tr class="bt b--light-gray"><td class="pa2">Error</td><td class="pa2 code">bg-red white</td><td class="pa2 code">red b--red</td></tr>
          <tr class="bt b--light-gray"><td class="pa2">Success</td><td class="pa2 code">bg-green white</td><td class="pa2 code">green b--green</td></tr>
          <tr class="bt b--light-gray"><td class="pa2">Warning</td><td class="pa2 code">bg-orange white</td><td class="pa2 code">orange b--orange</td></tr>
        </tbody>
      </table>
    </section>

    <!-- Disabled State -->
    <section class="mb5">
      <h2 class="f4 fw6 mb3">Disabled State</h2>
      
      <div class="demo-row mb3">
        <ytz-button disabled class="ph3 pv2 br2 white bg-blue o-50">
          Disabled Button
        </ytz-button>
        <ytz-button href="#" disabled class="ph3 pv2 br2 white bg-blue o-50">
          Disabled Link
        </ytz-button>
      </div>

      <pre class="f6 bg-near-white pa3 br2 overflow-auto"><code>&lt;ytz-button disabled class="... o-50"&gt;Disabled&lt;/ytz-button&gt;</code></pre>
    </section>

    <!-- MUI Migration -->
    <section class="mb5">
      <h2 class="f4 fw6 mb3">MUI Migration Examples</h2>
      
      <div class="overflow-auto">
        <table class="f6 w-100 collapse ba b--light-gray">
          <thead>
            <tr class="bg-near-white">
              <th class="pa2 tl">MUI</th>
              <th class="pa2 tl">Yetzirah</th>
            </tr>
          </thead>
          <tbody>
            <tr class="bt b--light-gray">
              <td class="pa2 code">&lt;Button variant="contained"&gt;</td>
              <td class="pa2 code">&lt;ytz-button class="ph3 pv2 br2 white bg-blue"&gt;</td>
            </tr>
            <tr class="bt b--light-gray">
              <td class="pa2 code">&lt;Button variant="outlined"&gt;</td>
              <td class="pa2 code">&lt;ytz-button class="ph3 pv2 br2 ba b--blue blue"&gt;</td>
            </tr>
            <tr class="bt b--light-gray">
              <td class="pa2 code">&lt;Button variant="text"&gt;</td>
              <td class="pa2 code">&lt;ytz-button class="ph3 pv2 blue"&gt;</td>
            </tr>
            <tr class="bt b--light-gray">
              <td class="pa2 code">&lt;Button component={Link} to="/x"&gt;</td>
              <td class="pa2 code">&lt;ytz-button href="/x"&gt;</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- React Usage -->
    <section class="mb5">
      <h2 class="f4 fw6 mb3">React Usage</h2>
      
      <pre class="f6 bg-near-white pa3 br2 overflow-auto"><code>import { Button } from '@yetzirah/react'

function App() {
  const [count, setCount] = useState(0)
  
  return (
    &lt;&gt;
      {/* Link button */}
      &lt;Button href="/dashboard" className="ph3 pv2 br2 white bg-blue"&gt;
        Dashboard
      &lt;/Button&gt;
      
      {/* Action button */}
      &lt;Button onClick={() => setCount(c => c + 1)} className="ph3 pv2 br2 white bg-blue"&gt;
        Count: {count}
      &lt;/Button&gt;
      
      {/* Form submit */}
      &lt;Button type="submit" className="ph3 pv2 br2 white bg-green"&gt;
        Submit
      &lt;/Button&gt;
    &lt;/&gt;
  )
}</code></pre>
    </section>
  </main>

  <footer class="mt5 pt4 bt b--light-gray">
    <p class="f6 gray">
      <a href="index.html" class="link blue">Back to all components</a>
    </p>
  </footer>
</body>
</html>
```

#### `demos/index.html` modification

Update the Button link from "Coming Soon" to active:

```html
<li class="pv2">
  <a href="button.html" class="link blue">Button</a>
  <span class="f6 gray ml2">- Polymorphic button/anchor component</span>
</li>
```

### Acceptance Criteria Checklist
- [ ] Demo shows: link-button, action-button, styled variants
- [ ] Works when opened directly in browser (no build required)
- [ ] JSDoc complete with examples in source files
- [ ] Size and color reference tables included
- [ ] MUI migration examples included
- [ ] React usage examples included

---

## Execution Order

1. ~~**Prerequisite:** PR-002 (Button Core) must be complete~~ **DONE**
2. **PR-003:** Implement React wrapper + tests
3. **PR-004:** Create demo page, update index

## Notes

- The React wrapper is intentionally thin (< 50 lines target)
- React 18+ handles Web Component events natively, so no special bridging needed
- **ESM Testing:** Import `jest` from `@jest/globals` in test files
- The demo page must work without a build step (opens directly in browser)
- Demo uses the built dist files, so `pnpm build` must run first
- May need to install `@testing-library/react` for React tests
