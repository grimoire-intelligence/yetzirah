import {
  Component,
  Input,
  Output,
  EventEmitter,
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  forwardRef
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import '@grimoire/yetzirah-core';

/**
 * Angular wrapper for ytz-popover Web Component.
 * Click-triggered positioned content for interactive overlays.
 * Implements ControlValueAccessor for two-way binding of open state via [(open)].
 *
 * @example
 * // Two-way binding for open state
 * <ytz-popover [(open)]="isOpen" placement="bottom">
 *   <button>Open menu</button>
 *   <div slot="content" class="pa3 bg-white shadow-2 br2">
 *     <p>Popover content</p>
 *     <button (click)="isOpen = false">Close</button>
 *   </div>
 * </ytz-popover>
 *
 * @example
 * // Uncontrolled - manages its own state
 * <ytz-popover placement="top">
 *   <button>Settings</button>
 *   <div slot="content">
 *     <label><input type="checkbox"> Enable notifications</label>
 *   </div>
 * </ytz-popover>
 */
@Component({
  selector: 'ytz-popover',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <ng-content></ng-content>
  `,
  styles: [],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PopoverComponent),
      multi: true
    }
  ]
})
export class PopoverComponent implements ControlValueAccessor, AfterViewInit, OnDestroy {
  /**
   * Whether the popover is open
   */
  @Input() open: boolean = false;

  /**
   * Position of popover relative to trigger
   */
  @Input() placement: 'top' | 'bottom' | 'left' | 'right' = 'bottom';

  /**
   * Gap between trigger and popover content in pixels
   */
  @Input() offset: number = 8;

  /**
   * Emitted when the popover shows
   */
  @Output() show = new EventEmitter<CustomEvent>();

  /**
   * Emitted when the popover hides
   */
  @Output() hide = new EventEmitter<CustomEvent>();

  /**
   * Emitted when the open state changes (for two-way binding)
   */
  @Output() openChange = new EventEmitter<boolean>();

  @ViewChild('popoverElement', { read: ElementRef }) popoverElement!: ElementRef;

  private onChange: ((value: boolean) => void) | null = null;
  private onTouched: (() => void) | null = null;

  private showHandler = (e: Event) => {
    const customEvent = e as CustomEvent;
    this.open = true;
    this.show.emit(customEvent);
    this.openChange.emit(true);

    if (this.onChange) {
      this.onChange(true);
    }
  };

  private hideHandler = (e: Event) => {
    const customEvent = e as CustomEvent;
    this.open = false;
    this.hide.emit(customEvent);
    this.openChange.emit(false);

    if (this.onChange) {
      this.onChange(false);
    }
    if (this.onTouched) {
      this.onTouched();
    }
  };

  ngAfterViewInit() {
    this.setupEventListeners();
  }

  ngOnDestroy() {
    this.removeEventListeners();
  }

  // ControlValueAccessor implementation
  writeValue(value: any): void {
    if (value !== null && value !== undefined) {
      this.open = Boolean(value);
      const el = this.getNativeElement();
      if (el) {
        if (this.open) {
          el.setAttribute('open', '');
        } else {
          el.removeAttribute('open');
        }
      }
    }
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Popover doesn't have a disabled state
  }

  private setupEventListeners() {
    const el = this.getNativeElement();
    if (el) {
      el.addEventListener('show', this.showHandler);
      el.addEventListener('hide', this.hideHandler);
    }
  }

  private removeEventListeners() {
    const el = this.getNativeElement();
    if (el) {
      el.removeEventListener('show', this.showHandler);
      el.removeEventListener('hide', this.hideHandler);
    }
  }

  private getNativeElement() {
    // For standalone components with template, get the host element itself
    // since we're using selector: 'ytz-popover'
    if (typeof window !== 'undefined') {
      return document.querySelector('ytz-popover');
    }
    return null;
  }
}
