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
import '@grimoire/yetzirah-core';

/**
 * Angular wrapper for ytz-tooltip Web Component.
 * Shows positioned hint text on hover/focus with configurable delay and placement.
 *
 * @example
 * <ytz-tooltip>
 *   <button>Hover me</button>
 *   <span slot="content">Tooltip text</span>
 * </ytz-tooltip>
 *
 * @example
 * // With placement and delay
 * <ytz-tooltip placement="bottom" [delay]="200">
 *   <button>Hover me</button>
 *   <span slot="content">Bottom tooltip</span>
 * </ytz-tooltip>
 *
 * @example
 * // With custom offset
 * <ytz-tooltip placement="right" [offset]="12" (show)="onShow()" (hide)="onHide()">
 *   <button>Info</button>
 *   <span slot="content">Detailed information</span>
 * </ytz-tooltip>
 */
@Component({
  selector: 'ytz-tooltip',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <ng-content></ng-content>
  `,
  styles: []
})
export class TooltipComponent implements AfterViewInit, OnDestroy {
  /**
   * Tooltip placement relative to trigger element
   */
  @Input() placement: 'top' | 'bottom' | 'left' | 'right' = 'top';

  /**
   * Delay in milliseconds before showing tooltip on hover
   */
  @Input() delay: number = 0;

  /**
   * Offset in pixels from the trigger element
   */
  @Input() offset: number = 8;

  /**
   * Emitted when the tooltip is shown
   */
  @Output() show = new EventEmitter<CustomEvent>();

  /**
   * Emitted when the tooltip is hidden
   */
  @Output() hide = new EventEmitter<CustomEvent>();

  private showHandler = (e: Event) => {
    this.show.emit(e as CustomEvent);
  };

  private hideHandler = (e: Event) => {
    this.hide.emit(e as CustomEvent);
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
      el.addEventListener('show', this.showHandler);
      el.addEventListener('hide', this.hideHandler);
    }
  }

  private removeEventListeners() {
    const el = this.getNativeElement();
    if (el) {
      el.removeEventListener('show', this.showHandler);
      el.removeEventListener('hide', this.hideHandler);
    }
  }

  private getNativeElement() {
    // For standalone components with template, get the host element itself
    // since we're using selector: 'ytz-tooltip'
    if (typeof window !== 'undefined') {
      return document.querySelector('ytz-tooltip');
    }
    return null;
  }
}
