/**
 * @grimoire/yetzirah-alpine
 *
 * Alpine.js plugin for Yetzirah Web Components.
 * Provides directives and magics for Alpine.js integration.
 */

export declare const VERSION: string;

export interface YetzirahAlpineOptions {
  /** Prefix for component directives (default: 'ytz') */
  prefix?: string;
}

export interface SnackbarOptions {
  /** Duration in milliseconds before auto-dismiss */
  duration?: number;
  /** Position on screen */
  position?: 'top' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export interface YtzMagic {
  // Generic methods (PR-154)
  open(target: string | HTMLElement): void;
  close(target: string | HTMLElement): void;
  toggle(target: string | HTMLElement): void;
  show(target: string | HTMLElement, message?: string): void;

  // Existing methods (backwards compatibility)
  snackbar(message: string, options?: SnackbarOptions): HTMLElement;
  openDialog(target: string | HTMLElement): void;
  closeDialog(target: string | HTMLElement): void;
  openDrawer(target: string | HTMLElement): void;
  closeDrawer(target: string | HTMLElement): void;
  toggleTheme(): 'light' | 'dark';
  getTheme(): string;
  setTheme(theme: 'light' | 'dark'): void;
}

interface AlpineInstance {
  magic(name: string, callback: () => unknown): void;
  directive(name: string, callback: DirectiveCallback): void;
  evaluate(el: Element, expression: string): unknown;
}

type DirectiveCallback = (
  el: Element,
  directive: { expression: string },
  utilities: { evaluate: (expr: string) => unknown; effect: (fn: () => void) => void }
) => void;

/**
 * Alpine.js plugin that integrates Yetzirah Web Components.
 *
 * @example
 * ```js
 * import Alpine from 'alpinejs'
 * import { yetzirahPlugin } from '@grimoire/yetzirah-alpine'
 *
 * Alpine.plugin(yetzirahPlugin)
 * Alpine.start()
 * ```
 */
export declare function yetzirahPlugin(Alpine: AlpineInstance, options?: YetzirahAlpineOptions): void;

export default yetzirahPlugin;

export declare function createYtzMagic(): YtzMagic;
