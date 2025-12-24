/**
 * Tier 1 Components Only Bundle
 * Optimized bundle containing only Tier 1 components for minimal payload.
 *
 * Target: < 10KB gzipped
 *
 * @module @grimoire/yetzirah-core/cdn/tier1
 */

// Tier 1 Components (12 components)
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

/** Yetzirah version */
export const VERSION = '0.1.0'
