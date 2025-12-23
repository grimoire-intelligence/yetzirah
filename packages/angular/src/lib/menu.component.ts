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
 * Angular wrapper for ytz-menu Web Component.
 * Provides a dropdown menu with keyboard navigation.
 *
 * @example
 * <ytz-menu [open]="isOpen" (openEvent)="onOpen()" (closeEvent)="onClose()">
 *   <button slot="trigger">Open Menu</button>
 *   <ytz-menuitem>Edit</ytz-menuitem>
 *   <ytz-menuitem>Delete</ytz-menuitem>
 * </ytz-menu>
 *
 * @example
 * <ytz-menu placement="bottom-start">
 *   <ytz-menu-trigger>Actions</ytz-menu-trigger>
 *   <ytz-menuitem value="edit">Edit</ytz-menuitem>
 *   <ytz-menuitem [disabled]="true">Archive</ytz-menuitem>
 * </ytz-menu>
 */
@Component({
  selector: 'ytz-menu',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <ng-content></ng-content>
  `,
  styles: []
})
export class MenuComponent implements AfterViewInit, OnDestroy {
  /**
   * Whether the menu is open
   */
  @Input() open: boolean = false;

  /**
   * Menu placement relative to trigger
   */
  @Input() placement: string = 'bottom-start';

  /**
   * Emitted when the menu opens
   */
  @Output() openEvent = new EventEmitter<CustomEvent>();

  /**
   * Emitted when the menu closes
   */
  @Output() closeEvent = new EventEmitter<CustomEvent>();

  @ViewChild('menuElement', { read: ElementRef }) menuElement!: ElementRef;

  private openHandler = (e: Event) => {
    this.openEvent.emit(e as CustomEvent);
  };

  private closeHandler = (e: Event) => {
    this.closeEvent.emit(e as CustomEvent);
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
      el.addEventListener('open', this.openHandler);
      el.addEventListener('close', this.closeHandler);
    }
  }

  private removeEventListeners() {
    const el = this.getNativeElement();
    if (el) {
      el.removeEventListener('open', this.openHandler);
      el.removeEventListener('close', this.closeHandler);
    }
  }

  private getNativeElement() {
    // For standalone components with template, get the host element itself
    // since we're using selector: 'ytz-menu'
    if (typeof window !== 'undefined') {
      return document.querySelector('ytz-menu');
    }
    return null;
  }
}
