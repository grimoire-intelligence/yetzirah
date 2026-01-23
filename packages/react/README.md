# @grimoire-intel/yetzirah-react

React 18+ wrappers for Yetzirah Web Components.

## Installation

```bash
npm install @grimoire-intel/yetzirah-react
```

## Usage

```jsx
import { Dialog, Button, Toggle, Slider } from '@grimoire-intel/yetzirah-react'
import { useState } from 'react'

function App() {
  const [open, setOpen] = useState(false)
  const [enabled, setEnabled] = useState(false)
  const [volume, setVolume] = useState(50)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Dialog</Button>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <div className="pa4 bg-white br3">
          <h2>Settings</h2>

          <label className="flex items-center mb3">
            <Toggle checked={enabled} onChange={setEnabled} />
            <span className="ml2">Enable notifications</span>
          </label>

          <label className="db mb3">
            <span className="db mb2">Volume: {volume}%</span>
            <Slider value={volume} onChange={setVolume} min={0} max={100} />
          </label>

          <Button onClick={() => setOpen(false)}>Close</Button>
        </div>
      </Dialog>
    </>
  )
}
```

## Available Components

All 21 Yetzirah components with React-idiomatic APIs:

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

```jsx
import { Dialog, Button } from '@grimoire-intel/yetzirah-react'
import { useState } from 'react'

function MyComponent() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open</Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <h2>Dialog Title</h2>
        <Button onClick={() => setOpen(false)}>Close</Button>
      </Dialog>
    </>
  )
}
```

### Select

```jsx
import { Select, SelectOption } from '@grimoire-intel/yetzirah-react'
import { useState } from 'react'

function MyComponent() {
  const [value, setValue] = useState('')

  return (
    <Select value={value} onChange={setValue} placeholder="Choose...">
      <SelectOption value="1">Option 1</SelectOption>
      <SelectOption value="2">Option 2</SelectOption>
    </Select>
  )
}
```

### Tabs

```jsx
import { Tabs, TabList, Tab, TabPanel } from '@grimoire-intel/yetzirah-react'

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

```jsx
import { Toggle, Slider } from '@grimoire-intel/yetzirah-react'
import { useState } from 'react'

function MyComponent() {
  const [enabled, setEnabled] = useState(false)
  const [volume, setVolume] = useState(50)

  return (
    <>
      <Toggle checked={enabled} onChange={setEnabled} />
      <Slider value={volume} onChange={setVolume} min={0} max={100} />
    </>
  )
}
```

### DataGrid

```jsx
import { DataGrid, DataGridColumn } from '@grimoire-intel/yetzirah-react'

const data = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' }
]

function MyComponent() {
  return (
    <DataGrid data={data} onSort={console.log} onRowSelect={console.log}>
      <DataGridColumn field="id" header="ID" width={80} />
      <DataGridColumn field="name" header="Name" sortable />
      <DataGridColumn field="email" header="Email" />
    </DataGrid>
  )
}
```

## How It Works

These wrappers are thin adapters around Yetzirah's Web Components:

- **Event bridging**: `onClose` prop → `close` event listener
- **Boolean attributes**: `open={true}` → `setAttribute('open', '')`
- **Ref forwarding**: Access the underlying web component via `ref`

See [@grimoire-intel/yetzirah](https://www.npmjs.com/package/@grimoire-intel/yetzirah) for full component documentation.

## TypeScript

Full type definitions included:

```tsx
import type { DialogProps, SelectProps, SliderProps } from '@grimoire-intel/yetzirah-react'
```

## Requirements

- React 18.0 or higher

## License

MIT
