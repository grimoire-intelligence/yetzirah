import { ComponentFixture, TestBed } from '@angular/core/testing'
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { AutocompleteComponent } from './autocomplete.component'

describe('AutocompleteComponent', () => {
  let component: AutocompleteComponent
  let fixture: ComponentFixture<AutocompleteComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutocompleteComponent, FormsModule, ReactiveFormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents()

    fixture = TestBed.createComponent(AutocompleteComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should have default open value of false', () => {
    expect(component.open).toBe(false)
  })

  it('should have default multiple value of false', () => {
    expect(component.multiple).toBe(false)
  })

  it('should have default loading value of false', () => {
    expect(component.loading).toBe(false)
  })

  it('should have default filter value of true', () => {
    expect(component.filter).toBe(true)
  })

  it('should emit change event', () => {
    const changeSpy = jest.spyOn(component.change, 'emit')
    const mockEvent = new CustomEvent('change', {
      detail: { value: 'apple', option: {} }
    })

    // Simulate event from web component
    component['changeHandler'](mockEvent)

    expect(changeSpy).toHaveBeenCalled()
  })

  it('should emit open event', () => {
    const openSpy = jest.spyOn(component.openChange, 'emit')
    const mockEvent = new CustomEvent('open')

    component['openHandler'](mockEvent)

    expect(openSpy).toHaveBeenCalled()
    expect(component.open).toBe(true)
  })

  it('should emit close event', () => {
    const closeSpy = jest.spyOn(component.closeChange, 'emit')
    const mockEvent = new CustomEvent('close')

    component['closeHandler'](mockEvent)

    expect(closeSpy).toHaveBeenCalled()
    expect(component.open).toBe(false)
  })

  it('should emit inputChange event', () => {
    const inputChangeSpy = jest.spyOn(component.inputChange, 'emit')
    const mockEvent = new CustomEvent('input-change', {
      detail: { value: 'app' }
    })

    component['inputChangeHandler'](mockEvent)

    expect(inputChangeSpy).toHaveBeenCalled()
  })

  describe('ControlValueAccessor', () => {
    it('should implement writeValue for single value', () => {
      component.writeValue('apple')
      expect(component['value']).toBe('apple')
    })

    it('should implement writeValue for multiple values', () => {
      component.multiple = true
      component.writeValue(['apple', 'banana'])
      expect(component['value']).toEqual(['apple', 'banana'])
    })

    it('should handle null value in writeValue for single select', () => {
      component.writeValue(null)
      expect(component['value']).toBe('')
    })

    it('should handle null value in writeValue for multi-select', () => {
      component.multiple = true
      component.writeValue(null)
      expect(component['value']).toEqual([])
    })

    it('should implement registerOnChange', () => {
      const fn = jest.fn()
      component.registerOnChange(fn)

      const mockEvent = new CustomEvent('change', {
        detail: { value: 'apple' }
      })
      component['changeHandler'](mockEvent)

      expect(fn).toHaveBeenCalledWith('apple')
    })

    it('should implement registerOnTouched', () => {
      const fn = jest.fn()
      component.registerOnTouched(fn)
      expect(component['onTouched']).toBe(fn)
    })

    it('should call onTouched on change', () => {
      const fn = jest.fn()
      component.registerOnTouched(fn)

      const mockEvent = new CustomEvent('change', {
        detail: { value: 'apple' }
      })
      component['changeHandler'](mockEvent)

      expect(fn).toHaveBeenCalled()
    })

    it('should call onTouched on close', () => {
      const fn = jest.fn()
      component.registerOnTouched(fn)

      const mockEvent = new CustomEvent('close')
      component['closeHandler'](mockEvent)

      expect(fn).toHaveBeenCalled()
    })

    it('should implement setDisabledState', () => {
      // Should not throw even though autocomplete doesn't have disabled state
      expect(() => component.setDisabledState(true)).not.toThrow()
      expect(() => component.setDisabledState(false)).not.toThrow()
    })
  })
})
