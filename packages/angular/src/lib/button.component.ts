/**
 * Angular wrapper for ytz-button Web Component.
 * Polymorphic button that renders as <a> when href is provided, <button> otherwise.
 *
 * @module @grimoire/yetzirah-angular/button
 */

import '@grimoire/yetzirah-core'
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  CUSTOM_ELEMENTS_SCHEMA,
  OnInit,
  OnDestroy,
} from '@angular/core'

/**
 * Button component - polymorphic button/anchor element.
 *
 * Standalone Angular component wrapping the ytz-button Web Component.
 *
 * @example
 * // Action button
 * <ytz-button (buttonClick)="handleSubmit()">Submit</ytz-button>
 *
 * @example
 * // Link button
 * <ytz-button href="/dashboard">Dashboard</ytz-button>
 *
 * @example
 * // Disabled button
 * <ytz-button [disabled]="true">Cannot click</ytz-button>
 *
 * @example
 * // Submit button
 * <ytz-button type="submit">Submit Form</ytz-button>
 */
@Component({
  selector: 'ytz-button',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <ytz-button
      #button
      [attr.href]="href || null"
      [attr.disabled]="disabled ? '' : null"
      [attr.type]="type"
      (click)="onNativeClick($event)"
    >
      <ng-content></ng-content>
    </ytz-button>
  `,
  styles: [],
})
export class ButtonComponent implements OnInit, OnDestroy {
  /**
   * Optional href - if provided, renders as a link <a> instead of <button>.
   */
  @Input() href: string = ''

  /**
   * Disable the button (only applies when rendered as button, not link).
   */
  @Input() disabled: boolean = false

  /**
   * Button type attribute (button, submit, or reset).
   * Only applies when rendered as button (no href).
   */
  @Input() type: 'button' | 'submit' | 'reset' = 'button'

  /**
   * Click event emitted when button is clicked.
   * Note: Named buttonClick to avoid conflict with native click event.
   */
  @Output() buttonClick = new EventEmitter<MouseEvent>()

  @ViewChild('button', { static: false }) nativeElement!: ElementRef<HTMLElement>

  ngOnInit() {
    // Ensure Web Component is available
    if (typeof window !== 'undefined' && !customElements.get('ytz-button')) {
      console.warn(
        '@grimoire/yetzirah-angular: ytz-button Web Component not found. ' +
        'Make sure to import @grimoire/yetzirah-core in your application.'
      )
    }
  }

  ngOnDestroy() {
    // Cleanup if needed
  }

  /**
   * Handle native click event from the Web Component.
   */
  onNativeClick(event: MouseEvent) {
    if (!this.disabled) {
      this.buttonClick.emit(event)
    }
  }
}
