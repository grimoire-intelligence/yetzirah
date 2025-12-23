import {
  Component,
  Input,
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectionStrategy
} from '@angular/core';
import '@grimoire/yetzirah-core';

/**
 * Angular wrapper for ytz-option Web Component (used within ytz-listbox).
 * Represents an individual option in the listbox.
 *
 * @example
 * <ytz-listbox>
 *   <ytz-option value="opt1">Option 1</ytz-option>
 *   <ytz-option value="opt2" [disabled]="true">Option 2 (disabled)</ytz-option>
 *   <ytz-option value="opt3" [selected]="true">Option 3 (selected)</ytz-option>
 * </ytz-listbox>
 */
@Component({
  selector: 'ytz-option',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <ng-content></ng-content>
  `,
  styles: []
})
export class ListboxOptionComponent {
  /**
   * The value of this option
   */
  @Input() value: string = '';

  /**
   * Whether this option is disabled
   */
  @Input() disabled: boolean = false;

  /**
   * Whether this option is selected
   */
  @Input() selected: boolean = false;
}
