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
 * Angular wrapper for ytz-tabs Web Component.
 * Implements ControlValueAccessor for use with ngModel and reactive forms.
 * Provides a tabbed interface with keyboard navigation and ARIA support.
 *
 * @example
 * // Reactive Forms
 * <ytz-tabs [formControl]="tabControl">
 *   <ytz-tab panel="tab1">Account</ytz-tab>
 *   <ytz-tab panel="tab2">Settings</ytz-tab>
 *   <ytz-tabpanel id="tab1">Account content</ytz-tabpanel>
 *   <ytz-tabpanel id="tab2">Settings content</ytz-tabpanel>
 * </ytz-tabs>
 *
 * @example
 * // Template-driven Forms
 * <ytz-tabs [(ngModel)]="selectedTab">
 *   <ytz-tab panel="tab1">Account</ytz-tab>
 *   <ytz-tab panel="tab2">Settings</ytz-tab>
 *   <ytz-tabpanel id="tab1">Account content</ytz-tabpanel>
 *   <ytz-tabpanel id="tab2">Settings content</ytz-tabpanel>
 * </ytz-tabs>
 *
 * @example
 * // Vertical orientation
 * <ytz-tabs [orientation]="'vertical'">
 *   <ytz-tab panel="tab1">Account</ytz-tab>
 *   <ytz-tabpanel id="tab1">Account content</ytz-tabpanel>
 * </ytz-tabs>
 */
@Component({
  selector: 'ytz-tabs',
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
      useExisting: forwardRef(() => TabsComponent),
      multi: true
    }
  ]
})
export class TabsComponent implements ControlValueAccessor, AfterViewInit, OnDestroy {
  /**
   * The currently selected tab panel ID
   */
  @Input() value: string = '';

  /**
   * Orientation of the tabs (horizontal or vertical)
   */
  @Input() orientation: 'horizontal' | 'vertical' = 'horizontal';

  /**
   * Emitted when the selected tab changes
   */
  @Output() change = new EventEmitter<CustomEvent>();

  @ViewChild('tabsElement', { read: ElementRef }) tabsElement!: ElementRef;

  private onChange: ((value: string) => void) | null = null;
  private onTouched: (() => void) | null = null;

  private changeHandler = (e: Event) => {
    const customEvent = e as CustomEvent;
    const newValue = customEvent.detail?.value ?? (e.target as any).value;
    this.value = newValue;
    this.change.emit(customEvent);

    if (this.onChange) {
      this.onChange(newValue);
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
      this.value = String(value);
      const el = this.getNativeElement();
      if (el) {
        el.setAttribute('value', this.value);
      }
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Tabs component doesn't have a disabled state
  }

  private setupEventListeners() {
    const el = this.getNativeElement();
    if (el) {
      el.addEventListener('change', this.changeHandler);
    }
  }

  private removeEventListeners() {
    const el = this.getNativeElement();
    if (el) {
      el.removeEventListener('change', this.changeHandler);
    }
  }

  private getNativeElement() {
    // For standalone components with template, get the host element itself
    // since we're using selector: 'ytz-tabs'
    if (typeof window !== 'undefined') {
      return document.querySelector('ytz-tabs');
    }
    return null;
  }
}
