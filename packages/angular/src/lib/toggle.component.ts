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
 * Angular wrapper for ytz-toggle Web Component.
 * Implements ControlValueAccessor for use with ngModel and reactive forms.
 * Provides a toggle switch with checkbox semantics and aria-checked.
 *
 * @example
 * // Reactive Forms
 * <ytz-toggle [formControl]="toggleControl"></ytz-toggle>
 *
 * @example
 * // Template-driven Forms
 * <ytz-toggle [(ngModel)]="enabled"></ytz-toggle>
 *
 * @example
 * // Disabled state
 * <ytz-toggle [disabled]="true">Premium feature</ytz-toggle>
 */
@Component({
  selector: 'ytz-toggle',
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
      useExisting: forwardRef(() => ToggleComponent),
      multi: true
    }
  ]
})
export class ToggleComponent implements ControlValueAccessor, AfterViewInit, OnDestroy {
  /**
   * Whether the toggle is checked
   */
  @Input() checked: boolean = false;

  /**
   * Disable toggle interactions
   */
  @Input() disabled: boolean = false;

  /**
   * Emitted when the toggle state changes
   */
  @Output() change = new EventEmitter<CustomEvent>();

  @ViewChild('toggleElement', { read: ElementRef }) toggleElement!: ElementRef;

  private onChange: ((value: boolean) => void) | null = null;
  private onTouched: (() => void) | null = null;

  private changeHandler = (e: Event) => {
    const customEvent = e as CustomEvent;
    const newValue = customEvent.detail?.checked ?? (e.target as any).checked;
    this.checked = newValue;
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
      this.checked = Boolean(value);
      const el = this.getNativeElement();
      if (el) {
        if (this.checked) {
          el.setAttribute('checked', '');
        } else {
          el.removeAttribute('checked');
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
    // since we're using selector: 'ytz-toggle'
    if (typeof window !== 'undefined') {
      return document.querySelector('ytz-toggle');
    }
    return null;
  }
}
