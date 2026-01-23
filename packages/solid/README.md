# @grimoire-intel/yetzirah-solid

Solid.js wrappers for Yetzirah Web Components with native signal integration.

## Installation

```bash
npm install @grimoire-intel/yetzirah-solid
```

## Usage

```tsx
import { Dialog, Button, Toggle, Slider } from '@grimoire-intel/yetzirah-solid'
import { createSignal } from 'solid-js'

function App() {
  const [open, setOpen] = createSignal(false)
  const [enabled, setEnabled] = createSignal(false)
  const [volume, setVolume] = createSignal(50)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Dialog</Button>

      <Dialog open={open()} onClose={() => setOpen(false)}>
        <div class="pa4 bg-white br3">
          <h2>Settings</h2>

          <label class="flex items-center mb3">
            <Toggle checked={enabled()} onChange={setEnabled} />
            <span class="ml2">Enable notifications</span>
          </label>

          <label class="db mb3">
            <span class="db mb2">Volume: {volume()}%</span>
            <Slider value={volume()} onChange={setVolume} min={0} max={100} />
          </label>

          <Button onClick={() => setOpen(false)}>Close</Button>
        </div>
      </Dialog>
    </>
  )
}
```

## Available Components

All 21 Yetzirah components with Solid-idiomatic APIs:

| Component | Props | Callback |
|-----------|-------|----------|
| `Dialog` | `open` | `onClose` |
| `Drawer` | `open`, `position` | `onClose` |
| `Tabs`, `TabList`, `Tab`, `TabPanel` | - | `onChange` |
| `Menu`, `MenuItem`, `MenuTrigger` | - | `onClick` |
| `Accordion`, `AccordionItem` | `multiple` | - |
| `Disclosure` | `open` | `onToggle` |
| `Select`, `SelectOption` | `value`, `multiple` | `onChange` |
| `Autocomplete`, `AutocompleteOption` | `value` | `onInput`, `onSelect` |
| `Listbox`, `ListboxOption` | `value` | `onChange` |
| `Popover` | `open`, `position` | `onToggle` |
| `Tooltip` | `content`, `position` | - |
| `Toggle` | `checked`, `disabled` | `onChange` |
| `Slider` | `value`, `min`, `max`, `step` | `onChange`, `onInput` |
| `Button` | `disabled` | `onClick` |
| `Chip` | `deletable`, `disabled` | `onDelete` |
| `IconButton` | `ariaLabel`, `tooltip` | `onClick` |
| `DataGrid`, `DataGridColumn` | `data`, `columns` | `onSort`, `onRowSelect` |
| `ThemeToggle` | `storageKey` | `onThemeChange` |
| `Snackbar` | `open`, `duration`, `position` | `onClose` |
| `Progress` | `value`, `variant` | - |
| `Badge` | `value`, `max` | - |

## Examples

### Dialog

```tsx
import { Dialog, Button } from '@grimoire-intel/yetzirah-solid'
import { createSignal } from 'solid-js'

function MyComponent() {
  const [open, setOpen] = createSignal(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open</Button>
      <Dialog open={open()} onClose={() => setOpen(false)}>
        <h2>Dialog Title</h2>
        <Button onClick={() => setOpen(false)}>Close</Button>
      </Dialog>
    </>
  )
}
```

### Select

```tsx
import { Select, SelectOption } from '@grimoire-intel/yetzirah-solid'
import { createSignal } from 'solid-js'

function MyComponent() {
  const [value, setValue] = createSignal('')

  return (
    <Select value={value()} onChange={setValue} placeholder="Choose...">
      <SelectOption value="1">Option 1</SelectOption>
      <SelectOption value="2">Option 2</SelectOption>
    </Select>
  )
}
```

### Tabs

```tsx
import { Tabs, TabList, Tab, TabPanel } from '@grimoire-intel/yetzirah-solid'

function MyComponent() {
  return (
    <Tabs>
      <TabList>
        <Tab>Tab 1</Tab>
        <Tab>Tab 2</Tab>
      </TabList>
      <TabPanel>Content 1</TabPanel>
      <TabPanel>Content 2</TabPanel>
    </Tabs>
  )
}
```

### Toggle + Slider

```tsx
import { Toggle, Slider } from '@grimoire-intel/yetzirah-solid'
import { createSignal } from 'solid-js'

function MyComponent() {
  const [enabled, setEnabled] = createSignal(false)
  const [volume, setVolume] = createSignal(50)

  return (
    <>
      <Toggle checked={enabled()} onChange={setEnabled} />
      <Slider value={volume()} onChange={setVolume} min={0} max={100} />
    </>
  )
}
```

## How It Works

These wrappers use Solid's native reactivity primitives:

- **`createEffect`**: Syncs signal values to web component attributes
- **`onCleanup`**: Removes event listeners when components unmount
- **`splitProps`**: Separates wrapper props from pass-through attributes

```tsx
// Simplified wrapper implementation
const Dialog: Component<DialogProps> = (props) => {
  let ref: HTMLElement
  const [local, others] = splitProps(props, ['open', 'onClose', 'children'])

  createEffect(() => {
    if (local.open) ref.setAttribute('open', '')
    else ref.removeAttribute('open')
  })

  createEffect(() => {
    if (!local.onClose) return
    const handler = () => local.onClose?.()
    ref.addEventListener('close', handler)
    onCleanup(() => ref.removeEventListener('close', handler))
  })

  return <ytz-dialog ref={ref} {...others}>{local.children}</ytz-dialog>
}
```

See [@grimoire-intel/yetzirah](https://www.npmjs.com/package/@grimoire-intel/yetzirah) for full component documentation.

## TypeScript

Full type definitions included:

```tsx
import type { DialogProps, SelectProps, SliderProps } from '@grimoire-intel/yetzirah-solid'
```

## Requirements

- Solid.js 1.0 or higher

## License

MIT
