import {
  Component,
  Input,
  Output,
  EventEmitter,
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectionStrategy,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import '@yetzirah/core';

/**
 * Angular wrapper for ytz-theme-toggle Web Component.
 * Provides theme switching with persistence and system preference detection.
 *
 * @example
 * <ytz-theme-toggle (themeChange)="onThemeChange($event)"></ytz-theme-toggle>
 *
 * @example
 * <ytz-theme-toggle [theme]="'dark'" (themeChange)="onThemeChange($event)">
 *   Dark mode
 * </ytz-theme-toggle>
 */
@Component({
  selector: 'ytz-theme-toggle',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <ng-content></ng-content>
  `,
  styles: []
})
export class ThemeToggleComponent implements AfterViewInit, OnDestroy {
  /**
   * Current theme ('light' | 'dark')
   */
  @Input() theme: 'light' | 'dark' = 'light';

  /**
   * Emitted when the theme changes
   */
  @Output() themeChange = new EventEmitter<CustomEvent>();

  private themeChangeHandler = (e: Event) => {
    this.themeChange.emit(e as CustomEvent);
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
      el.addEventListener('themechange', this.themeChangeHandler);
    }
  }

  private removeEventListeners() {
    const el = this.getNativeElement();
    if (el) {
      el.removeEventListener('themechange', this.themeChangeHandler);
    }
  }

  private getNativeElement() {
    // For standalone components with template, get the host element itself
    // since we're using selector: 'ytz-theme-toggle'
    if (typeof window !== 'undefined') {
      return document.querySelector('ytz-theme-toggle');
    }
    return null;
  }
}
