/**
 * @grimoire/yetzirah-solid
 *
 * Solid.js wrappers for Yetzirah Web Components.
 * Provides type declarations for using Yetzirah components with Solid's JSX.
 */

export declare const VERSION: string;

export interface BaseProps {
  ref?: HTMLElement | ((el: HTMLElement) => void);
  class?: string;
  id?: string;
  style?: string | Record<string, string>;
  children?: unknown;
}

export interface YtzButtonProps extends BaseProps {
  href?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (e: MouseEvent) => void;
}

export interface YtzDisclosureProps extends BaseProps {
  open?: boolean;
  onToggle?: (e: CustomEvent) => void;
}

export interface YtzDialogProps extends BaseProps {
  open?: boolean;
  modal?: boolean;
  'close-on-overlay'?: boolean;
  onClose?: (e: CustomEvent) => void;
}

export interface YtzTabsProps extends BaseProps {
  'default-tab'?: string;
  onChange?: (e: CustomEvent) => void;
}

export interface YtzTabProps extends BaseProps {
  value?: string;
  disabled?: boolean;
}

export interface YtzTabListProps extends BaseProps {
  'aria-label'?: string;
}

export interface YtzTabPanelProps extends BaseProps {
  value?: string;
}

export interface YtzTooltipProps extends BaseProps {
  content?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

export interface YtzMenuProps extends BaseProps {
  onSelect?: (e: CustomEvent) => void;
}

export interface YtzMenuItemProps extends BaseProps {
  value?: string;
  disabled?: boolean;
}

export interface YtzMenuTriggerProps extends BaseProps {}

export interface YtzAutocompleteProps extends BaseProps {
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  onInput?: (e: CustomEvent) => void;
  onSelect?: (e: CustomEvent) => void;
}

export interface YtzAutocompleteOptionProps extends BaseProps {
  value?: string;
  disabled?: boolean;
}

export interface YtzListboxProps extends BaseProps {
  value?: string;
  multiple?: boolean;
  onChange?: (e: CustomEvent) => void;
}

export interface YtzListboxOptionProps extends BaseProps {
  value?: string;
  disabled?: boolean;
}

export interface YtzSelectProps extends BaseProps {
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  onChange?: (e: CustomEvent) => void;
}

export interface YtzSelectOptionProps extends BaseProps {
  value?: string;
  disabled?: boolean;
}

export interface YtzAccordionProps extends BaseProps {
  multiple?: boolean;
}

export interface YtzAccordionItemProps extends BaseProps {
  open?: boolean;
  disabled?: boolean;
  onToggle?: (e: CustomEvent) => void;
}

export interface YtzDrawerProps extends BaseProps {
  open?: boolean;
  position?: 'left' | 'right' | 'top' | 'bottom';
  onClose?: (e: CustomEvent) => void;
}

export interface YtzPopoverProps extends BaseProps {
  open?: boolean;
  position?: 'top' | 'bottom' | 'left' | 'right';
  trigger?: 'click' | 'hover';
  onToggle?: (e: CustomEvent) => void;
}

export interface YtzToggleProps extends BaseProps {
  checked?: boolean;
  disabled?: boolean;
  onChange?: (e: CustomEvent) => void;
}

export interface YtzChipProps extends BaseProps {
  removable?: boolean;
  disabled?: boolean;
  onRemove?: (e: CustomEvent) => void;
}

export interface YtzIconButtonProps extends BaseProps {
  'aria-label': string;
  disabled?: boolean;
  onClick?: (e: MouseEvent) => void;
}

export interface YtzSliderProps extends BaseProps {
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  onChange?: (e: CustomEvent) => void;
}

export interface YtzThemeToggleProps extends BaseProps {
  theme?: 'light' | 'dark' | 'system';
  onChange?: (e: CustomEvent) => void;
}

export interface YtzDataGridProps extends BaseProps {
  columns?: string;
  rows?: string;
  sortable?: boolean;
  selectable?: boolean;
  onSort?: (e: CustomEvent) => void;
  onSelect?: (e: CustomEvent) => void;
}

export interface YtzSnackbarProps extends BaseProps {
  open?: boolean;
  duration?: number;
  position?: 'top' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  onClose?: (e: CustomEvent) => void;
}

export interface YtzProgressProps extends BaseProps {
  value?: number;
  max?: number;
  indeterminate?: boolean;
  variant?: 'linear' | 'circular';
}

export interface YtzBadgeProps extends BaseProps {
  count?: number;
  max?: number;
  dot?: boolean;
}
