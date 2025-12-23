import { ComponentFixture, TestBed } from '@angular/core/testing'
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { DisclosureComponent } from './disclosure.component'

describe('DisclosureComponent', () => {
  let component: DisclosureComponent
  let fixture: ComponentFixture<DisclosureComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisclosureComponent, FormsModule, ReactiveFormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents()

    fixture = TestBed.createComponent(DisclosureComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should have default open value of false', () => {
    expect(component.open).toBe(false)
  })

  it('should emit toggle event', () => {
    const toggleSpy = jest.spyOn(component.toggle, 'emit')
    const mockEvent = new CustomEvent('toggle', { detail: { open: true } })

    // Simulate event from web component
    component['toggleHandler'](mockEvent)

    expect(toggleSpy).toHaveBeenCalled()
  })

  it('should update open value on toggle event', () => {
    const mockEvent = new CustomEvent('toggle', { detail: { open: true } })

    component['toggleHandler'](mockEvent)

    expect(component.open).toBe(true)
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

      const mockEvent = new CustomEvent('toggle', { detail: { open: true } })
      component['toggleHandler'](mockEvent)

      expect(fn).toHaveBeenCalledWith(true)
    })

    it('should implement registerOnTouched', () => {
      const fn = jest.fn()
      component.registerOnTouched(fn)
      expect(component['onTouched']).toBe(fn)
    })

    it('should implement setDisabledState', () => {
      // Disclosure doesn't have disabled state, but method should exist
      expect(() => component.setDisabledState(true)).not.toThrow()
    })
  })
})
