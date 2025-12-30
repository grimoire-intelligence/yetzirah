# Using Yetzirah with Solid.js

This guide covers using Yetzirah web components with Solid.js for a reactive, performant UI experience.

## Overview

**Solid.js** is a declarative JavaScript library for building user interfaces with fine-grained reactivity. Combined with Yetzirah's headless web components, you get:

- Fine-grained reactivity without virtual DOM diffing
- Predictable, synchronous updates
- Accessible, production-ready UI components
- Full TypeScript support

## Installation

```bash
npm install @grimoire/yetzirah-solid solid-js
# or
pnpm add @grimoire/yetzirah-solid solid-js
```

## Quick Start

```tsx
import { createSignal } from 'solid-js'
import { Button, Dialog } from '@grimoire/yetzirah-solid'

function App() {
  const [open, setOpen] = createSignal(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Dialog</Button>
      <Dialog open={open()} onClose={() => setOpen(false)}>
        <h2>Hello from Solid!</h2>
        <p>This dialog syncs with Solid's reactive state.</p>
        <Button onClick={() => setOpen(false)}>Close</Button>
      </Dialog>
    </>
  )
}
```

## Component Examples

### Button

```tsx
import { Button } from '@grimoire/yetzirah-solid'

function Counter() {
  const [count, setCount] = createSignal(0)

  return (
    <div>
      <p>Count: {count()}</p>
      <Button onClick={() => setCount(c => c + 1)}>Increment</Button>
      <Button variant="outline" onClick={() => setCount(0)}>Reset</Button>
    </div>
  )
}
```

### Dialog with Open State

```tsx
import { createSignal } from 'solid-js'
import { Button, Dialog } from '@grimoire/yetzirah-solid'

function DialogExample() {
  const [open, setOpen] = createSignal(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Dialog</Button>

      <Dialog
        open={open()}
        modal
        closeOnOverlay
        onClose={() => setOpen(false)}
      >
        <div class="dialog-content">
          <h2>Confirm Action</h2>
          <p>Are you sure you want to proceed?</p>
          <div class="dialog-actions">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>
              Confirm
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  )
}
```

### Tabs with Controlled Value

```tsx
import { createSignal } from 'solid-js'
import { Tabs, TabList, Tab, TabPanel } from '@grimoire/yetzirah-solid'

function TabsExample() {
  const [activeTab, setActiveTab] = createSignal('overview')

  return (
    <Tabs defaultTab={activeTab()} onChange={setActiveTab}>
      <TabList aria-label="Feature tabs">
        <Tab value="overview">Overview</Tab>
        <Tab value="features">Features</Tab>
        <Tab value="pricing">Pricing</Tab>
      </TabList>

      <TabPanel value="overview">
        <h3>Overview</h3>
        <p>Welcome to our product overview.</p>
      </TabPanel>

      <TabPanel value="features">
        <h3>Features</h3>
        <ul>
          <li>Feature 1</li>
          <li>Feature 2</li>
        </ul>
      </TabPanel>

      <TabPanel value="pricing">
        <h3>Pricing</h3>
        <p>Check out our pricing plans.</p>
      </TabPanel>
    </Tabs>
  )
}
```

### Form Components

#### Select

```tsx
import { createSignal } from 'solid-js'
import { Select, SelectOption } from '@grimoire/yetzirah-solid'

function SelectExample() {
  const [size, setSize] = createSignal('medium')

  return (
    <div>
      <label>Choose a size:</label>
      <Select value={size()} onChange={setSize} placeholder="Select size">
        <SelectOption value="small">Small</SelectOption>
        <SelectOption value="medium">Medium</SelectOption>
        <SelectOption value="large">Large</SelectOption>
      </Select>
      <p>Selected: {size()}</p>
    </div>
  )
}
```

#### Toggle

```tsx
import { createSignal } from 'solid-js'
import { Toggle } from '@grimoire/yetzirah-solid'

function ToggleExample() {
  const [enabled, setEnabled] = createSignal(false)

  return (
    <div>
      <Toggle checked={enabled()} onChange={setEnabled}>
        Enable notifications
      </Toggle>
      <p>Notifications: {enabled() ? 'On' : 'Off'}</p>
    </div>
  )
}
```

#### Slider

```tsx
import { createSignal } from 'solid-js'
import { Slider } from '@grimoire/yetzirah-solid'

function SliderExample() {
  const [volume, setVolume] = createSignal(50)

  return (
    <div>
      <label>Volume: {volume()}%</label>
      <Slider
        value={volume()}
        min={0}
        max={100}
        step={5}
        onChange={setVolume}
      />
    </div>
  )
}
```

### Disclosure

```tsx
import { createSignal } from 'solid-js'
import { Disclosure, DisclosureTrigger, DisclosureContent } from '@grimoire/yetzirah-solid'

function DisclosureExample() {
  const [open, setOpen] = createSignal(false)

  return (
    <Disclosure open={open()} onToggle={setOpen}>
      <DisclosureTrigger>
        {open() ? '▼' : '▶'} More Information
      </DisclosureTrigger>
      <DisclosureContent>
        <p>Here is some additional information that was hidden.</p>
      </DisclosureContent>
    </Disclosure>
  )
}
```

## Reactivity Patterns

### Using createSignal with Props

Solid's signals integrate seamlessly with Yetzirah components:

```tsx
import { createSignal, createEffect } from 'solid-js'
import { Slider } from '@grimoire/yetzirah-solid'

function ReactiveSlider() {
  const [value, setValue] = createSignal(50)

  // React to value changes
  createEffect(() => {
    console.log('Slider value changed:', value())
  })

  return (
    <Slider value={value()} onChange={setValue} />
  )
}
```

### Event Callbacks

All components accept callback props for their respective events:

```tsx
import { Dialog, Select, Toggle, Slider, Tabs } from '@grimoire/yetzirah-solid'

// Dialog - onClose
<Dialog open={open()} onClose={() => setOpen(false)}>

// Select - onChange(value: string)
<Select value={val()} onChange={(v) => setVal(v)}>

// Toggle - onChange(checked: boolean)
<Toggle checked={on()} onChange={(c) => setOn(c)}>

// Slider - onChange(value: number)
<Slider value={num()} onChange={(n) => setNum(n)}>

// Tabs - onChange(value: string)
<Tabs defaultTab={tab()} onChange={(t) => setTab(t)}>

// Disclosure - onToggle(open: boolean)
<Disclosure open={open()} onToggle={(o) => setOpen(o)}>
```

### Derived State

Use Solid's derived signals for computed values:

```tsx
import { createSignal, createMemo } from 'solid-js'
import { Slider, Progress } from '@grimoire/yetzirah-solid'

function DerivedExample() {
  const [value, setValue] = createSignal(0)

  // Derived signal
  const percentage = createMemo(() => Math.round((value() / 100) * 100))
  const isComplete = createMemo(() => value() >= 100)

  return (
    <div>
      <Slider value={value()} max={100} onChange={setValue} />
      <Progress value={percentage()} />
      <p>{isComplete() ? 'Complete!' : `${percentage()}% done`}</p>
    </div>
  )
}
```

## TypeScript Support

All components are fully typed. Props interfaces are exported:

```tsx
import type {
  DialogProps,
  SelectProps,
  ToggleProps,
  SliderProps,
  TabsProps,
  DisclosureProps
} from '@grimoire/yetzirah-solid'

// Custom wrapper with extended props
interface MyDialogProps extends DialogProps {
  title: string
}

function MyDialog(props: MyDialogProps) {
  return (
    <Dialog {...props}>
      <h2>{props.title}</h2>
      {props.children}
    </Dialog>
  )
}
```

## SSR Considerations

Yetzirah components use the Custom Elements API, which requires a DOM environment. For SSR with Solid Start or similar frameworks:

### Client-Only Rendering

Use `clientOnly` for components that require the DOM:

```tsx
import { clientOnly } from '@solidjs/start'

const Dialog = clientOnly(() =>
  import('@grimoire/yetzirah-solid').then(m => ({ default: m.Dialog }))
)

function App() {
  return (
    <Dialog open={open()} onClose={() => setOpen(false)}>
      Content
    </Dialog>
  )
}
```

### Hydration

Components hydrate correctly when the custom elements are registered before hydration:

```tsx
// entry-client.tsx
import '@grimoire/yetzirah-core' // Register custom elements
import { hydrate } from 'solid-js/web'
import App from './App'

hydrate(() => <App />, document.getElementById('root')!)
```

## Available Components

| Component | Props | Events |
|-----------|-------|--------|
| `Button` | `variant`, `size`, `disabled` | `onClick` |
| `Dialog` | `open`, `modal`, `closeOnOverlay` | `onClose` |
| `Tabs` | `defaultTab` | `onChange` |
| `TabList` | `aria-label` | - |
| `Tab` | `value`, `disabled` | - |
| `TabPanel` | `value` | - |
| `Select` | `value`, `placeholder`, `disabled` | `onChange` |
| `SelectOption` | `value`, `disabled` | - |
| `Toggle` | `checked`, `disabled` | `onChange` |
| `Slider` | `value`, `min`, `max`, `step`, `disabled` | `onChange` |
| `Disclosure` | `open` | `onToggle` |
| `DisclosureTrigger` | - | - |
| `DisclosureContent` | - | - |
| `Drawer` | `open`, `anchor` | `onClose` |
| `Accordion` | - | - |
| `AccordionItem` | `open` | `onToggle` |
| `Menu` | `open` | `onClose` |
| `Popover` | `open` | `onToggle` |
| `Progress` | `value`, `max` | - |
| `Badge` | `count` | - |
| `Snackbar` | `open`, `duration`, `position` | `onClose` |
| `Autocomplete` | `value` | `onInput`, `onSelect` |

## Resources

- [Solid.js Documentation](https://docs.solidjs.com/)
- [Yetzirah Core Components](./components.md)
- [API Reference](./api-reference.md)
