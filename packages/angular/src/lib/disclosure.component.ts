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
 * Angular wrapper for ytz-disclosure Web Component.
 * Implements ControlValueAccessor for use with ngModel and reactive forms.
 * Provides expandable/collapsible content with proper ARIA attributes.
 *
 * @example
 * // Reactive Forms
 * <ytz-disclosure [formControl]="disclosureControl">
 *   <button>Show Details</button>
 *   <div>Hidden content...</div>
 * </ytz-disclosure>
 *
 * @example
 * // Template-driven Forms
 * <ytz-disclosure [(ngModel)]="isOpen">
 *   <button>Toggle</button>
 *   <div>Content</div>
 * </ytz-disclosure>
 *
 * @example
 * // Initially open
 * <ytz-disclosure [open]="true">
 *   <button>Hide Details</button>
 *   <div>Visible content...</div>
 * </ytz-disclosure>
 */
@Component({
  selector: 'ytz-disclosure',
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
      useExisting: forwardRef(() => DisclosureComponent),
      multi: true
    }
  ]
})
export class DisclosureComponent implements ControlValueAccessor, AfterViewInit, OnDestroy {
  /**
   * Whether the disclosure is open
   */
  @Input() open: boolean = false;

  /**
   * Emitted when the disclosure state changes
   */
  @Output() toggle = new EventEmitter<CustomEvent>();

  @ViewChild('disclosureElement', { read: ElementRef }) disclosureElement!: ElementRef;

  private onChange: ((value: boolean) => void) | null = null;
  private onTouched: (() => void) | null = null;

  private toggleHandler = (e: Event) => {
    const customEvent = e as CustomEvent;
    const newValue = customEvent.detail?.open ?? (e.target as any).open;
    this.open = newValue;
    this.toggle.emit(customEvent);

    if (this.onChange) {
      this.onChange(newValue);
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
    // Disclosure doesn't have a disabled state, but we implement this for ControlValueAccessor
  }

  private setupEventListeners() {
    const el = this.getNativeElement();
    if (el) {
      el.addEventListener('toggle', this.toggleHandler);
    }
  }

  private removeEventListeners() {
    const el = this.getNativeElement();
    if (el) {
      el.removeEventListener('toggle', this.toggleHandler);
    }
  }

  private getNativeElement() {
    // For standalone components with template, get the host element itself
    // since we're using selector: 'ytz-disclosure'
    if (typeof window !== 'undefined') {
      return document.querySelector('ytz-disclosure');
    }
    return null;
  }
}
