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
 * Angular wrapper for ytz-autocomplete Web Component.
 * Implements ControlValueAccessor for use with ngModel and reactive forms.
 * Provides text input with filterable dropdown selection.
 *
 * @example
 * // Reactive Forms
 * <ytz-autocomplete [formControl]="autocompleteControl">
 *   <input slot="input" placeholder="Search...">
 *   <ytz-option value="apple">Apple</ytz-option>
 *   <ytz-option value="banana">Banana</ytz-option>
 * </ytz-autocomplete>
 *
 * @example
 * // Template-driven Forms
 * <ytz-autocomplete [(ngModel)]="selectedValue">
 *   <input slot="input" placeholder="Search...">
 *   <ytz-option value="apple">Apple</ytz-option>
 * </ytz-autocomplete>
 *
 * @example
 * // Multi-select mode
 * <ytz-autocomplete [multiple]="true" [(ngModel)]="selectedValues">
 *   <input slot="input" placeholder="Select...">
 *   <ytz-option value="a">Option A</ytz-option>
 *   <ytz-option value="b">Option B</ytz-option>
 * </ytz-autocomplete>
 */
@Component({
  selector: 'ytz-autocomplete',
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
      useExisting: forwardRef(() => AutocompleteComponent),
      multi: true
    }
  ]
})
export class AutocompleteComponent implements ControlValueAccessor, AfterViewInit, OnDestroy {
  /**
   * Whether the dropdown is open
   */
  @Input() open: boolean = false;

  /**
   * Enable multi-select mode
   */
  @Input() multiple: boolean = false;

  /**
   * Show loading indicator
   */
  @Input() loading: boolean = false;

  /**
   * Enable/disable filtering of options
   */
  @Input() filter: boolean = true;

  /**
   * Emitted when the selected value changes
   */
  @Output() change = new EventEmitter<CustomEvent>();

  /**
   * Emitted when the dropdown opens
   */
  @Output() openChange = new EventEmitter<CustomEvent>();

  /**
   * Emitted when the dropdown closes
   */
  @Output() closeChange = new EventEmitter<CustomEvent>();

  /**
   * Emitted when the input value changes
   */
  @Output() inputChange = new EventEmitter<CustomEvent>();

  @ViewChild('autocompleteElement', { read: ElementRef }) autocompleteElement!: ElementRef;

  private value: string | string[] = '';
  private onChange: ((value: string | string[]) => void) | null = null;
  private onTouched: (() => void) | null = null;

  private changeHandler = (e: Event) => {
    const customEvent = e as CustomEvent;
    const newValue = customEvent.detail?.value;
    this.value = newValue;
    this.change.emit(customEvent);

    if (this.onChange) {
      this.onChange(newValue);
    }
    if (this.onTouched) {
      this.onTouched();
    }
  };

  private openHandler = (e: Event) => {
    const customEvent = e as CustomEvent;
    this.open = true;
    this.openChange.emit(customEvent);
  };

  private closeHandler = (e: Event) => {
    const customEvent = e as CustomEvent;
    this.open = false;
    this.closeChange.emit(customEvent);
    if (this.onTouched) {
      this.onTouched();
    }
  };

  private inputChangeHandler = (e: Event) => {
    const customEvent = e as CustomEvent;
    this.inputChange.emit(customEvent);
  };

  ngAfterViewInit() {
    this.setupEventListeners();
  }

  ngOnDestroy() {
    this.removeEventListeners();
  }

  // ControlValueAccessor implementation
  writeValue(value: any): void {
    this.value = value ?? (this.multiple ? [] : '');
    const el = this.getNativeElement();
    if (el) {
      el.value = this.value;
    }
  }

  registerOnChange(fn: (value: string | string[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Autocomplete doesn't have a disabled state in the core component
    // This is here for ControlValueAccessor interface completeness
  }

  private setupEventListeners() {
    const el = this.getNativeElement();
    if (el) {
      el.addEventListener('change', this.changeHandler);
      el.addEventListener('open', this.openHandler);
      el.addEventListener('close', this.closeHandler);
      el.addEventListener('input-change', this.inputChangeHandler);
    }
  }

  private removeEventListeners() {
    const el = this.getNativeElement();
    if (el) {
      el.removeEventListener('change', this.changeHandler);
      el.removeEventListener('open', this.openHandler);
      el.removeEventListener('close', this.closeHandler);
      el.removeEventListener('input-change', this.inputChangeHandler);
    }
  }

  private getNativeElement(): (HTMLElement & { value?: string | string[] }) | null {
    // For standalone components with template, get the host element itself
    // since we're using selector: 'ytz-autocomplete'
    if (typeof window !== 'undefined') {
      return document.querySelector('ytz-autocomplete') as (HTMLElement & { value?: string | string[] }) | null;
    }
    return null;
  }
}
