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
 * Angular wrapper for ytz-dialog Web Component.
 * Provides modal dialog with focus trap, scroll lock, and keyboard navigation.
 *
 * @example
 * // Basic usage with two-way binding
 * <g-dialog [(open)]="isDialogOpen">
 *   <h2>Dialog Title</h2>
 *   <p>Dialog content goes here</p>
 *   <button (click)="isDialogOpen = false">Close</button>
 * </g-dialog>
 *
 * @example
 * // Static dialog (no backdrop dismiss)
 * <g-dialog [(open)]="showDialog" [static]="true">
 *   <p>Click escape or the button to close</p>
 * </g-dialog>
 */
@Component({
  selector: 'g-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <ytz-dialog
      #dialogElement
      (close)="onClose($event)"
    >
      <ng-content></ng-content>
    </ytz-dialog>
  `,
  styles: []
})
export class DialogComponent implements AfterViewInit, OnDestroy {
  private _open: boolean = false;
  private _static: boolean = false;

  /**
   * Whether the dialog is open
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
   * Prevent backdrop click from closing dialog
   */
  @Input()
  get static(): boolean {
    return this._static;
  }
  set static(value: boolean) {
    this._static = value;
    this.syncAttribute('static', value);
  }

  /**
   * Emitted when the dialog is closed
   */
  @Output() close = new EventEmitter<CustomEvent>();

  /**
   * Emitted when open state changes (for two-way binding)
   */
  @Output() openChange = new EventEmitter<boolean>();

  @ViewChild('dialogElement', { read: ElementRef, static: false }) dialogElement?: ElementRef<HTMLElement>;

  ngAfterViewInit() {
    // Sync initial state after view is initialized
    this.syncAttribute('open', this._open);
    this.syncAttribute('static', this._static);
  }

  ngOnDestroy() {
    // Cleanup is handled by the web component
  }

  /**
   * Handle close event from the web component
   */
  onClose(event: Event) {
    const customEvent = event as CustomEvent;
    this._open = false;
    this.close.emit(customEvent);
    this.openChange.emit(false);
  }

  private syncAttribute(name: string, value: boolean) {
    if (this.dialogElement?.nativeElement) {
      const element = this.dialogElement.nativeElement as any;
      if (value) {
        element.setAttribute(name, '');
      } else {
        element.removeAttribute(name);
      }
    }
  }
}
