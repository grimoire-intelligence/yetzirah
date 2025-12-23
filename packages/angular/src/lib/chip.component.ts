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
import '@yetzirah/core';

/**
 * Angular wrapper for ytz-chip Web Component.
 * Provides a deletable tag/label with keyboard support.
 *
 * @example
 * <ytz-chip [deletable]="true" (delete)="onDelete()">Tag</ytz-chip>
 *
 * @example
 * <ytz-chip [disabled]="true">Read-only tag</ytz-chip>
 */
@Component({
  selector: 'ytz-chip',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <ng-content></ng-content>
  `,
  styles: []
})
export class ChipComponent implements AfterViewInit, OnDestroy {
  /**
   * Show delete button on the chip
   */
  @Input() deletable: boolean = false;

  /**
   * Disable chip interactions
   */
  @Input() disabled: boolean = false;

  /**
   * Emitted when the chip delete button is clicked or Delete/Backspace key is pressed
   */
  @Output() delete = new EventEmitter<CustomEvent>();

  @ViewChild('chipElement', { read: ElementRef }) chipElement!: ElementRef;

  private deleteHandler = (e: Event) => {
    this.delete.emit(e as CustomEvent);
  };

  ngAfterViewInit() {
    this.setupEventListeners();
  }

  ngOnDestroy() {
    this.removeEventListeners();
  }

  private setupEventListeners() {
    const el = this.getNativeElement();
    if (el) {
      el.addEventListener('delete', this.deleteHandler);
    }
  }

  private removeEventListeners() {
    const el = this.getNativeElement();
    if (el) {
      el.removeEventListener('delete', this.deleteHandler);
    }
  }

  private getNativeElement() {
    // For standalone components with template, get the host element itself
    // since we're using selector: 'ytz-chip'
    if (typeof window !== 'undefined') {
      return document.querySelector('ytz-chip');
    }
    return null;
  }
}
