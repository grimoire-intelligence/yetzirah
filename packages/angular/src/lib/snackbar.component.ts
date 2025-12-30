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
  OnDestroy
} from '@angular/core';
import '@grimoire/yetzirah-core';

/**
 * Snackbar position options
 */
export type SnackbarPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

/**
 * Dismiss event detail
 */
export interface SnackbarDismissDetail {
  reason: 'timeout' | 'manual';
}

/**
 * Angular wrapper for ytz-snackbar Web Component.
 * Provides toast notifications with auto-dismiss and queue management.
 *
 * @example
 * // Basic usage with two-way binding
 * <g-snackbar [(open)]="showSnackbar" position="bottom-center">
 *   File saved successfully!
 * </g-snackbar>
 *
 * @example
 * // Programmatic control
 * <g-snackbar #snackbar [duration]="3000" [dismissible]="true">
 *   Action completed
 * </g-snackbar>
 * <button (click)="snackbar.show('Custom message')">Show</button>
 */
@Component({
  selector: 'g-snackbar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <ytz-snackbar
      #snackbarElement
      (dismiss)="onDismiss($event)"
    >
      <ng-content></ng-content>
    </ytz-snackbar>
  `,
  styles: []
})
export class SnackbarComponent implements AfterViewInit, OnDestroy {
  private _open: boolean = false;
  private _duration: number = 5000;
  private _position: SnackbarPosition = 'bottom-center';
  private _dismissible: boolean = false;
  private _maxVisible: number = 3;

  /**
   * Whether the snackbar is open
   */
  @Input()
  get open(): boolean {
    return this._open;
  }
  set open(value: boolean) {
    this._open = value;
    this.syncAttribute('open', value);
  }

  /**
   * Auto-dismiss duration in milliseconds
   */
  @Input()
  get duration(): number {
    return this._duration;
  }
  set duration(value: number) {
    this._duration = value;
    this.syncProperty('duration', value);
  }

  /**
   * Snackbar position on screen
   */
  @Input()
  get position(): SnackbarPosition {
    return this._position;
  }
  set position(value: SnackbarPosition) {
    this._position = value;
    this.syncProperty('position', value);
  }

  /**
   * Show close button
   */
  @Input()
  get dismissible(): boolean {
    return this._dismissible;
  }
  set dismissible(value: boolean) {
    this._dismissible = value;
    this.syncAttribute('dismissible', value);
  }

  /**
   * Maximum number of visible stacked snackbars
   */
  @Input()
  get maxVisible(): number {
    return this._maxVisible;
  }
  set maxVisible(value: number) {
    this._maxVisible = value;
    this.syncProperty('maxVisible', value);
  }

  /**
   * Emitted when the snackbar is dismissed
   */
  @Output() dismiss = new EventEmitter<CustomEvent<SnackbarDismissDetail>>();

  /**
   * Emitted when open state changes (for two-way binding)
   */
  @Output() openChange = new EventEmitter<boolean>();

  @ViewChild('snackbarElement', { read: ElementRef, static: false }) snackbarElement?: ElementRef<HTMLElement>;

  ngAfterViewInit() {
    // Sync initial state after view is initialized
    this.syncAttribute('open', this._open);
    this.syncProperty('duration', this._duration);
    this.syncProperty('position', this._position);
    this.syncAttribute('dismissible', this._dismissible);
    this.syncProperty('maxVisible', this._maxVisible);
  }

  ngOnDestroy() {
    // Cleanup is handled by the web component
  }

  /**
   * Handle dismiss event from the web component
   */
  onDismiss(event: Event) {
    const customEvent = event as CustomEvent<SnackbarDismissDetail>;
    this._open = false;
    this.dismiss.emit(customEvent);
    this.openChange.emit(false);
  }

  /**
   * Programmatically show the snackbar
   * @param message Optional message to display
   */
  show(message?: string): void {
    if (this.snackbarElement?.nativeElement) {
      const element = this.snackbarElement.nativeElement as any;
      if (typeof element.show === 'function') {
        element.show(message);
      }
    }
    this._open = true;
    this.openChange.emit(true);
  }

  /**
   * Programmatically dismiss the snackbar
   */
  dismissSnackbar(): void {
    if (this.snackbarElement?.nativeElement) {
      const element = this.snackbarElement.nativeElement as any;
      if (typeof element.dismiss === 'function') {
        element.dismiss();
      }
    }
  }

  private syncAttribute(name: string, value: boolean) {
    if (this.snackbarElement?.nativeElement) {
      const element = this.snackbarElement.nativeElement as any;
      if (value) {
        element.setAttribute(name, '');
      } else {
        element.removeAttribute(name);
      }
    }
  }

  private syncProperty(name: string, value: any) {
    if (this.snackbarElement?.nativeElement) {
      const element = this.snackbarElement.nativeElement as any;
      element[name] = value;
    }
  }
}
