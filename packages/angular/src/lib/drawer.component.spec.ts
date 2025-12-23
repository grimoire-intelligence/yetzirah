import { ComponentFixture, TestBed } from '@angular/core/testing'
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { DrawerComponent } from './drawer.component'

describe('DrawerComponent', () => {
  let component: DrawerComponent
  let fixture: ComponentFixture<DrawerComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrawerComponent, FormsModule, ReactiveFormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents()

    fixture = TestBed.createComponent(DrawerComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should have default open value of false', () => {
    expect(component.open).toBe(false)
  })

  it('should have default anchor value of left', () => {
    expect(component.anchor).toBe('left')
  })

  it('should emit close event', () => {
    const closeSpy = jest.spyOn(component.close, 'emit')
    const mockEvent = new CustomEvent('close')

    // Simulate event from web component
    component['closeHandler'](mockEvent)

    expect(closeSpy).toHaveBeenCalled()
  })

  it('should emit openChange event when drawer closes', () => {
    const openChangeSpy = jest.spyOn(component.openChange, 'emit')
    const mockEvent = new CustomEvent('close')

    component['closeHandler'](mockEvent)

    expect(openChangeSpy).toHaveBeenCalledWith(false)
  })

  it('should update open value on close event', () => {
    component.open = true
    const mockEvent = new CustomEvent('close')

    component['closeHandler'](mockEvent)

    expect(component.open).toBe(false)
  })

  describe('ControlValueAccessor', () => {
    it('should implement writeValue', () => {
      component.writeValue(true)
      expect(component.open).toBe(true)
    })

    it('should handle null value in writeValue', () => {
      component.writeValue(null)
      expect(component.open).toBe(false)
    })

    it('should implement registerOnChange', () => {
      const fn = jest.fn()
      component.registerOnChange(fn)

      const mockEvent = new CustomEvent('close')
      component['closeHandler'](mockEvent)

      expect(fn).toHaveBeenCalledWith(false)
    })

    it('should implement registerOnTouched', () => {
      const fn = jest.fn()
      component.registerOnTouched(fn)
      expect(component['onTouched']).toBe(fn)
    })

    it('should call onTouched on close event', () => {
      const fn = jest.fn()
      component.registerOnTouched(fn)

      const mockEvent = new CustomEvent('close')
      component['closeHandler'](mockEvent)

      expect(fn).toHaveBeenCalled()
    })

    it('should implement setDisabledState', () => {
      // Drawer doesn't have disabled state, but method should exist
      expect(() => component.setDisabledState(true)).not.toThrow()
    })
  })

  describe('anchor positions', () => {
    it('should accept left anchor', () => {
      component.anchor = 'left'
      expect(component.anchor).toBe('left')
    })

    it('should accept right anchor', () => {
      component.anchor = 'right'
      expect(component.anchor).toBe('right')
    })

    it('should accept top anchor', () => {
      component.anchor = 'top'
      expect(component.anchor).toBe('top')
    })

    it('should accept bottom anchor', () => {
      component.anchor = 'bottom'
      expect(component.anchor).toBe('bottom')
    })
  })
})
