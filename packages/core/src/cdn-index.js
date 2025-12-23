/**
 * CDN index - Re-exports all components for tree-shaking.
 * Import individual components for minimal bundle size:
 *   import '@grimoire/yetzirah-core/cdn/button.js'
 *
 * Or import all via this index:
 *   import '@grimoire/yetzirah-core/cdn'
 *
 * @module @grimoire/yetzirah-core/cdn
 */

// Tier 1 Components
export { YtzButton } from './button.js'
export { YtzDisclosure } from './disclosure.js'
export { YtzDialog } from './dialog.js'
export { YtzTabs, YtzTab, YtzTabPanel } from './tabs.js'
export { YtzTooltip } from './tooltip.js'
export { YtzMenu, YtzMenuItem } from './menu.js'
export { YtzAutocomplete, YtzOption } from './autocomplete.js'
export { YtzListbox } from './listbox.js'
export { YtzSelect } from './select.js'
export { YtzAccordion, YtzAccordionItem } from './accordion.js'
export { YtzDrawer } from './drawer.js'
export { YtzPopover } from './popover.js'

// Tier 2 Components
export { YtzToggle } from './toggle.js'
export { YtzChip } from './chip.js'
export { YtzIconButton } from './icon-button.js'
export { YtzSlider } from './slider.js'
export { YtzDatagrid, YtzDatagridColumn } from './datagrid.js'
export { YtzThemeToggle } from './theme-toggle.js'

// Version
export { VERSION } from './index.js'
