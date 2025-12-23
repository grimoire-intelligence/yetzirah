import { ComponentFixture, TestBed } from '@angular/core/testing'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { AutocompleteOptionComponent } from './autocomplete-option.component'

describe('AutocompleteOptionComponent', () => {
  let component: AutocompleteOptionComponent
  let fixture: ComponentFixture<AutocompleteOptionComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutocompleteOptionComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents()

    fixture = TestBed.createComponent(AutocompleteOptionComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should have default value of empty string', () => {
    expect(component.value).toBe('')
  })

  it('should have default disabled value of false', () => {
    expect(component.disabled).toBe(false)
  })

  it('should have default selected value of false', () => {
    expect(component.selected).toBe(false)
  })

  it('should accept value input', () => {
    component.value = 'test-value'
    expect(component.value).toBe('test-value')
  })

  it('should accept disabled input', () => {
    component.disabled = true
    expect(component.disabled).toBe(true)
  })

  it('should accept selected input', () => {
    component.selected = true
    expect(component.selected).toBe(true)
  })
})
