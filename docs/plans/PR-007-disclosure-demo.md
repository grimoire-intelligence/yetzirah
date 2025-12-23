# PR-007: Disclosure Documentation & Demo

## Overview
Create static HTML demo page showcasing the disclosure component with various use cases and styling options. Also ensure JSDoc documentation is complete.

**Status:** Blocked by PR-006
**Complexity:** 2 (haiku-level)
**Target:** Works in browser without build step

## Demo Page Structure

The demo page should showcase:
1. Basic disclosure (collapsed by default)
2. Initially open disclosure
3. Styled disclosure with Tachyons
4. CSS animation examples
5. Nested content
6. FAQ pattern (multiple disclosures)

## Implementation Plan

### File: `demos/disclosure.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Disclosure Component - Yetzirah</title>
  <link rel="stylesheet" href="https://unpkg.com/tachyons@4/css/tachyons.min.css">
  <style>
    /* Animation example styles */
    .disclosure-animated [hidden] {
      display: block !important;
      max-height: 0;
      overflow: hidden;
      opacity: 0;
      transition: max-height 0.3s ease-out, opacity 0.2s ease-out;
    }

    .disclosure-animated:not([hidden]) > div:last-child {
      max-height: 500px;
      opacity: 1;
    }

    /* Chevron rotation */
    .disclosure-chevron {
      transition: transform 0.2s;
    }
    ytz-disclosure[open] .disclosure-chevron {
      transform: rotate(180deg);
    }

    /* Demo layout */
    .demo-section {
      border-bottom: 1px solid #e0e0e0;
    }
    .demo-section:last-child {
      border-bottom: none;
    }
  </style>
</head>
<body class="sans-serif pa4 mw8 center">
  <header class="mb5">
    <nav class="mb3">
      <a href="index.html" class="link blue">Home</a>
      <span class="gray"> / </span>
      <span>Disclosure</span>
    </nav>
    <h1 class="f2 fw6 mb2">Disclosure</h1>
    <p class="f5 lh-copy gray mt0">
      Expandable content with aria-expanded. Animation-friendly open/close states.
    </p>
  </header>

  <main>
    <!-- Basic Usage -->
    <section class="demo-section pv4">
      <h2 class="f4 fw6 mb3">Basic Usage</h2>
      <p class="lh-copy mb3">
        Click the button to toggle content visibility. The disclosure handles
        ARIA attributes automatically.
      </p>

      <ytz-disclosure class="db mb3">
        <button class="ph3 pv2 br2 bg-blue white bn pointer">
          Show Details
        </button>
        <div class="pa3 bg-light-gray mt2 br2">
          <p class="ma0 lh-copy">
            This content is hidden by default. Click the button to toggle visibility.
            The component automatically manages <code>aria-expanded</code> and
            <code>aria-controls</code> attributes.
          </p>
        </div>
      </ytz-disclosure>

      <pre class="f6 bg-near-white pa3 br2 overflow-auto"><code>&lt;ytz-disclosure&gt;
  &lt;button class="ph3 pv2 br2 bg-blue white bn pointer"&gt;
    Show Details
  &lt;/button&gt;
  &lt;div class="pa3 bg-light-gray mt2 br2"&gt;
    Hidden content...
  &lt;/div&gt;
&lt;/ytz-disclosure&gt;</code></pre>
    </section>

    <!-- Initially Open -->
    <section class="demo-section pv4">
      <h2 class="f4 fw6 mb3">Initially Open</h2>
      <p class="lh-copy mb3">
        Use the <code>open</code> attribute to start with content visible.
      </p>

      <ytz-disclosure open class="db mb3">
        <button class="ph3 pv2 br2 bg-green white bn pointer">
          Hide Details
        </button>
        <div class="pa3 bg-washed-green mt2 br2">
          <p class="ma0 lh-copy">
            This content is visible by default because the <code>open</code>
            attribute is present.
          </p>
        </div>
      </ytz-disclosure>

      <pre class="f6 bg-near-white pa3 br2 overflow-auto"><code>&lt;ytz-disclosure open&gt;
  &lt;button&gt;Hide Details&lt;/button&gt;
  &lt;div&gt;Visible content...&lt;/div&gt;
&lt;/ytz-disclosure&gt;</code></pre>
    </section>

    <!-- With Animation -->
    <section class="demo-section pv4">
      <h2 class="f4 fw6 mb3">With CSS Animation</h2>
      <p class="lh-copy mb3">
        Add smooth transitions with CSS. The component uses the <code>hidden</code>
        attribute which you can override for animation.
      </p>

      <ytz-disclosure class="db mb3 disclosure-animated">
        <button class="ph3 pv2 br2 ba b--blue blue bg-transparent pointer flex items-center">
          <span>Animated Disclosure</span>
          <svg class="disclosure-chevron ml2" width="12" height="12" viewBox="0 0 12 12">
            <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" stroke-width="2"/>
          </svg>
        </button>
        <div class="pa3 bg-washed-blue mt2 br2">
          <p class="ma0 lh-copy">
            This content animates smoothly when toggled. The CSS overrides
            the <code>hidden</code> attribute to use max-height and opacity
            transitions instead of display:none.
          </p>
        </div>
      </ytz-disclosure>

      <pre class="f6 bg-near-white pa3 br2 overflow-auto"><code>/* CSS for animation */
.disclosure-animated [hidden] {
  display: block !important;
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  transition: max-height 0.3s, opacity 0.2s;
}

.disclosure-animated:not([hidden]) > div:last-child {
  max-height: 500px;
  opacity: 1;
}

/* Chevron rotation */
ytz-disclosure[open] .disclosure-chevron {
  transform: rotate(180deg);
}</code></pre>
    </section>

    <!-- FAQ Pattern -->
    <section class="demo-section pv4">
      <h2 class="f4 fw6 mb3">FAQ Pattern</h2>
      <p class="lh-copy mb3">
        Multiple disclosures work independently. For coordinated behavior
        (only one open at a time), use the Accordion component instead.
      </p>

      <div class="ba b--light-gray br2">
        <ytz-disclosure class="db bb b--light-gray">
          <button class="w-100 pa3 tl bg-transparent bn pointer flex justify-between items-center">
            <span class="fw5">What is Yetzirah?</span>
            <span class="disclosure-chevron">+</span>
          </button>
          <div class="pa3 bg-near-white">
            <p class="ma0 lh-copy">
              Yetzirah is an AI-native, unstyled Web Component library providing
              Material-like behavior without the styling overhead.
            </p>
          </div>
        </ytz-disclosure>

        <ytz-disclosure class="db bb b--light-gray">
          <button class="w-100 pa3 tl bg-transparent bn pointer flex justify-between items-center">
            <span class="fw5">Why no Shadow DOM?</span>
            <span class="disclosure-chevron">+</span>
          </button>
          <div class="pa3 bg-near-white">
            <p class="ma0 lh-copy">
              Yetzirah ships no styles, so style encapsulation solves nothing.
              Light DOM allows Tachyons and user CSS to work naturally.
            </p>
          </div>
        </ytz-disclosure>

        <ytz-disclosure class="db">
          <button class="w-100 pa3 tl bg-transparent bn pointer flex justify-between items-center">
            <span class="fw5">How small is the bundle?</span>
            <span class="disclosure-chevron">+</span>
          </button>
          <div class="pa3 bg-near-white">
            <p class="ma0 lh-copy">
              Target is &lt; 10kb gzipped for all Tier 1 components.
              Each component is under 200 lines.
            </p>
          </div>
        </ytz-disclosure>
      </div>
    </section>

    <!-- Nested Content -->
    <section class="demo-section pv4">
      <h2 class="f4 fw6 mb3">Rich Content</h2>
      <p class="lh-copy mb3">
        Disclosures can contain any HTML content including forms, images, and other components.
      </p>

      <ytz-disclosure class="db mb3">
        <button class="ph3 pv2 br2 bg-dark-gray white bn pointer">
          Show Contact Form
        </button>
        <div class="pa3 bg-near-white mt2 br2">
          <form class="measure">
            <div class="mb3">
              <label class="db fw5 mb1" for="name">Name</label>
              <input id="name" type="text" class="input-reset pa2 ba b--light-gray br2 w-100">
            </div>
            <div class="mb3">
              <label class="db fw5 mb1" for="email">Email</label>
              <input id="email" type="email" class="input-reset pa2 ba b--light-gray br2 w-100">
            </div>
            <div class="mb3">
              <label class="db fw5 mb1" for="message">Message</label>
              <textarea id="message" class="input-reset pa2 ba b--light-gray br2 w-100" rows="3"></textarea>
            </div>
            <button type="submit" class="ph3 pv2 br2 bg-blue white bn pointer">
              Send Message
            </button>
          </form>
        </div>
      </ytz-disclosure>
    </section>

    <!-- Keyboard Navigation -->
    <section class="demo-section pv4">
      <h2 class="f4 fw6 mb3">Keyboard Support</h2>
      <p class="lh-copy mb3">
        The disclosure trigger responds to keyboard input:
      </p>
      <ul class="lh-copy pl3 mb3">
        <li><kbd class="ph1 pv1 bg-light-gray br1 f6">Enter</kbd> - Toggle disclosure</li>
        <li><kbd class="ph1 pv1 bg-light-gray br1 f6">Space</kbd> - Toggle disclosure</li>
      </ul>
      <p class="lh-copy">
        Focus the button below and press Enter or Space to toggle.
      </p>

      <ytz-disclosure class="db mt3">
        <button class="ph3 pv2 br2 ba b--dark-gray bg-transparent pointer">
          Keyboard-Accessible Toggle
        </button>
        <div class="pa3 bg-light-gray mt2 br2">
          <p class="ma0 lh-copy">
            This disclosure was opened via keyboard!
          </p>
        </div>
      </ytz-disclosure>
    </section>

    <!-- API Reference -->
    <section class="demo-section pv4">
      <h2 class="f4 fw6 mb3">API Reference</h2>

      <h3 class="f5 fw6 mb2">Attributes</h3>
      <table class="collapse ba b--light-gray w-100 mb4">
        <thead>
          <tr class="bg-light-gray">
            <th class="pa2 tl">Attribute</th>
            <th class="pa2 tl">Type</th>
            <th class="pa2 tl">Description</th>
          </tr>
        </thead>
        <tbody>
          <tr class="bb b--light-gray">
            <td class="pa2"><code>open</code></td>
            <td class="pa2">Boolean</td>
            <td class="pa2">When present, content is visible</td>
          </tr>
        </tbody>
      </table>

      <h3 class="f5 fw6 mb2">Events</h3>
      <table class="collapse ba b--light-gray w-100 mb4">
        <thead>
          <tr class="bg-light-gray">
            <th class="pa2 tl">Event</th>
            <th class="pa2 tl">Detail</th>
            <th class="pa2 tl">Description</th>
          </tr>
        </thead>
        <tbody>
          <tr class="bb b--light-gray">
            <td class="pa2"><code>toggle</code></td>
            <td class="pa2"><code>{ open: boolean }</code></td>
            <td class="pa2">Fired when open state changes</td>
          </tr>
        </tbody>
      </table>

      <h3 class="f5 fw6 mb2">JavaScript API</h3>
      <pre class="f6 bg-near-white pa3 br2 overflow-auto"><code>const disclosure = document.querySelector('ytz-disclosure')

// Read state
console.log(disclosure.open) // false

// Set state
disclosure.open = true

// Toggle
disclosure.toggle()

// Listen for changes
disclosure.addEventListener('toggle', (e) => {
  console.log('Now open:', e.detail.open)
})</code></pre>
    </section>

    <!-- React Usage -->
    <section class="demo-section pv4">
      <h2 class="f4 fw6 mb3">React Usage</h2>

      <pre class="f6 bg-near-white pa3 br2 overflow-auto"><code>import { Disclosure } from '@grimoire/yetzirah-react'

function App() {
  const [open, setOpen] = useState(false)

  return (
    &lt;Disclosure open={open} onToggle={setOpen}&gt;
      &lt;button className="ph3 pv2 br2 bg-blue white bn pointer"&gt;
        {open ? 'Hide' : 'Show'} Details
      &lt;/button&gt;
      &lt;div className="pa3 bg-light-gray mt2 br2"&gt;
        Content here...
      &lt;/div&gt;
    &lt;/Disclosure&gt;
  )
}</code></pre>
    </section>

    <!-- MUI Migration -->
    <section class="demo-section pv4">
      <h2 class="f4 fw6 mb3">Migrating from MUI Collapse</h2>

      <div class="flex flex-wrap nl2 nr2">
        <div class="w-50-ns w-100 ph2 mb3">
          <h4 class="f6 fw6 mb2 gray ttu">MUI</h4>
          <pre class="f6 bg-near-white pa3 br2 overflow-auto"><code>&lt;Button onClick={() => setOpen(!open)}&gt;
  Toggle
&lt;/Button&gt;
&lt;Collapse in={open}&gt;
  &lt;div&gt;Content&lt;/div&gt;
&lt;/Collapse&gt;</code></pre>
        </div>
        <div class="w-50-ns w-100 ph2 mb3">
          <h4 class="f6 fw6 mb2 gray ttu">Yetzirah</h4>
          <pre class="f6 bg-near-white pa3 br2 overflow-auto"><code>&lt;Disclosure open={open} onToggle={setOpen}&gt;
  &lt;button&gt;Toggle&lt;/button&gt;
  &lt;div&gt;Content&lt;/div&gt;
&lt;/Disclosure&gt;</code></pre>
        </div>
      </div>
    </section>
  </main>

  <footer class="mt5 pt4 bt b--light-gray">
    <p class="f6 gray">
      Yetzirah - The world of formation.
      <a href="https://github.com/grimoire-intelligence/yetzirah" class="link blue">GitHub</a>
    </p>
  </footer>

  <!-- Load the component -->
  <script type="module">
    import '@grimoire/yetzirah-core'
  </script>
</body>
</html>
```

### File: `demos/index.html` (modify)

Update the disclosure link to be active:

```html
<li class="pv2">
  <a href="disclosure.html" class="link blue">Disclosure</a>
  <span class="f6 gray ml2">- Expandable content with aria-expanded</span>
</li>
```

### JSDoc Verification

Ensure the following JSDoc is complete in the core and react packages:
- Module description
- Class/function description
- All parameters documented
- Return types specified
- Usage examples included

## Acceptance Criteria Checklist
- [ ] Demo shows basic disclosure, nested content, animation examples
- [ ] Works when opened directly in browser (no build)
- [ ] JSDoc complete with examples in both core and react packages
- [ ] demos/index.html updated with link to disclosure demo
- [ ] All examples are copy-pasteable and functional

## Dependencies
- PR-006: Disclosure React Wrapper (for React usage examples)

## Downstream Dependents
- PR-038: MUI Rosetta Stone Documentation (references disclosure examples)
