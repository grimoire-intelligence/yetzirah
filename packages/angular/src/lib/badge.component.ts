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
 * Badge position options
 */
export type BadgePosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

/**
 * Angular wrapper for ytz-badge Web Component.
 * Provides notification badge with dot, count, and hidden modes.
 *
 * @example
 * // Dot badge
 * <g-badge>
 *   <g-icon-button icon="notifications"></g-icon-button>
 * </g-badge>
 *
 * @example
 * // Count badge
 * <g-badge [value]="5">
 *   <g-icon-button icon="mail"></g-icon-button>
 * </g-badge>
 *
 * @example
 * // Max cap badge
 * <g-badge [value]="99" [max]="50">
 *   <g-icon-button icon="inbox"></g-icon-button>
 * </g-badge>
 */
@Component({
  selector: 'g-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <ytz-badge
      #badgeElement
    >
      <ng-content></ng-content>
    </ytz-badge>
  `,
  styles: []
})
export class BadgeComponent implements AfterViewInit {
  private _value: string | number | null = null;
  private _max: number | undefined;
  private _position: BadgePosition = 'top-right';
  private _hidden: boolean = false;

  /**
   * Badge value. Null for dot mode, number/string for count mode.
   */
  @Input()
  get value(): string | number | null {
    return this._value;
  }
  set value(value: string | number | null) {
    this._value = value;
    this.syncValue();
  }

  /**
   * Maximum displayed value. Shows "max+" when exceeded.
   */
  @Input()
  get max(): number | undefined {
    return this._max;
  }
  set max(value: number | undefined) {
    this._max = value;
    if (value !== undefined) {
      this.syncProperty('max', value);
    }
  }

  /**
   * Badge position relative to slotted content
   */
  @Input()
  get position(): BadgePosition {
    return this._position;
  }
  set position(value: BadgePosition) {
    this._position = value;
    this.syncProperty('position', value);
  }

  /**
   * Force hide the badge
   */
  @Input()
  get hidden(): boolean {
    return this._hidden;
  }
  set hidden(value: boolean) {
    this._hidden = value;
    this.syncHidden();
  }

  /**
   * Whether the badge is in dot mode (no value)
   */
  get isDot(): boolean {
    return this._value === null || this._value === undefined;
  }

  /**
   * Whether the badge should be hidden
   */
  get isHidden(): boolean {
    return this._hidden || this._value === 0 || this._value === '0';
  }

  /**
   * Computed display value with max+ logic
   */
  get displayValue(): string | null {
    if (this.isDot || this.isHidden) return null;
    if (this._max !== undefined && typeof this._value === 'number' && this._value > this._max) {
      return `${this._max}+`;
    }
    return String(this._value);
  }

  @ViewChild('badgeElement', { read: ElementRef, static: false }) badgeElement?: ElementRef<HTMLElement>;

  ngAfterViewInit() {
    // Sync initial state after view is initialized
    this.syncValue();
    this.syncProperty('position', this._position);
    if (this._max !== undefined) {
      this.syncProperty('max', this._max);
    }
    this.syncHidden();
  }

  private syncValue() {
    if (this.badgeElement?.nativeElement) {
      const element = this.badgeElement.nativeElement as any;
      if (this._value !== null && this._value !== undefined) {
        element.setAttribute('value', String(this._value));
      } else {
        element.removeAttribute('value');
      }
    }
  }

  private syncHidden() {
    if (this.badgeElement?.nativeElement) {
      const element = this.badgeElement.nativeElement as any;
      if (this.isHidden) {
        element.setAttribute('hidden', '');
      } else {
        element.removeAttribute('hidden');
      }
    }
  }

  private syncProperty(name: string, value: any) {
    if (this.badgeElement?.nativeElement) {
      const element = this.badgeElement.nativeElement as any;
      element[name] = value;
    }
  }
}
