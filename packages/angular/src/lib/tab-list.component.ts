import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectionStrategy,
  HostBinding
} from '@angular/core';

/**
 * Semantic wrapper for grouping Tab components.
 * This is a simple container component for better semantic structure.
 *
 * @example
 * <ytz-tabs [(ngModel)]="selectedTab">
 *   <ytz-tab-list>
 *     <ytz-tab panel="tab1">Tab 1</ytz-tab>
 *     <ytz-tab panel="tab2">Tab 2</ytz-tab>
 *   </ytz-tab-list>
 *   <ytz-tabpanel id="tab1">Content 1</ytz-tabpanel>
 *   <ytz-tabpanel id="tab2">Content 2</ytz-tabpanel>
 * </ytz-tabs>
 */
@Component({
  selector: 'ytz-tab-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <ng-content></ng-content>
  `,
  styles: [`
    :host {
      display: flex;
      gap: 0.5rem;
    }
  `]
})
export class TabListComponent {
}
