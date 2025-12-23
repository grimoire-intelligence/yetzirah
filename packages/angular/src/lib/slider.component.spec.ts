import { ComponentFixture, TestBed } from '@angular/core/testing'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { SliderComponent } from './slider.component'

describe('SliderComponent', () => {
  let component: SliderComponent
  let fixture: ComponentFixture<SliderComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SliderComponent, FormsModule, ReactiveFormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents()

    fixture = TestBed.createComponent(SliderComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should have default value of 0', () => {
    expect(component.value).toBe(0)
  })

  it('should have default min of 0', () => {
    expect(component.min).toBe(0)
  })

  it('should have default max of 100', () => {
    expect(component.max).toBe(100)
  })

  it('should have default step of 1', () => {
    expect(component.step).toBe(1)
  })

  it('should have default disabled value of false', () => {
    expect(component.disabled).toBe(false)
  })

  it('should emit change event', () => {
    const changeSpy = jest.spyOn(component.change, 'emit')
    const mockEvent = new CustomEvent('change', { detail: { value: 50 } })

    component['changeHandler'](mockEvent)

    expect(changeSpy).toHaveBeenCalled()
  })

  it('should update value on change event', () => {
    const mockEvent = new CustomEvent('change', { detail: { value: 75 } })

    component['changeHandler'](mockEvent)

    expect(component.value).toBe(75)
  })

  describe('ControlValueAccessor', () => {
    it('should implement writeValue', () => {
      component.writeValue(50)
      expect(component.value).toBe(50)
    })

    it('should handle null value in writeValue', () => {
      component.writeValue(null)
      expect(component.value).toBe(0)
    })

    it('should coerce string to number in writeValue', () => {
      component.writeValue('42' as any)
      expect(component.value).toBe(42)
    })

    it('should implement registerOnChange', () => {
      const fn = jest.fn()
      component.registerOnChange(fn)

      const mockEvent = new CustomEvent('change', { detail: { value: 50 } })
      component['changeHandler'](mockEvent)

      expect(fn).toHaveBeenCalledWith(50)
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
