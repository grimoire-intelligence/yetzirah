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
 * Angular wrapper for ytz-menuitem Web Component.
 * Individual menu item within a ytz-menu.
 *
 * @example
 * <ytz-menuitem value="edit">Edit</ytz-menuitem>
 *
 * @example
 * <ytz-menuitem [disabled]="true">Disabled Action</ytz-menuitem>
 *
 * @example
 * <ytz-menuitem (select)="onSelect($event)">Delete</ytz-menuitem>
 */
@Component({
  selector: 'ytz-menuitem',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <ng-content></ng-content>
  `,
  styles: []
})
export class MenuItemComponent implements AfterViewInit, OnDestroy {
  /**
   * Optional value for the menu item
   */
  @Input() value?: string;

  /**
   * Disable menu item interactions
   */
  @Input() disabled: boolean = false;

  /**
   * Emitted when the menu item is selected
   */
  @Output() select = new EventEmitter<CustomEvent>();

  @ViewChild('menuItemElement', { read: ElementRef }) menuItemElement!: ElementRef;

  private selectHandler = (e: Event) => {
    this.select.emit(e as CustomEvent);
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
      el.addEventListener('select', this.selectHandler);
    }
  }

  private removeEventListeners() {
    const el = this.getNativeElement();
    if (el) {
      el.removeEventListener('select', this.selectHandler);
    }
  }

  private getNativeElement() {
    // For standalone components with template, get the host element itself
    // since we're using selector: 'ytz-menuitem'
    if (typeof window !== 'undefined') {
      return document.querySelector('ytz-menuitem');
    }
    return null;
  }
}
