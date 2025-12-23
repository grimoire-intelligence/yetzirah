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
 * Angular wrapper for ytz-drawer Web Component.
 * Implements ControlValueAccessor for use with ngModel and reactive forms.
 * Provides a slide-in panel with focus trap and backdrop.
 *
 * @example
 * // Two-way binding with ngModel
 * <ytz-drawer [(ngModel)]="isOpen" anchor="left">
 *   <nav>Menu items</nav>
 * </ytz-drawer>
 *
 * @example
 * // Property binding
 * <ytz-drawer [open]="isMenuOpen" (openChange)="onMenuChange($event)" anchor="right">
 *   <div>Drawer content</div>
 * </ytz-drawer>
 *
 * @example
 * // Different anchor positions
 * <ytz-drawer anchor="top">...</ytz-drawer>
 * <ytz-drawer anchor="bottom">...</ytz-drawer>
 */
@Component({
  selector: 'ytz-drawer',
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
      useExisting: forwardRef(() => DrawerComponent),
      multi: true
    }
  ]
})
export class DrawerComponent implements ControlValueAccessor, AfterViewInit, OnDestroy {
  /**
   * Whether the drawer is open
   */
  @Input() open: boolean = false;

  /**
   * Anchor position of the drawer
   */
  @Input() anchor: 'left' | 'right' | 'top' | 'bottom' = 'left';

  /**
   * Emitted when the drawer is closed
   */
  @Output() close = new EventEmitter<CustomEvent>();

  /**
   * Emitted when the open state changes (for two-way binding)
   */
  @Output() openChange = new EventEmitter<boolean>();

  @ViewChild('drawerElement', { read: ElementRef }) drawerElement!: ElementRef;

  private onChange: ((value: boolean) => void) | null = null;
  private onTouched: (() => void) | null = null;

  private closeHandler = (e: Event) => {
    const customEvent = e as CustomEvent;
    this.open = false;
    this.close.emit(customEvent);
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
    // Drawer doesn't have a disabled state, but we implement this for ControlValueAccessor
  }

  private setupEventListeners() {
    const el = this.getNativeElement();
    if (el) {
      el.addEventListener('close', this.closeHandler);
    }
  }

  private removeEventListeners() {
    const el = this.getNativeElement();
    if (el) {
      el.removeEventListener('close', this.closeHandler);
    }
  }

  private getNativeElement() {
    // For standalone components with template, get the host element itself
    // since we're using selector: 'ytz-drawer'
    if (typeof window !== 'undefined') {
      return document.querySelector('ytz-drawer');
    }
    return null;
  }
}
