import {
  Component,
  Input,
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectionStrategy
} from '@angular/core';
import '@grimoire/yetzirah-core';

/**
 * Angular wrapper for ytz-tab Web Component.
 * Represents an individual tab within a ytz-tabs component.
 *
 * @example
 * <ytz-tabs>
 *   <ytz-tab panel="tab1">Account</ytz-tab>
 *   <ytz-tab panel="tab2">Settings</ytz-tab>
 *   <ytz-tabpanel id="tab1">Account content</ytz-tabpanel>
 *   <ytz-tabpanel id="tab2">Settings content</ytz-tabpanel>
 * </ytz-tabs>
 */
@Component({
  selector: 'ytz-tab',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <ng-content></ng-content>
  `,
  styles: []
})
export class TabComponent {
  /**
   * The ID of the associated tab panel
   */
  @Input() panel: string = '';
}
