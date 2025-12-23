import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectionStrategy
} from '@angular/core';

/**
 * Angular helper component for menu trigger slot.
 * Wraps content that should trigger the menu.
 *
 * @example
 * <ytz-menu>
 *   <ytz-menu-trigger>
 *     <button>Open Menu</button>
 *   </ytz-menu-trigger>
 *   <ytz-menuitem>Edit</ytz-menuitem>
 * </ytz-menu>
 */
@Component({
  selector: 'ytz-menu-trigger',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div slot="trigger">
      <ng-content></ng-content>
    </div>
  `,
  styles: []
})
export class MenuTriggerComponent {}
