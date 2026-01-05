import {
  Component,
  Input,
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  AfterViewInit
} from '@angular/core';
import '@grimoire/yetzirah-core';

/**
 * Progress size options
 */
export type ProgressSize = 'small' | 'medium' | 'large';

/**
 * Angular wrapper for ytz-progress Web Component.
 * Provides progress indicator with circular and linear modes.
 *
 * @example
 * // Indeterminate spinner
 * <g-progress></g-progress>
 *
 * @example
 * // Determinate progress
 * <g-progress [value]="75"></g-progress>
 *
 * @example
 * // Linear progress bar
 * <g-progress [value]="50" [linear]="true"></g-progress>
 */
@Component({
  selector: 'g-progress',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <ytz-progress
      #progressElement
    >
    </ytz-progress>
  `,
  styles: []
})
export class ProgressComponent implements AfterViewInit {
  private _value: number | null = null;
  private _linear: boolean = false;
  private _size: ProgressSize = 'medium';
  private _label: string | undefined;

  /**
   * Progress value 0-100, null for indeterminate
   */
  @Input()
  get value(): number | null {
    return this._value;
  }
  set value(value: number | null) {
    this._value = value;
    this.syncValue();
  }

  /**
   * Use linear bar instead of circular spinner
   */
  @Input()
  get linear(): boolean {
    return this._linear;
  }
  set linear(value: boolean) {
    this._linear = value;
    this.syncAttribute('linear', value);
  }

  /**
   * Size variant
   */
  @Input()
  get size(): ProgressSize {
    return this._size;
  }
  set size(value: ProgressSize) {
    this._size = value;
    this.syncProperty('size', value);
  }

  /**
   * Accessible label for screen readers
   */
  @Input()
  get label(): string | undefined {
    return this._label;
  }
  set label(value: string | undefined) {
    this._label = value;
    if (value !== undefined) {
      this.syncProperty('label', value);
    }
  }

  /**
   * Whether the progress is in indeterminate mode
   */
  get indeterminate(): boolean {
    return this._value === null || this._value === undefined;
  }

  @ViewChild('progressElement', { read: ElementRef, static: false }) progressElement?: ElementRef<HTMLElement>;

  ngAfterViewInit() {
    // Sync initial state after view is initialized
    this.syncValue();
    this.syncAttribute('linear', this._linear);
    this.syncProperty('size', this._size);
    if (this._label !== undefined) {
      this.syncProperty('label', this._label);
    }
  }

  private syncValue() {
    if (this.progressElement?.nativeElement) {
      const element = this.progressElement.nativeElement as any;
      if (this._value !== null && this._value !== undefined) {
        element.setAttribute('value', String(this._value));
      } else {
        element.removeAttribute('value');
      }
    }
  }

  private syncAttribute(name: string, value: boolean) {
    if (this.progressElement?.nativeElement) {
      const element = this.progressElement.nativeElement as any;
      if (value) {
        element.setAttribute(name, '');
      } else {
        element.removeAttribute(name);
      }
    }
  }

  private syncProperty(name: string, value: any) {
    if (this.progressElement?.nativeElement) {
      const element = this.progressElement.nativeElement as any;
      element[name] = value;
    }
  }
}
