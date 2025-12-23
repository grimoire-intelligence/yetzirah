import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DialogComponent } from './dialog.component';

describe('DialogComponent', () => {
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(DialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default open value of false', () => {
    expect(component.open).toBe(false);
  });

  it('should have default static value of false', () => {
    expect(component.static).toBe(false);
  });

  it('should emit close event when dialog closes', () => {
    const closeSpy = jest.spyOn(component.close, 'emit');
    const mockEvent = new CustomEvent('close');

    // Simulate close event from web component
    component.onClose(mockEvent);

    expect(closeSpy).toHaveBeenCalledWith(mockEvent);
  });

  it('should emit openChange event when dialog closes', () => {
    const openChangeSpy = jest.spyOn(component.openChange, 'emit');
    const mockEvent = new CustomEvent('close');

    // Simulate close event from web component
    component.onClose(mockEvent);

    expect(openChangeSpy).toHaveBeenCalledWith(false);
  });

  it('should update open state when close event fires', () => {
    component.open = true;
    const mockEvent = new CustomEvent('close');

    component.onClose(mockEvent);

    expect(component.open).toBe(false);
  });

  it('should accept static property', () => {
    component.static = true;
    fixture.detectChanges();
    expect(component.static).toBe(true);
  });

  it('should set open attribute when open is true', () => {
    component.open = true;
    fixture.detectChanges();

    const dialogElement = fixture.nativeElement.querySelector('ytz-dialog');
    expect(dialogElement?.hasAttribute('open')).toBe(true);
  });

  it('should not set open attribute when open is false', () => {
    component.open = false;
    fixture.detectChanges();

    const dialogElement = fixture.nativeElement.querySelector('ytz-dialog');
    expect(dialogElement?.hasAttribute('open')).toBe(false);
  });

  it('should set static attribute when static is true', () => {
    component.static = true;
    fixture.detectChanges();

    const dialogElement = fixture.nativeElement.querySelector('ytz-dialog');
    expect(dialogElement?.hasAttribute('static')).toBe(true);
  });
});
