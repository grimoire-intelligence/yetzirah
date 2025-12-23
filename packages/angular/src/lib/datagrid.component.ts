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
  OnChanges,
  SimpleChanges
} from '@angular/core';
import '@grimoire/yetzirah-core';

/**
 * Column definition interface for DataGrid columns.
 */
export interface DataGridColumn {
  /** Data field name to display */
  key: string;
  /** Column header text */
  header: string;
  /** Optional column width (CSS value) */
  width?: string;
  /** Enable column sorting */
  sortable?: boolean;
}

/**
 * Interface for the ytz-datagrid web component element
 */
interface DataGridElement extends Element {
  data?: any[];
}

/**
 * Angular wrapper for ytz-datagrid Web Component.
 * Provides a virtualized data grid with sorting, filtering, and keyboard navigation.
 *
 * @example
 * <ytz-datagrid
 *   [data]="rows"
 *   [columns]="cols"
 *   [rowHeight]="40"
 *   (rowClick)="onRowClick($event)">
 * </ytz-datagrid>
 *
 * @example
 * const cols: DataGridColumn[] = [
 *   { key: 'name', header: 'Name', sortable: true },
 *   { key: 'email', header: 'Email' },
 *   { key: 'age', header: 'Age', width: '80px' }
 * ];
 * const rows = [
 *   { name: 'John', email: 'john@example.com', age: 30 },
 *   { name: 'Jane', email: 'jane@example.com', age: 28 }
 * ];
 */
@Component({
  selector: 'ytz-datagrid',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <ng-content></ng-content>
  `,
  styles: []
})
export class DataGridComponent implements AfterViewInit, OnDestroy, OnChanges {
  /**
   * Array of row data objects to display in the grid
   */
  @Input() data: any[] = [];

  /**
   * Array of column definitions
   */
  @Input() columns: DataGridColumn[] = [];

  /**
   * Row height in pixels
   */
  @Input() rowHeight: number = 40;

  /**
   * Enable virtual scrolling optimization
   */
  @Input() virtualScroll: boolean = true;

  /**
   * Emitted when a column header is clicked for sorting.
   * Detail: { field: string, direction: 'asc' | 'desc' }
   */
  @Output() sort = new EventEmitter<CustomEvent>();

  /**
   * Emitted when a row is clicked.
   * Detail: { row: object, index: number }
   */
  @Output() rowClick = new EventEmitter<CustomEvent>();

  @ViewChild('datagridElement', { read: ElementRef }) datagridElement!: ElementRef;

  private sortHandler = (e: Event) => {
    this.sort.emit(e as CustomEvent);
  };

  private rowClickHandler = (e: Event) => {
    this.rowClick.emit(e as CustomEvent);
  };

  ngAfterViewInit() {
    this.setupEventListeners();
    this.syncData();
  }

  ngOnDestroy() {
    this.removeEventListeners();
  }

  ngOnChanges(changes: SimpleChanges) {
    // Sync data when it changes after view initialization
    if (changes['data'] && !changes['data'].firstChange) {
      this.syncData();
    }
    // Sync row height when it changes
    if (changes['rowHeight'] && !changes['rowHeight'].firstChange) {
      this.syncRowHeight();
    }
  }

  private setupEventListeners() {
    const el = this.getNativeElement();
    if (el) {
      el.addEventListener('sort', this.sortHandler);
      el.addEventListener('rowselect', this.rowClickHandler);
    }
  }

  private removeEventListeners() {
    const el = this.getNativeElement();
    if (el) {
      el.removeEventListener('sort', this.sortHandler);
      el.removeEventListener('rowselect', this.rowClickHandler);
    }
  }

  private syncData() {
    const el = this.getNativeElement();
    if (!el || !this.data) return;

    // Set data via property (not attribute) for better performance
    el.data = this.data;

    // Generate column elements if columns are defined
    if (this.columns && this.columns.length > 0) {
      this.renderColumns(el);
    }
  }

  private syncRowHeight() {
    const el = this.getNativeElement();
    if (!el) return;
    el.setAttribute('row-height', String(this.rowHeight));
  }

  private renderColumns(el: DataGridElement) {
    // Clear existing column elements
    const existingColumns = el.querySelectorAll('ytz-datagrid-column');
    existingColumns.forEach((col) => col.remove());

    // Create new column elements from columns input
    this.columns.forEach(colDef => {
      const colEl = document.createElement('ytz-datagrid-column');
      colEl.setAttribute('field', colDef.key);
      colEl.setAttribute('header', colDef.header);

      if (colDef.width) {
        colEl.setAttribute('width', colDef.width);
      }

      if (colDef.sortable) {
        colEl.setAttribute('sortable', '');
      }

      el.appendChild(colEl);
    });
  }

  private getNativeElement(): DataGridElement | null {
    // For standalone components with template, get the host element itself
    // since we're using selector: 'ytz-datagrid'
    if (typeof window !== 'undefined') {
      return document.querySelector('ytz-datagrid');
    }
    return null;
  }
}
