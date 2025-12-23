import { ComponentFixture, TestBed } from '@angular/core/testing'
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { ToggleComponent } from './toggle.component'

describe('ToggleComponent', () => {
  let component: ToggleComponent
  let fixture: ComponentFixture<ToggleComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToggleComponent, FormsModule, ReactiveFormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents()

    fixture = TestBed.createComponent(ToggleComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should have default checked value of false', () => {
    expect(component.checked).toBe(false)
  })

  it('should have default disabled value of false', () => {
    expect(component.disabled).toBe(false)
  })

  it('should emit change event', () => {
    const changeSpy = jest.spyOn(component.change, 'emit')
    const mockEvent = new CustomEvent('change', { detail: { checked: true } })

    // Simulate event from web component
    component['changeHandler'](mockEvent)

    expect(changeSpy).toHaveBeenCalled()
  })

  it('should update checked value on change event', () => {
    const mockEvent = new CustomEvent('change', { detail: { checked: true } })

    component['changeHandler'](mockEvent)

    expect(component.checked).toBe(true)
  })

  describe('ControlValueAccessor', () => {
    it('should implement writeValue', () => {
      component.writeValue(true)
      expect(component.checked).toBe(true)
    })

    it('should handle null value in writeValue', () => {
      component.writeValue(null)
      expect(component.checked).toBe(false)
    })

    it('should implement registerOnChange', () => {
      const fn = jest.fn()
      component.registerOnChange(fn)

      const mockEvent = new CustomEvent('change', { detail: { checked: true } })
      component['changeHandler'](mockEvent)

      expect(fn).toHaveBeenCalledWith(true)
    })

    it('should implement registerOnTouched', () => {
      const fn = jest.fn()
      component.registerOnTouched(fn)
      expect(component['onTouched']).toBe(fn)
    })

    it('should implement setDisabledState', () => {
      component.setDisabledState(true)
      expect(component.disabled).toBe(true)
    })
  })
})
