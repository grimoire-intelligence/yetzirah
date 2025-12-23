/**
 * Angular wrapper for ytz-icon-button Web Component.
 * Provides icon button with required label/aria-label for accessibility.
 *
 * @module @yetzirah/angular/icon-button
 */

import '@yetzirah/core'
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
 * IconButton component - button for icon-only actions.
 *
 * Standalone Angular component wrapping the ytz-icon-button Web Component.
 *
 * @example
 * <ytz-icon-button label="Close" (buttonClick)="close()">
 *   ✕
 * </ytz-icon-button>
 *
 * @example
 * <ytz-icon-button [label]="'Settings'" [disabled]="isDisabled" (buttonClick)="openSettings()">
 *   <svg>...</svg>
 * </ytz-icon-button>
 */
@Component({
  selector: 'ytz-icon-button',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <ytz-icon-button
      #iconButton
      [attr.aria-label]="label"
      [attr.disabled]="disabled ? '' : null"
      [attr.href]="href"
      (click)="onNativeClick($event)"
    >
      <ng-content></ng-content>
    </ytz-icon-button>
  `,
  styles: [],
})
export class IconButtonComponent implements OnInit, OnDestroy {
  /**
   * Accessible label for the icon button (required).
   * Maps to aria-label on the Web Component.
   */
  @Input() label: string = ''

  /**
   * Disable the button.
   */
  @Input() disabled: boolean = false

  /**
   * Optional href - if provided, renders as a link.
   */
  @Input() href: string = ''

  /**
   * Click event emitted when button is clicked.
   * Note: Named buttonClick to avoid conflict with native click event.
   */
  @Output() buttonClick = new EventEmitter<MouseEvent>()

  @ViewChild('iconButton', { static: false }) nativeElement!: ElementRef<HTMLElement>

  ngOnInit() {
    // Ensure Web Component is available
    if (typeof window !== 'undefined' && !customElements.get('ytz-icon-button')) {
      console.warn(
        '@yetzirah/angular: ytz-icon-button Web Component not found. ' +
        'Make sure to import @yetzirah/core in your application.'
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
