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
import '@yetzirah/core';

/**
 * Angular wrapper for ytz-slider Web Component.
 * Implements ControlValueAccessor for use with ngModel and reactive forms.
 * Provides a range slider with keyboard and mouse/touch support.
 *
 * @example
 * // Reactive Forms
 * <ytz-slider [formControl]="sliderControl" [min]="0" [max]="100"></ytz-slider>
 *
 * @example
 * // Template-driven Forms
 * <ytz-slider [(ngModel)]="volume" [min]="0" [max]="100" [step]="5"></ytz-slider>
 */
@Component({
  selector: 'ytz-slider',
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
      useExisting: forwardRef(() => SliderComponent),
      multi: true
    }
  ]
})
export class SliderComponent implements ControlValueAccessor, AfterViewInit, OnDestroy {
  /**
   * The current value of the slider
   */
  @Input() value: number = 0;

  /**
   * Minimum slider value
   */
  @Input() min: number = 0;

  /**
   * Maximum slider value
   */
  @Input() max: number = 100;

  /**
   * Step increment for slider movement
   */
  @Input() step: number = 1;

  /**
   * Disable slider interactions
   */
  @Input() disabled: boolean = false;

  /**
   * Emitted when the slider value changes
   */
  @Output() change = new EventEmitter<CustomEvent>();

  @ViewChild('sliderElement', { read: ElementRef }) sliderElement!: ElementRef;

  private onChange: ((value: number) => void) | null = null;
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
      this.value = Number(value);
      const el = this.getNativeElement();
      if (el) {
        el.setAttribute('value', String(this.value));
      }
    }
  }

  registerOnChange(fn: (value: number) => void): void {
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
    // since we're using selector: 'ytz-slider'
    if (typeof window !== 'undefined') {
      return document.querySelector('ytz-slider');
    }
    return null;
  }
}
