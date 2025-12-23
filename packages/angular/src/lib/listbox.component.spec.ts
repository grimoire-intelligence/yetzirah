import { ComponentFixture, TestBed } from '@angular/core/testing'
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { ListboxComponent } from './listbox.component'

describe('ListboxComponent', () => {
  let component: ListboxComponent
  let fixture: ComponentFixture<ListboxComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListboxComponent, FormsModule, ReactiveFormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents()

    fixture = TestBed.createComponent(ListboxComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should have default value of empty string', () => {
    expect(component.value).toBe('')
  })

  it('should have default multiple value of false', () => {
    expect(component.multiple).toBe(false)
  })

  it('should have default disabled value of false', () => {
    expect(component.disabled).toBe(false)
  })

  it('should emit change event', () => {
    const changeSpy = jest.spyOn(component.change, 'emit')
    const mockEvent = new CustomEvent('change', { detail: { value: 'opt1' } })

    // Simulate event from web component
    component['changeHandler'](mockEvent)

    expect(changeSpy).toHaveBeenCalled()
  })

  it('should update value on change event (single select)', () => {
    const mockEvent = new CustomEvent('change', { detail: { value: 'opt1' } })

    component['changeHandler'](mockEvent)

    expect(component.value).toBe('opt1')
  })

  it('should update value on change event (multi select)', () => {
    component.multiple = true
    const mockEvent = new CustomEvent('change', { detail: { value: ['opt1', 'opt2'] } })

    component['changeHandler'](mockEvent)

    expect(component.value).toEqual(['opt1', 'opt2'])
  })

  describe('ControlValueAccessor', () => {
    it('should implement writeValue (single select)', () => {
      component.writeValue('opt1')
      expect(component.value).toBe('opt1')
    })

    it('should implement writeValue (multi select)', () => {
      component.multiple = true
      component.writeValue(['opt1', 'opt2'])
      expect(component.value).toEqual(['opt1', 'opt2'])
    })

    it('should handle null value in writeValue', () => {
      component.value = 'opt1'
      component.writeValue(null)
      expect(component.value).toBe('opt1') // null should not change the value
    })

    it('should implement registerOnChange', () => {
      const fn = jest.fn()
      component.registerOnChange(fn)

      const mockEvent = new CustomEvent('change', { detail: { value: 'opt1' } })
      component['changeHandler'](mockEvent)

      expect(fn).toHaveBeenCalledWith('opt1')
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
