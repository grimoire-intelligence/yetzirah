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
 * Angular wrapper for ytz-select Web Component.
 * Implements ControlValueAccessor for use with ngModel and reactive forms.
 * Provides a dropdown select with trigger button and listbox.
 *
 * @example
 * // Reactive Forms - Single Select
 * <ytz-select [formControl]="selectedControl" placeholder="Choose...">
 *   <ytz-option value="opt1">Option 1</ytz-option>
 *   <ytz-option value="opt2">Option 2</ytz-option>
 * </ytz-select>
 *
 * @example
 * // Template-driven Forms - Multi Select
 * <ytz-select [(ngModel)]="selectedValues" [multiple]="true">
 *   <ytz-option value="a">Option A</ytz-option>
 *   <ytz-option value="b">Option B</ytz-option>
 * </ytz-select>
 *
 * @example
 * // Disabled state
 * <ytz-select [disabled]="true" placeholder="Select...">
 *   <ytz-option value="opt1">Option 1</ytz-option>
 * </ytz-select>
 */
@Component({
  selector: 'ytz-select',
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
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ]
})
export class SelectComponent implements ControlValueAccessor, AfterViewInit, OnDestroy {
  /**
   * The current selected value(s) - string for single select, array for multi select
   */
  @Input() value: string | string[] = '';

  /**
   * Whether the select dropdown is open
   */
  @Input() open: boolean = false;

  /**
   * Enable multi-select mode
   */
  @Input() multiple: boolean = false;

  /**
   * Disable select interactions
   */
  @Input() disabled: boolean = false;

  /**
   * Placeholder text when no selection is made
   */
  @Input() placeholder: string = 'Select...';

  /**
   * Emitted when the selection changes
   */
  @Output() change = new EventEmitter<CustomEvent>();

  /**
   * Emitted when the dropdown is opened
   */
  @Output() openEvent = new EventEmitter<CustomEvent>();

  /**
   * Emitted when the dropdown is closed
   */
  @Output() close = new EventEmitter<CustomEvent>();

  /**
   * Emitted when the selection is cleared
   */
  @Output() clear = new EventEmitter<CustomEvent>();

  @ViewChild('selectElement', { read: ElementRef }) selectElement!: ElementRef;

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

  private openHandler = (e: Event) => {
    const customEvent = e as CustomEvent;
    this.open = true;
    this.openEvent.emit(customEvent);
  };

  private closeHandler = (e: Event) => {
    const customEvent = e as CustomEvent;
    this.open = false;
    this.close.emit(customEvent);

    if (this.onTouched) {
      this.onTouched();
    }
  };

  private clearHandler = (e: Event) => {
    const customEvent = e as CustomEvent;
    this.value = this.multiple ? [] : '';
    this.clear.emit(customEvent);

    if (this.onChange) {
      this.onChange(this.value);
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
      el.addEventListener('open', this.openHandler);
      el.addEventListener('close', this.closeHandler);
      el.addEventListener('clear', this.clearHandler);
    }
  }

  private removeEventListeners() {
    const el = this.getNativeElement();
    if (el) {
      el.removeEventListener('change', this.changeHandler);
      el.removeEventListener('open', this.openHandler);
      el.removeEventListener('close', this.closeHandler);
      el.removeEventListener('clear', this.clearHandler);
    }
  }

  private getNativeElement() {
    // For standalone components with template, get the host element itself
    // since we're using selector: 'ytz-select'
    if (typeof window !== 'undefined') {
      return document.querySelector('ytz-select');
    }
    return null;
  }
}
