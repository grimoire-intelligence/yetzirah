import {
  Component,
  Input,
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  OnChanges
} from '@angular/core';
import '@grimoire/yetzirah-core';

/**
 * Angular wrapper for ytz-accordion Web Component.
 * Manages multiple accordion items with optional exclusive mode.
 *
 * @example
 * <ytz-accordion>
 *   <ytz-accordion-item>
 *     <button>Section 1</button>
 *     <div>Content 1</div>
 *   </ytz-accordion-item>
 *   <ytz-accordion-item>
 *     <button>Section 2</button>
 *     <div>Content 2</div>
 *   </ytz-accordion-item>
 * </ytz-accordion>
 *
 * @example
 * // Exclusive mode - only one item open at a time
 * <ytz-accordion [exclusive]="true">
 *   <ytz-accordion-item [open]="true">...</ytz-accordion-item>
 *   <ytz-accordion-item>...</ytz-accordion-item>
 * </ytz-accordion>
 */
@Component({
  selector: 'ytz-accordion',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <ng-content></ng-content>
  `,
  styles: []
})
export class AccordionComponent implements AfterViewInit, OnDestroy, OnChanges {
  /**
   * Whether exclusive mode is enabled (only one item open at a time)
   */
  @Input() exclusive: boolean = false;

  @ViewChild('accordionElement', { read: ElementRef }) accordionElement!: ElementRef;

  ngAfterViewInit() {
    this.updateExclusiveAttribute();
  }

  ngOnDestroy() {
    // Cleanup if needed
  }

  ngOnChanges() {
    if (this.getNativeElement()) {
      this.updateExclusiveAttribute();
    }
  }

  private updateExclusiveAttribute() {
    const el = this.getNativeElement();
    if (el) {
      if (this.exclusive) {
        el.setAttribute('exclusive', '');
      } else {
        el.removeAttribute('exclusive');
      }
    }
  }

  private getNativeElement() {
    // For standalone components with template, get the host element itself
    // since we're using selector: 'ytz-accordion'
    if (typeof window !== 'undefined') {
      return document.querySelector('ytz-accordion');
    }
    return null;
  }
}
