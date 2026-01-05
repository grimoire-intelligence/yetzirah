/**
 * @grimoire/yetzirah-solid
 *
 * Solid.js wrappers for Yetzirah Web Components.
 * Provides reactive component wrappers using Solid's primitives.
 *
 * @packageDocumentation
 */

// Import and register core web components
import '@grimoire/yetzirah-core'

/**
 * Re-export VERSION from core
 */
export const VERSION = '0.1.0'

// Component exports
export { Button } from './Button'
export type { ButtonProps } from './Button'

export { Dialog } from './Dialog'
export type { DialogProps } from './Dialog'

export { Drawer } from './Drawer'
export type { DrawerProps } from './Drawer'

export { Disclosure } from './Disclosure'
export type { DisclosureProps } from './Disclosure'

export { Tabs, TabList } from './Tabs'
export type { TabsProps, TabListProps } from './Tabs'

export { Tab } from './Tab'
export type { TabProps } from './Tab'

export { TabPanel } from './TabPanel'
export type { TabPanelProps } from './TabPanel'

export { Tooltip } from './Tooltip'
export type { TooltipProps } from './Tooltip'

export { Menu } from './Menu'
export type { MenuProps } from './Menu'

export { MenuItem } from './MenuItem'
export type { MenuItemProps } from './MenuItem'

export { MenuTrigger } from './MenuTrigger'
export type { MenuTriggerProps } from './MenuTrigger'

export { Autocomplete } from './Autocomplete'
export type { AutocompleteProps } from './Autocomplete'

export { AutocompleteOption } from './AutocompleteOption'
export type { AutocompleteOptionProps } from './AutocompleteOption'

export { Listbox } from './Listbox'
export type { ListboxProps } from './Listbox'

export { ListboxOption } from './ListboxOption'
export type { ListboxOptionProps } from './ListboxOption'

export { Select } from './Select'
export type { SelectProps } from './Select'

export { SelectOption } from './SelectOption'
export type { SelectOptionProps } from './SelectOption'

export { Accordion } from './Accordion'
export type { AccordionProps } from './Accordion'

export { AccordionItem } from './AccordionItem'
export type { AccordionItemProps } from './AccordionItem'

export { Popover } from './Popover'
export type { PopoverProps } from './Popover'

export { Toggle } from './Toggle'
export type { ToggleProps } from './Toggle'

export { Chip } from './Chip'
export type { ChipProps } from './Chip'

export { IconButton } from './IconButton'
export type { IconButtonProps } from './IconButton'

export { Slider } from './Slider'
export type { SliderProps } from './Slider'

export { ThemeToggle } from './ThemeToggle'
export type { ThemeToggleProps } from './ThemeToggle'

export { DataGrid } from './DataGrid'
export type { DataGridProps } from './DataGrid'

export { Snackbar } from './Snackbar'
export type { SnackbarProps } from './Snackbar'

export { Progress } from './Progress'
export type { ProgressProps } from './Progress'

export { Badge } from './Badge'
export type { BadgeProps } from './Badge'
