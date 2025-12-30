/**
 * Solid JSX type declarations for Yetzirah Web Components.
 *
 * To use, add a triple-slash reference in your project:
 * /// <reference types="@grimoire/yetzirah-solid/jsx" />
 */

import type {
  BaseProps,
  YtzButtonProps,
  YtzDisclosureProps,
  YtzDialogProps,
  YtzTabsProps,
  YtzTabProps,
  YtzTabListProps,
  YtzTabPanelProps,
  YtzTooltipProps,
  YtzMenuProps,
  YtzMenuItemProps,
  YtzMenuTriggerProps,
  YtzAutocompleteProps,
  YtzAutocompleteOptionProps,
  YtzListboxProps,
  YtzListboxOptionProps,
  YtzSelectProps,
  YtzSelectOptionProps,
  YtzAccordionProps,
  YtzAccordionItemProps,
  YtzDrawerProps,
  YtzPopoverProps,
  YtzToggleProps,
  YtzChipProps,
  YtzIconButtonProps,
  YtzSliderProps,
  YtzThemeToggleProps,
  YtzDataGridProps,
  YtzSnackbarProps,
  YtzProgressProps,
  YtzBadgeProps,
} from './index'

declare module 'solid-js' {
  namespace JSX {
    interface IntrinsicElements {
      'ytz-button': YtzButtonProps
      'ytz-disclosure': YtzDisclosureProps
      'ytz-dialog': YtzDialogProps
      'ytz-tabs': YtzTabsProps
      'ytz-tab': YtzTabProps
      'ytz-tablist': YtzTabListProps
      'ytz-tabpanel': YtzTabPanelProps
      'ytz-tooltip': YtzTooltipProps
      'ytz-menu': YtzMenuProps
      'ytz-menuitem': YtzMenuItemProps
      'ytz-menu-trigger': YtzMenuTriggerProps
      'ytz-autocomplete': YtzAutocompleteProps
      'ytz-autocomplete-option': YtzAutocompleteOptionProps
      'ytz-listbox': YtzListboxProps
      'ytz-listbox-option': YtzListboxOptionProps
      'ytz-select': YtzSelectProps
      'ytz-select-option': YtzSelectOptionProps
      'ytz-accordion': YtzAccordionProps
      'ytz-accordion-item': YtzAccordionItemProps
      'ytz-drawer': YtzDrawerProps
      'ytz-popover': YtzPopoverProps
      'ytz-toggle': YtzToggleProps
      'ytz-chip': YtzChipProps
      'ytz-icon-button': YtzIconButtonProps
      'ytz-slider': YtzSliderProps
      'ytz-theme-toggle': YtzThemeToggleProps
      'ytz-datagrid': YtzDataGridProps
      'ytz-snackbar': YtzSnackbarProps
      'ytz-progress': YtzProgressProps
      'ytz-badge': YtzBadgeProps
    }
  }
}
