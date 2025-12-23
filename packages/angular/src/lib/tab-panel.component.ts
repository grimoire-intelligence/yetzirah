import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectionStrategy
} from '@angular/core';
import '@grimoire/yetzirah-core';

/**
 * Angular wrapper for ytz-tabpanel Web Component.
 * Represents a tab panel within a ytz-tabs component.
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
  selector: 'ytz-tabpanel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <ng-content></ng-content>
  `,
  styles: []
})
export class TabPanelComponent {
  // TabPanel doesn't have configurable inputs, just receives an id attribute
}
