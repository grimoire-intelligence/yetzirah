import {
  Component,
  Input,
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectionStrategy
} from '@angular/core';
import '@grimoire/yetzirah-core';

/**
 * Angular wrapper for ytz-option Web Component (used within ytz-autocomplete).
 * Represents an individual option in the autocomplete dropdown.
 *
 * @example
 * <ytz-autocomplete>
 *   <input slot="input" placeholder="Search...">
 *   <ytz-option value="apple">Apple</ytz-option>
 *   <ytz-option value="banana" [disabled]="true">Banana (Out of stock)</ytz-option>
 * </ytz-autocomplete>
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
export class AutocompleteOptionComponent {
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
