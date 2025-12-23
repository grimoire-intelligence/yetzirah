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
 * Angular wrapper for ytz-listbox Web Component.
 * Implements ControlValueAccessor for use with ngModel and reactive forms.
 * Provides keyboard-navigable list selection with single/multi-select modes.
 *
 * @example
 * // Reactive Forms - Single Select
 * <ytz-listbox [formControl]="selectedControl">
 *   <ytz-option value="opt1">Option 1</ytz-option>
 *   <ytz-option value="opt2">Option 2</ytz-option>
 * </ytz-listbox>
 *
 * @example
 * // Template-driven Forms - Multi Select
 * <ytz-listbox [(ngModel)]="selectedValues" [multiple]="true">
 *   <ytz-option value="a">Option A</ytz-option>
 *   <ytz-option value="b">Option B</ytz-option>
 * </ytz-listbox>
 *
 * @example
 * // Disabled state
 * <ytz-listbox [disabled]="true">
 *   <ytz-option value="opt1">Option 1</ytz-option>
 * </ytz-listbox>
 */
@Component({
  selector: 'ytz-listbox',
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
      useExisting: forwardRef(() => ListboxComponent),
      multi: true
    }
  ]
})
export class ListboxComponent implements ControlValueAccessor, AfterViewInit, OnDestroy {
  /**
   * The current selected value(s) - string for single select, array for multi select
   */
  @Input() value: string | string[] = '';

  /**
   * Enable multi-select mode
   */
  @Input() multiple: boolean = false;

  /**
   * Disable listbox interactions
   */
  @Input() disabled: boolean = false;

  /**
   * Emitted when the selection changes
   */
  @Output() change = new EventEmitter<CustomEvent>();

  @ViewChild('listboxElement', { read: ElementRef }) listboxElement!: ElementRef;

  private onChange: ((value: string | string[]) => void) | null = null;
  private onTouched: (() => void) | null = null;

  private changeHandler = (e: Event) => {
    const customEvent = e as CustomEvent;
    const newValue = customEvent.detail?.value ?? (e.target as any).value;
    this.value = newValue;
    this.change.emit(customEvent);

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
      this.value = value;
      const el = this.getNativeElement();
      if (el) {
        (el as any).value = value;
      }
    }
  }

  registerOnChange(fn: (value: string | string[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    const el = this.getNativeElement();
    if (el) {
      if (isDisabled) {
        el.setAttribute('disabled', '');
      } else {
        el.removeAttribute('disabled');
      }
    }
  }

  private setupEventListeners() {
    const el = this.getNativeElement();
    if (el) {
      el.addEventListener('change', this.changeHandler);
    }
  }

  private removeEventListeners() {
    const el = this.getNativeElement();
    if (el) {
      el.removeEventListener('change', this.changeHandler);
    }
  }

  private getNativeElement() {
    // For standalone components with template, get the host element itself
    // since we're using selector: 'ytz-listbox'
    if (typeof window !== 'undefined') {
      return document.querySelector('ytz-listbox');
    }
    return null;
  }
}
